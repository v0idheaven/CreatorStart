import { google } from "googleapis"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"

const BACKEND_URL = process.env.BACKEND_URL || "https://creator-start-backend.onrender.com"
const FRONTEND_URL = process.env.FRONTEND_URL || "https://creator-start.vercel.app"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}

function getOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${BACKEND_URL}/api/v1/auth/google/callback`
    )
}

const googleAuthRedirect = asyncHandler(async (_req, res) => {
    const oauth2Client = getOAuthClient()
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/yt-analytics.readonly",
        ]
    })
    res.redirect(url)
})

const googleAuthCallback = asyncHandler(async (req, res) => {
    const { code } = req.query
    if (!code) throw new ApiError(400, "No code from Google")

    const oauth2Client = getOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
    const { data: googleUser } = await oauth2.userinfo.get()
    const { id: googleId, email, name, picture } = googleUser

    let user = await User.findOne({ $or: [{ googleId }, { email }] })

    if (!user) {
        const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + Date.now().toString().slice(-4)
        user = await User.create({
            fullName: name,
            email,
            username,
            password: Math.random().toString(36).slice(-12) + "Aa1!",
            avatar: picture,
            googleId,
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token || "",
        })
    } else {
        user.googleId = googleId
        user.googleAccessToken = tokens.access_token
        if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token
        if (!user.avatar && picture) user.avatar = picture
        await user.save({ validateBeforeSave: false })
    }

    try {
        const youtube = google.youtube({ version: "v3", auth: oauth2Client })
        const channelRes = await youtube.channels.list({
            part: ["snippet", "statistics", "brandingSettings"],
            mine: true
        })
        const channel = channelRes.data.items?.[0]
        if (channel) {
            user.youtubeChannelId = channel.id
            user.youtubeStats = {
                channelId: channel.id,
                title: channel.snippet?.title,
                description: channel.snippet?.description,
                thumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url,
                subscribers: channel.statistics?.subscriberCount,
                views: channel.statistics?.viewCount,
                videos: channel.statistics?.videoCount,
                country: channel.snippet?.country,
                publishedAt: channel.snippet?.publishedAt,
            }
            user.youtubeStatsUpdatedAt = new Date()
            await user.save({ validateBeforeSave: false })
        }
    } catch (e) {
        console.error("YouTube stats fetch failed:", e.message)
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const safeUser = await User.findById(user._id).select("-password -refreshToken -googleAccessToken -googleRefreshToken")

    res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect(`${FRONTEND_URL}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(safeUser))}`)
})

const refreshYoutubeStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user.googleAccessToken) throw new ApiError(400, "YouTube not connected")

    const oauth2Client = getOAuthClient()
    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    })

    const youtube = google.youtube({ version: "v3", auth: oauth2Client })
    const channelRes = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true
    })
    const channel = channelRes.data.items?.[0]
    if (!channel) throw new ApiError(404, "No YouTube channel found")

    const stats = {
        channelId: channel.id,
        title: channel.snippet?.title,
        description: channel.snippet?.description,
        thumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url,
        subscribers: channel.statistics?.subscriberCount,
        views: channel.statistics?.viewCount,
        videos: channel.statistics?.videoCount,
        country: channel.snippet?.country,
        publishedAt: channel.snippet?.publishedAt,
    }

    user.youtubeStats = stats
    user.youtubeStatsUpdatedAt = new Date()
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, { youtubeStats: stats }, "YouTube stats refreshed"))
})

const getYoutubeVideos = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user.googleAccessToken) throw new ApiError(400, "YouTube not connected")

    const oauth2Client = getOAuthClient()
    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    })

    const youtube = google.youtube({ version: "v3", auth: oauth2Client })

    let channelRes, playlistRes, statsRes
    try {
        channelRes = await youtube.channels.list({ part: ["contentDetails"], mine: true })
    } catch (e) {
        const msg = String(e?.message || "").replace(/<[^>]*>/g, "").trim()
        if (msg.toLowerCase().includes("quota")) throw new ApiError(429, "YouTube API quota exceeded for today. Try again after midnight Pacific Time.")
        throw new ApiError(502, msg || "Failed to fetch YouTube channel")
    }

    const uploadsPlaylistId = channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) throw new ApiError(404, "No uploads playlist found")

    try {
        playlistRes = await youtube.playlistItems.list({
            part: ["snippet", "contentDetails"],
            playlistId: uploadsPlaylistId,
            maxResults: 10
        })
    } catch (e) {
        const msg = String(e?.message || "").replace(/<[^>]*>/g, "").trim()
        if (msg.toLowerCase().includes("quota")) throw new ApiError(429, "YouTube API quota exceeded for today. Try again after midnight Pacific Time.")
        throw new ApiError(502, msg || "Failed to fetch playlist")
    }

    const videoIds = playlistRes.data.items?.map(i => i.contentDetails?.videoId).filter(Boolean)
    if (!videoIds?.length) return res.status(200).json(new ApiResponse(200, [], "No videos found"))

    try {
        statsRes = await youtube.videos.list({
            part: ["snippet", "statistics", "contentDetails"],
            id: videoIds.join(",")
        })
    } catch (e) {
        const msg = String(e?.message || "").replace(/<[^>]*>/g, "").trim()
        if (msg.toLowerCase().includes("quota")) throw new ApiError(429, "YouTube API quota exceeded for today. Try again after midnight Pacific Time.")
        throw new ApiError(502, msg || "Failed to fetch video stats")
    }

    const videos = statsRes.data.items?.map(v => {
        const dur = v.contentDetails?.duration || ""
        const match = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
        const seconds = (parseInt(match?.[1] || 0) * 3600) + (parseInt(match?.[2] || 0) * 60) + parseInt(match?.[3] || 0)
        const isShort = seconds > 0 && seconds <= 60
        return {
            id: v.id,
            title: v.snippet?.title,
            thumbnail: v.snippet?.thumbnails?.medium?.url || v.snippet?.thumbnails?.default?.url,
            publishedAt: v.snippet?.publishedAt,
            views: v.statistics?.viewCount || "0",
            likes: v.statistics?.likeCount || "0",
            comments: v.statistics?.commentCount || "0",
            url: isShort ? `https://youtube.com/shorts/${v.id}` : `https://youtube.com/watch?v=${v.id}`,
            type: isShort ? "Short" : "Video",
            duration: seconds
        }
    }) || []

    const totalViewsFromVideos = videos.reduce((sum, v) => sum + Number(v.views || 0), 0)
    if (user.youtubeStats && totalViewsFromVideos > Number(user.youtubeStats.views || 0)) {
        user.youtubeStats = { ...user.youtubeStats, views: String(totalViewsFromVideos) }
        await user.save({ validateBeforeSave: false })
    }

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched"))
})

