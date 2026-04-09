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
    const streakData = JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const ytConnected = !!(user.youtubeStats)
    const totalPosted = ytConnected ? Number(user.youtubeStats?.videos || 0) : streakData.length
    const subscribers = ytConnected ? Number(user.youtubeStats?.subscribers || 0) : 0
    return [
      { label: "Total videos", value: totalPosted, sub: ytConnected ? "on YouTube" : "across all plans" },
      { label: "Current streak", value: "0d", sub: "consecutive days" },
      { label: "Audience", value: subscribers.toLocaleString(), sub: ytConnected ? "subscribers" : "connect accounts to see" },
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
      } catch (e) { console.warn("Failed to fetch user", e) }
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
    try { await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify({ platform: p }) }) } catch (e) { console.warn(e) }
    window.location.reload()
  }

  async function logout() {
    try { await apiFetch(API_ENDPOINTS.logout, { method: "POST" }) } catch (e) { console.warn(e) }
    localStorage.removeItem("accessToken"); localStorage.removeItem("user"); navigate("/auth")
  }

  async function deleteAccount() {
    try { await apiFetch(API_ENDPOINTS.deleteAccount, { method: "DELETE" }) } catch (e) { console.warn(e) }
    localStorage.clear(); navigate("/auth")
  }

  function updateAvatar(url) { setAvatar(url); syncLocal({ avatar: url }) }

  return {
    platform, accent: { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }[platform] || "#818cf8",
    name, setName, email, setEmail, username, setUsername, niche, setNiche, bio, setBio,
    avatar, updateAvatar, selectedPlatform,
    profileSaving, profileSaved, profileError, setProfileError,
    statItems, saveProfile, changePlatform, logout, deleteAccount,
    initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?",
  }
}
