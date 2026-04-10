import { useState, useEffect } from "react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

// Fetches real YouTube data + computes streak from videos
export default function useDashboardData() {
  const [storedUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"))
  const [ytVideos, setYtVideos] = useState([])
  const [loading, setLoading] = useState(false)

  const ytStats = storedUser.youtubeStats || null
  const ytConnected = !!ytStats

  useEffect(() => {
    if (!ytConnected) return
    setLoading(true)
    apiFetch(API_ENDPOINTS.youtubeVideos)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d?.data)) {
          setYtVideos(d.data)
          // Cache for streak calculation in settings
          localStorage.setItem("yt_videos_cache", JSON.stringify(d.data))
        }
      })
      .catch(() => {})
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
    views: Number(ytStats.views || 0),
    videos: Number(ytStats.videos || 0),
  } : null

  return { ytVideos, ytStats, ytConnected, loading, streak, realStats, storedUser }
}
