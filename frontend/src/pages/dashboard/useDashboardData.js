import { useState, useEffect } from "react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"
import { getMergedYoutubeViews } from "../../utils/youtubeStats"

// Fetches real YouTube data + computes streak from videos
export default function useDashboardData() {
  const [storedUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"))
  const ytStats = storedUser.youtubeStats || null
  const ytConnected = !!ytStats

  const [ytVideos, setYtVideos] = useState([])
  const [ytAnalytics, setYtAnalytics] = useState(null)
  const [loading, setLoading] = useState(ytConnected)

  useEffect(() => {
    if (!ytConnected) return
    Promise.all([
      apiFetch(API_ENDPOINTS.youtubeVideos),
      apiFetch(`${API_ENDPOINTS.youtubeAnalytics}?days=28`),
    ])
      .then(async ([videosRes, analyticsRes]) => {
        const [videosData, analyticsData] = await Promise.all([videosRes.json(), analyticsRes.json()])
        if (Array.isArray(videosData?.data)) {
          setYtVideos(videosData.data)
          localStorage.setItem("yt_videos_cache", JSON.stringify(videosData.data))
        }
        if (analyticsRes.ok && analyticsData?.data) {
          setYtAnalytics(analyticsData.data)
        }
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.error("Dashboard data fetch failed:", err)
      })
      .finally(() => setLoading(false))
  }, [ytConnected])

  // Streak = consecutive days with at least 1 video published (IST)
  const streak = (() => {
    if (!ytConnected || ytVideos.length === 0) return 0
    const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    todayIST.setHours(0, 0, 0, 0)

    // Get unique publish dates (IST)
    const publishDates = new Set(
      ytVideos
        .filter(v => v.publishedAt)
        .map(v => {
          const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
          d.setHours(0, 0, 0, 0)
          return d.getTime()
        })
    )

    let count = 0
    let check = new Date(todayIST)
    while (publishDates.has(check.getTime())) {
      count++
      check.setDate(check.getDate() - 1)
    }
    return count
  })()

  // Real stats from youtubeStats
  const realStats = ytConnected ? {
    subscribers: Number(ytStats.subscribers || 0),
    views: getMergedYoutubeViews({ ytStats, ytAnalytics, ytVideos }),
    videos: Number(ytStats.videos || 0),
  } : null

  return { ytVideos, ytAnalytics, ytStats, ytConnected, loading, streak, realStats, storedUser }
}
