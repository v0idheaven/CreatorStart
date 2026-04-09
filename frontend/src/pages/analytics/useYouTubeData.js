import { useState, useEffect } from "react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

// Strip HTML tags + detect quota errors from YouTube API error messages
function cleanError(msg) {
  if (!msg) return "Something went wrong."
  const stripped = String(msg).replace(/<[^>]*>/g, "").trim()
  if (stripped.toLowerCase().includes("quota")) {
    return "YouTube API quota exceeded for today. Data will be available again after midnight Pacific Time."
  }
  return stripped || "Something went wrong."
}

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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      const [vRes, aRes] = await Promise.all([
        apiFetch(API_ENDPOINTS.youtubeVideos, { signal: controller.signal }),
        apiFetch(API_ENDPOINTS.youtubeAnalytics, { signal: controller.signal }),
      ])
      clearTimeout(timeout)
      const [vData, aData] = await Promise.all([vRes.json(), aRes.json()])
      if (vRes.ok && Array.isArray(vData?.data)) setYtVideos(vData.data)
      if (aRes.ok && aData?.data) setYtAnalytics(aData.data)
      if (!vRes.ok) setYtError(cleanError(vData?.message))
      else if (!aRes.ok) setYtError(cleanError(aData?.message))
    } catch (error) {
      clearTimeout(timeout)
      if (error.name === "AbortError") {
        setYtError("Backend is waking up (free tier). Click Refresh in a moment.")
      } else {
        setYtError("Could not load YouTube data. Check your connection.")
      }
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
        setYtError(cleanError(data?.message))
      }
    } catch {
      setYtError("Network error")
    } finally {
      setRefreshingYT(false)
    }
  }

  // Use boolean dep —> object reference changes every render causing infinite loops
  const ytConnected = !!youtubeStats
  useEffect(() => {
    if (!ytConnected) return
    const timer = window.setTimeout(fetchYTVideos, 0)
    return () => window.clearTimeout(timer)
  }, [ytConnected]) // eslint-disable-line react-hooks/exhaustive-deps

  return { ytStats, ytVideos, ytAnalytics, loadingVideos, refreshingYT, ytError, fetchYTVideos, handleRefreshYT }
}
