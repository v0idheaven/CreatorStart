import axios from "axios"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"

const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" }

const REDIRECT_URI = `${process.env.BACKEND_URL || "http://localhost:10000"}/api/v1/auth/instagram/callback`

// Step 1: redirect to Meta OAuth
const instagramAuthRedirect = asyncHandler(async (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.META_APP_ID,
        redirect_uri: REDIRECT_URI,
        scope: "public_profile,email",
        response_type: "code",
        state: "instagram_connect"
    })
    res.redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params}`)
})

// Step 2: handle callback
const instagramAuthCallback = asyncHandler(async (req, res) => {
    const { code, error } = req.query
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

    if (error || !code) {
        return res.redirect(`${frontendUrl}/auth/instagram/error?msg=${error || "no_code"}`)
    }

    // exchange code for access token
    const tokenRes = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
        params: {
            client_id: process.env.META_APP_ID,
            client_secret: process.env.META_APP_SECRET,
            redirect_uri: REDIRECT_URI,
            code
        }
    })

    const { access_token } = tokenRes.data

    // get long-lived token
    const longTokenRes = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
        params: {
            grant_type: "fb_exchange_token",
            client_id: process.env.META_APP_ID,
            client_secret: process.env.META_APP_SECRET,
            fb_exchange_token: access_token
        }
    })
    const longToken = longTokenRes.data.access_token || access_token

    // get Facebook user info
    const meRes = await axios.get("https://graph.facebook.com/v19.0/me", {
        params: { fields: "id,name,email,picture", access_token: longToken }
    })
    const fbUser = meRes.data

    // get Instagram accounts linked to this Facebook account
    let igStats = null
    try {
        const pagesRes = await axios.get(`https://graph.facebook.com/v19.0/${fbUser.id}/accounts`, {
            params: { access_token: longToken }
        })
        const pages = pagesRes.data?.data || []

        for (const page of pages) {
            try {
                const igRes = await axios.get(`https://graph.facebook.com/v19.0/${page.id}`, {
                    params: {
                        fields: "instagram_business_account",
                        access_token: page.access_token || longToken
                    }
                })
                const igId = igRes.data?.instagram_business_account?.id
                if (igId) {
                    const igInfoRes = await axios.get(`https://graph.facebook.com/v19.0/${igId}`, {
                        params: {
                            fields: "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website",
                            access_token: page.access_token || longToken
                        }
                    })
                    igStats = igInfoRes.data
                    break
                }
            } catch {}
        }
    } catch (e) {
        console.error("Instagram stats fetch failed:", e.message)
    }

    // find or create user
    let user = await User.findOne({ $or: [{ metaId: fbUser.id }, { email: fbUser.email }].filter(Boolean) })

    if (!user) {
        // need to be logged in to connect Instagram — redirect with token for linking
        const tokenData = encodeURIComponent(JSON.stringify({ longToken, fbUser, igStats }))
        return res.redirect(`${frontendUrl}/auth/instagram/callback?data=${tokenData}`)
    }

    // update existing user
    user.metaId = fbUser.id
    user.metaAccessToken = longToken
    if (igStats) {
        user.instagramStats = {
            id: igStats.id,
            username: igStats.username,
            name: igStats.name,
            bio: igStats.biography,
            followers: igStats.followers_count,
            following: igStats.follows_count,
            posts: igStats.media_count,
            profilePicture: igStats.profile_picture_url,
            website: igStats.website,
        }
        user.instagramStatsUpdatedAt = new Date()
    }
    await user.save({ validateBeforeSave: false })

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const safeUser = await User.findById(user._id).select("-password -refreshToken -googleAccessToken -googleRefreshToken -metaAccessToken")

    res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .redirect(`${frontendUrl}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(safeUser))}`)
})

// refresh Instagram stats (called from frontend when user is logged in)
const refreshInstagramStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user.metaAccessToken) throw new ApiError(400, "Instagram not connected")

    const longToken = user.metaAccessToken

    const meRes = await axios.get("https://graph.facebook.com/v19.0/me", {
        params: { fields: "id", access_token: longToken }
    })
    const fbId = meRes.data.id

    const pagesRes = await axios.get(`https://graph.facebook.com/v19.0/${fbId}/accounts`, {
        params: { access_token: longToken }
    })
    const pages = pagesRes.data?.data || []

    let igStats = null
    for (const page of pages) {
        try {
            const igRes = await axios.get(`https://graph.facebook.com/v19.0/${page.id}`, {
                params: { fields: "instagram_business_account", access_token: page.access_token || longToken }
            })
            const igId = igRes.data?.instagram_business_account?.id
            if (igId) {
                const igInfoRes = await axios.get(`https://graph.facebook.com/v19.0/${igId}`, {
                    params: {
                        fields: "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website",
                        access_token: page.access_token || longToken
                    }
                })
                igStats = {
                    id: igInfoRes.data.id,
                    username: igInfoRes.data.username,
                    name: igInfoRes.data.name,
                    bio: igInfoRes.data.biography,
                    followers: igInfoRes.data.followers_count,
                    following: igInfoRes.data.follows_count,
                    posts: igInfoRes.data.media_count,
                    profilePicture: igInfoRes.data.profile_picture_url,
                    website: igInfoRes.data.website,
                }
                break
            }
        } catch {}
    }

    if (!igStats) throw new ApiError(404, "No Instagram Business/Creator account found. Make sure your Instagram is connected to a Facebook Page.")

    user.instagramStats = igStats
    user.instagramStatsUpdatedAt = new Date()
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, { instagramStats: igStats }, "Instagram stats refreshed"))
})

// link Instagram to existing logged-in user (called from frontend callback page)
const linkInstagram = asyncHandler(async (req, res) => {
    const { longToken, igStats } = req.body
    if (!longToken) throw new ApiError(400, "Token required")

    const meRes = await axios.get("https://graph.facebook.com/v19.0/me", {
        params: { fields: "id", access_token: longToken }
    })

    const user = await User.findById(req.user._id)
    user.metaId = meRes.data.id
    user.metaAccessToken = longToken
    if (igStats) {
        user.instagramStats = igStats
        user.instagramStatsUpdatedAt = new Date()
    }
    await user.save({ validateBeforeSave: false })

    const safeUser = await User.findById(user._id).select("-password -refreshToken -googleAccessToken -googleRefreshToken -metaAccessToken")
    return res.status(200).json(new ApiResponse(200, { user: safeUser }, "Instagram connected"))
})

export { instagramAuthRedirect, instagramAuthCallback, refreshInstagramStats, linkInstagram }
