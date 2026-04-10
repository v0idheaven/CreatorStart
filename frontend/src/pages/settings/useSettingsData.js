import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

// All settings state, API calls, and local sync in one place
export default function useSettingsData() {
  const navigate = useNavigate()
  const platform = localStorage.getItem("platform") || "both"
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [name, setName] = useState(storedUser.fullName || "")
  const [email, setEmail] = useState(storedUser.email || "")
  const [username, setUsername] = useState(storedUser.username || "")
  const [niche, setNiche] = useState(storedUser.niche || "")
  const [bio, setBio] = useState(storedUser.bio || "")
  const [avatar, setAvatar] = useState(storedUser.avatar || "")
  const [selectedPlatform, setSelectedPlatform] = useState(platform)

  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState("")

  const statItems = useMemo(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const ytConnected = !!(user.youtubeStats)
    const totalPosted = ytConnected ? Number(user.youtubeStats?.videos || 0) : 0
    const subscribers = ytConnected ? Number(user.youtubeStats?.subscribers || 0) : 0

    // Calculate streak from ytVideos in localStorage (set by dashboard/analytics fetch)
    let streak = 0
    try {
      const cachedVideos = JSON.parse(localStorage.getItem("yt_videos_cache") || "[]")
      if (ytConnected && cachedVideos.length > 0) {
        const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        todayIST.setHours(0, 0, 0, 0)
        const publishDates = new Set(
          cachedVideos.filter(v => v.publishedAt).map(v => {
            const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
            d.setHours(0, 0, 0, 0)
            return d.getTime()
          })
        )
        let check = new Date(todayIST)
        while (publishDates.has(check.getTime())) {
          streak++
          check.setDate(check.getDate() - 1)
        }
      }
    } catch { /* silent */ }

    return [
      { label: "Total videos", value: totalPosted, sub: ytConnected ? "on YouTube" : "connect YouTube to see" },
      { label: "Current streak", value: streak > 0 ? `${streak}d` : "0d", sub: streak > 0 ? "consecutive days posted" : "post today to start streak" },
      { label: "Audience", value: subscribers.toLocaleString(), sub: ytConnected ? "subscribers" : "connect YouTube to see" },
    ]
  }, [platform])

  function syncLocal(updates) {
    const current = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem("user", JSON.stringify({ ...current, ...updates }))
    window.dispatchEvent(new Event("userUpdated"))
  }

  // Fetch latest user from backend on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch(API_ENDPOINTS.me)
        if (!res.ok) return
        const data = await res.json()
        const u = data?.data?.user
        if (!u) return
        syncLocal(u)
        setName(u.fullName || "")
        setEmail(u.email || "")
        setUsername(u.username || "")
        setNiche(u.niche || "")
        setBio(u.bio || "")
        setAvatar(u.avatar || "")
        if (u.platform) setSelectedPlatform(u.platform)
      } catch { /* silent — expected failure on first load */ }
    }
    fetchUser()
  }, [])

  async function saveProfile() {
    setProfileError(""); setProfileSaving(true)
    const updates = { fullName: name, email, username, niche, bio }
    try {
      const res = await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify(updates) })
      const data = await res.json()
      if (!res.ok) { setProfileError(data.message || "Failed to save"); setProfileSaving(false); return }
      syncLocal(data.data?.user || updates)
    } catch { syncLocal(updates) }
    setProfileSaving(false); setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
    return true
  }

  async function changePlatform(p) {
    setSelectedPlatform(p)
    localStorage.setItem("platform", p)
    syncLocal({ platform: p })
    try { await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify({ platform: p }) }) } catch { /* silent */ }
    window.location.reload()
  }

  async function logout() {
    try { await apiFetch(API_ENDPOINTS.logout, { method: "POST" }) } catch { /* silent */ }
    localStorage.removeItem("accessToken"); localStorage.removeItem("user"); navigate("/auth")
  }

  async function deleteAccount() {
    try { await apiFetch(API_ENDPOINTS.deleteAccount, { method: "DELETE" }) } catch { /* silent */ }
    localStorage.clear(); navigate("/auth")
  }

  function updateAvatar(url) { setAvatar(url); syncLocal({ avatar: url }) }

  return {
    platform, accent: { youtube: "#ff4444", instagram: "#c13584", both: "#2d8fa3" }[platform] || "#2d8fa3",
    name, setName, email, setEmail, username, setUsername, niche, setNiche, bio, setBio,
    avatar, updateAvatar, selectedPlatform,
    profileSaving, profileSaved, profileError, setProfileError,
    statItems, saveProfile, changePlatform, logout, deleteAccount,
    initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?",
  }
}