const getYoutubeAnalytics = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user.googleAccessToken) throw new ApiError(400, "YouTube not connected")

    const oauth2Client = getOAuthClient()
    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    })

    const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth: oauth2Client })
    const days = parseInt(req.query.days) || 28
    const endDate = new Date().toISOString().split("T")[0]
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    try {
        const [overviewRes, dailyRes] = await Promise.all([
            youtubeAnalytics.reports.query({
                ids: "channel==MINE",
                startDate,
                endDate,
                metrics: "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares,impressions,impressionClickThroughRate",
            }),
            youtubeAnalytics.reports.query({
                ids: "channel==MINE",
                startDate,
                endDate,
                metrics: "views,estimatedMinutesWatched",
                dimensions: "day",
                sort: "day",
            })
        ])

        const headers = overviewRes.data.columnHeaders?.map(h => h.name) || []
        const row = overviewRes.data.rows?.[0] || []
        const overview = {}
        headers.forEach((h, i) => { overview[h] = row[i] || 0 })

        const dailyHeaders = dailyRes.data.columnHeaders?.map(h => h.name) || []
        const daily = (dailyRes.data.rows || []).map(r => {
            const obj = {}
            dailyHeaders.forEach((h, i) => { obj[h] = r[i] })
            return obj
        })

        return res.status(200).json(new ApiResponse(200, { overview, daily }, "Analytics fetched"))
    } catch (e) {
        const msg = String(e?.message || "").replace(/<[^>]*>/g, "").trim()
        if (msg.toLowerCase().includes("quota")) {
            throw new ApiError(429, "YouTube API quota exceeded for today. Try again after midnight Pacific Time.")
        }
        // For other analytics errors (e.g. new channel with no data), return empty gracefully
        return res.status(200).json(new ApiResponse(200, { overview: {}, daily: [] }, "No analytics data yet"))
    }
})

export { googleAuthRedirect, googleAuthCallback, refreshYoutubeStats, getYoutubeVideos, getYoutubeAnalytics }
