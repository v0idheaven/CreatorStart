import { useState, useEffect } from "react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

// Manages YouTube videos, analytics, and refresh state
export default function useYouTubeData(youtubeStats) {
  const [ytStats, setYtStats] = useState(youtubeStats || null)
  const [ytVideos, setYtVideos] = useState([])
  const [ytAnalytics, setYtAnalytics] = useState(null)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [refreshingYT, setRefreshingYT] = useState(false)
  const [ytError, setYtError] = useState("")

  async function fetchYTVideos() {
    setLoadingVideos(true)
    setYtError("")
    try {
      // 15s timeout so spinner doesn't spin forever on slow/sleeping backend
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)

      const [vRes, aRes] = await Promise.all([
        apiFetch(API_ENDPOINTS.youtubeVideos, { signal: controller.signal }),
        apiFetch(API_ENDPOINTS.youtubeAnalytics, { signal: controller.signal }),
      ])
      clearTimeout(timeout)

      const [vData, aData] = await Promise.all([vRes.json(), aRes.json()])

      if (vRes.ok && Array.isArray(vData?.data)) setYtVideos(vData.data)
      if (aRes.ok && aData?.data) setYtAnalytics(aData.data)

      if (!vRes.ok) setYtError(vData?.message || "Failed to load videos")
    } catch (error) {
      if (error.name === "AbortError") {
        setYtError("Request timed out. Backend may be waking up — try refreshing.")
      } else {
        setYtError("Failed to load YouTube data.")
      }
      console.warn("YouTube fetch error:", error)
    } finally {
      setLoadingVideos(false)
    }
  }

  async function handleRefreshYT() {
    setRefreshingYT(true)
    setYtError("")
    try {
      const res = await apiFetch(API_ENDPOINTS.youtubeRefresh, { method: "POST" })
      const data = await res.json()
      if (res.ok && data?.data?.youtubeStats) {
        setYtStats(data.data.youtubeStats)
        const u = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...u, youtubeStats: data.data.youtubeStats }))
      } else {
        setYtError(data.message || "Refresh failed")
      }
    } catch {
      setYtError("Network error")
    } finally {
      setRefreshingYT(false)
    }
  }

  useEffect(() => {
    if (!youtubeStats) return
    const timer = window.setTimeout(fetchYTVideos, 0)
    return () => window.clearTimeout(timer)
  }, [youtubeStats])

  return { ytStats, ytVideos, ytAnalytics, loadingVideos, refreshingYT, ytError, fetchYTVideos, handleRefreshYT }
}
