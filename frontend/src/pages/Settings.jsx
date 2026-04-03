import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Camera, Eye, EyeOff, Pencil, Youtube, Instagram, Layers, ChevronRight, Lock, Trash2, LogOut, Loader } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }

export default function Settings() {
  const navigate = useNavigate()
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
  const [name, setName] = useState(storedUser.fullName || "")
  const [email, setEmail] = useState(storedUser.email || "")
  const [username, setUsername] = useState(storedUser.username || "")
  const [niche, setNiche] = useState(storedUser.niche || "")
  const [bio, setBio] = useState(storedUser.bio || "")
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState("")

  const [avatar, setAvatar] = useState(storedUser.avatar || "")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [showAvatarPreview, setShowAvatarPreview] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 })
  const [cropZoom, setCropZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const cropImgRef = useRef(null)
  const fileInputRef = useRef(null)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pwCurrent, setPwCurrent] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwError, setPwError] = useState("")
  const [pwSaved, setPwSaved] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(platform)

  // stats — use stored ytStats directly, no extra API call needed
  const statItems = useMemo(() => {
    const _streakData = JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]")
    const _planData = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
    const _active = _planData?.entries?.filter(e => e.active || e.content) || []
    const _done = _active.filter(e => e.isCompleted).length
    const _today = new Date(); _today.setHours(0,0,0,0)

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const ytConnected = !!(user.youtubeStats)

    // streak — only from YT publish dates, not planner
    let _streak = 0
    if (ytConnected) {
      // no videos = 0 streak, don't fall back to planner
      _streak = 0
    }

    const _totalPosted = ytConnected
      ? Number(user.youtubeStats?.videos || 0)
      : _streakData.length

    const _subscribers = ytConnected ? Number(user.youtubeStats?.subscribers || 0) : 0
    const _igFollowers = Number(user.instagramStats?.followers || 0)
    const _totalAudience = _subscribers + _igFollowers

    return [
      { label: "Total videos", value: _totalPosted, sub: ytConnected ? "on YouTube" : "across all plans" },
      { label: "Current streak", value: `${_streak}d`, sub: "consecutive days" },
      { label: "Audience", value: _totalAudience.toLocaleString(), sub: ytConnected ? "subscribers + followers" : "connect accounts to see" },
    ]
  }, [platform])

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  // load fresh user data from backend on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch(API_ENDPOINTS.me)
        if (res.ok) {
          const data = await res.json()
          const u = data?.data?.user
          if (u) {
            syncLocal(u)
            setName(u.fullName || "")
            setEmail(u.email || "")
            setUsername(u.username || "")
            setNiche(u.niche || "")
            setBio(u.bio || "")
            setAvatar(u.avatar || "")
            if (u.platform) setSelectedPlatform(u.platform)
          }
        }
      } catch {}
    }
    fetchUser()
  }, [])

  function syncLocal(updates) {
    const current = JSON.parse(localStorage.getItem("user") || "{}")
    const merged = { ...current, ...updates }
    localStorage.setItem("user", JSON.stringify(merged))
    window.dispatchEvent(new Event("userUpdated"))
  }

  async function handleSaveProfile() {
    setProfileError("")
    setProfileSaving(true)
    const updates = { fullName: name, email, username, niche, bio }
    try {
      const res = await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify(updates) })
      const data = await res.json()
      if (!res.ok) { setProfileError(data.message || "Failed to save"); setProfileSaving(false); return }
      syncLocal(data.data?.user || updates)
    } catch {
      syncLocal(updates)
    }
    setProfileSaving(false)
    setProfileSaved(true)
    setEditingProfile(false)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function handleChangePassword() {
    setPwError("")
    if (!pwCurrent) { setPwError("Enter your current password."); return }
    if (pwNew.length < 6) { setPwError("New password must be at least 6 characters."); return }
    if (pwNew === pwCurrent) { setPwError("New password can't be the same as your current password."); return }
    if (pwNew !== pwConfirm) { setPwError("Passwords don't match."); return }
    try {
      const res = await apiFetch(API_ENDPOINTS.updatePassword, {
        method: "PATCH",
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew })
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.message || "Failed to update password"); return }
    } catch {
      const stored = JSON.parse(localStorage.getItem("user") || "{}")
      if (stored.password && pwCurrent !== stored.password) { setPwError("Current password is incorrect."); return }
      syncLocal({ password: pwNew })
    }
    setPwSaved(true)
    setPwCurrent(""); setPwNew(""); setPwConfirm("")
    setTimeout(() => { setPwSaved(false); setShowPasswordForm(false) }, 2000)
  }

  async function handleDeleteAccount() {
    try { await apiFetch(API_ENDPOINTS.deleteAccount, { method: "DELETE" }) } catch {}
    localStorage.clear()
    navigate("/auth")
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setCropSrc(ev.target.result); setCropPos({ x: 0, y: 0 }); setCropZoom(1) }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  async function handleCropAndUpload() {
    const img = cropImgRef.current
    if (!img) return
    setAvatarUploading(true)
    setCropSrc(null)
    const size = 400
    const canvas = document.createElement("canvas")
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext("2d")
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.clip()
    const iw = img.naturalWidth, ih = img.naturalHeight
    const baseScale = Math.min(size / iw, size / ih) * cropZoom
    const sw = iw * baseScale, sh = ih * baseScale
    const dx = (size - sw) / 2 + cropPos.x * (size / 360)
    const dy = (size - sh) / 2 + cropPos.y * (size / 360)
    ctx.drawImage(img, dx, dy, sw, sh)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    try {
      canvas.toBlob(async (blob) => {
        const form = new FormData()
        form.append("avatar", blob, "avatar.jpg")
        const res = await apiFetch(API_ENDPOINTS.updateAvatar, { method: "PATCH", body: form, headers: {} })
        const data = await res.json()
        const url = res.ok && data?.data?.user?.avatar ? data.data.user.avatar : dataUrl
        setAvatar(url)
        syncLocal({ avatar: url })
        setAvatarUploading(false)
      }, "image/jpeg", 0.92)
    } catch {
      setAvatar(dataUrl)
      syncLocal({ avatar: dataUrl })
      setAvatarUploading(false)
    }
  }

  async function handlePlatformChange(p) {
    setSelectedPlatform(p)
    localStorage.setItem("platform", p)
    syncLocal({ platform: p })
    try { await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify({ platform: p }) }) } catch {}
    window.location.reload()
  }

  async function handleLogout() {
    try { await apiFetch(API_ENDPOINTS.logout, { method: "POST" }) } catch {}
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    navigate("/auth")
  }

  const platforms = [
    { id: "youtube", label: "YouTube", desc: "Videos, Shorts & channel growth", color: "#ff4444", Icon: Youtube },
    { id: "instagram", label: "Instagram", desc: "Reels, posts & profile growth", color: "#c13584", Icon: Instagram },
    { id: "both", label: "Both Platforms", desc: "One dashboard for everything", color: "#818cf8", Icon: Layers },
  ]


  return (
    <>
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ marginLeft: "72px", flex: 1, display: "flex", justifyContent: "center" }}>
      <main style={{ width: "100%", maxWidth: "720px", padding: "40px 48px" }}>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>Account</p>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: 0 }}>Settings</h1>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "24px" }}>
          {statItems.map(s => (
            <div key={s.label} className="card" style={{ padding: "16px 18px" }}>
              <p style={{ fontSize: "22px", fontWeight: "800", color: accent, margin: "0 0 2px", letterSpacing: "-0.5px" }}>{s.value}</p>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>{s.label}</p>
              <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div onClick={() => { if (editingProfile) setShowAvatarMenu(m => !m); else if (avatar) setShowAvatarPreview(true) }}
                style={{ cursor: "pointer", position: "relative" }}>
                {avatarUploading
                  ? <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader size={18} color="var(--dim)" /></div>
                  : avatar
                  ? <img src={avatar} alt="avatar" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", color: "#fff" }}>{initials}</div>
                }
                {editingProfile && !avatarUploading && (
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Camera size={15} color="#fff" />
                  </div>
                )}
              </div>
              {showAvatarMenu && editingProfile && (
                <>
                  <div onClick={() => setShowAvatarMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                  <div style={{ position: "absolute", top: "68px", left: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", zIndex: 51, minWidth: "140px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                    {avatar && (
                      <button onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true) }}
                        style={{ width: "100%", padding: "10px 14px", background: "transparent", border: "none", color: "var(--text)", fontSize: "13px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <Eye size={13} color="var(--muted)" /> View photo
                      </button>
                    )}
                    <button onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click() }}
                      style={{ width: "100%", padding: "10px 14px", background: "transparent", border: "none", color: "var(--text)", fontSize: "13px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Pencil size={13} color="var(--muted)" /> Change photo
                    </button>
                  </div>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {!editingProfile ? (
                <>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", margin: "0 0 2px" }}>{name || "—"}</p>
                  <p style={{ fontSize: "12px", color: "var(--dim)", margin: "0 0 2px" }}>@{username || "—"}</p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>{email}</p>
                  {bio && <p style={{ fontSize: "12px", color: "var(--dim)", margin: "6px 0 0", lineHeight: "1.5" }}>{bio}</p>}
                  {niche && <span style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", color: accent, background: accent + "15", padding: "2px 10px", borderRadius: "10px", fontWeight: "600" }}>{niche}</span>}
                </>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div><label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Full Name</label><input className="input-sm" value={name} onChange={e => setName(e.target.value)} /></div>
                  <div><label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Username</label><input className="input-sm" value={username} onChange={e => setUsername(e.target.value)} /></div>
                  <div><label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Email</label><input className="input-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                  <div><label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Niche</label><input className="input-sm" value={niche} onChange={e => setNiche(e.target.value)} placeholder="Tech, Finance..." /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Bio</label><input className="input-sm" value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..." /></div>
                  {profileError && <p style={{ gridColumn: "1/-1", fontSize: "12px", color: "#f87171", margin: 0 }}>{profileError}</p>}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              {editingProfile && (
                <button onClick={handleSaveProfile} disabled={profileSaving}
                  style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: profileSaved ? "#4ade80" : accent, color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", opacity: profileSaving ? 0.7 : 1 }}>
                  {profileSaving ? <Loader size={12} /> : profileSaved ? <><Check size={12} />Saved</> : "Save"}
                </button>
              )}
              <button onClick={() => { setEditingProfile(!editingProfile); setProfileError("") }}
                style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${editingProfile ? "var(--border2)" : accent + "60"}`, background: "transparent", color: editingProfile ? "var(--muted)" : accent, fontSize: "12px", cursor: "pointer" }}>
                {editingProfile ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        {/* Platform */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 10px", fontWeight: "600" }}>Active Platform</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {platforms.map(({ id, label, desc, color, Icon }) => (
              <div key={id} onClick={() => handlePlatformChange(id)}
                style={{ padding: "14px", borderRadius: "12px", border: `1.5px solid ${selectedPlatform === id ? color : "var(--border)"}`, background: selectedPlatform === id ? color + "10" : "var(--card)", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                  <Icon size={14} color={color} strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: selectedPlatform === id ? "var(--text)" : "var(--muted)", margin: "0 0 2px" }}>{label}</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0, lineHeight: "1.3" }}>{desc}</p>
                {selectedPlatform === id && (
                  <div style={{ position: "absolute", top: "10px", right: "10px", width: "16px", height: "16px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={9} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account actions */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 10px", fontWeight: "600" }}>Account</p>
          <div className="card" style={{ overflow: "hidden" }}>

            <div onClick={() => setShowPasswordForm(p => !p)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.1s" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Lock size={14} color={accent} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)", margin: "0 0 1px" }}>Change Password</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Update your login password</p>
              </div>
              <ChevronRight size={13} color="var(--dim)" style={{ transform: showPasswordForm ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </div>

            {showPasswordForm && (
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--sb)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Current password</label>
                    <input className="input-sm" type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>New password</label>
                    <div style={{ position: "relative" }}>
                      <input className="input-sm" type={showPw ? "text" : "password"} value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="Min 6 characters" style={{ paddingRight: "40px" }} />
                      <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex" }}>
                        {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Confirm new password</label>
                    <input className="input-sm" type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="Repeat new password" />
                  </div>
                  {pwError && <p style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{pwError}</p>}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { setShowPasswordForm(false); setPwError(""); setPwCurrent(""); setPwNew(""); setPwConfirm("") }}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleChangePassword}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: pwSaved ? "#4ade80" : accent, color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                      {pwSaved ? <><Check size={12} />Saved!</> : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div onClick={() => setShowLogoutConfirm(true)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.1s" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LogOut size={14} color="#f87171" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#f87171", margin: "0 0 1px" }}>Log Out</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Sign out of CreatorStart</p>
              </div>
              <ChevronRight size={13} color="var(--dim)" />
            </div>

            <div onClick={() => setShowDeleteConfirm(true)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", cursor: "pointer", transition: "background 0.1s" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={14} color="#f87171" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#f87171", margin: "0 0 1px" }}>Delete Account</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Permanently remove your account and all data</p>
              </div>
              <ChevronRight size={13} color="var(--dim)" />
            </div>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "var(--dim)", textAlign: "center" }}>CreatorStart v1.0.0 · Made for creators</p>
      </main>
      </div>
    </div>

    {showAvatarPreview && avatar && (
      <>
        <div onClick={() => setShowAvatarPreview(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, cursor: "pointer" }} />
        <img src={avatar} alt="avatar" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "220px", height: "220px", borderRadius: "50%", objectFit: "cover", zIndex: 101, boxShadow: "0 0 0 4px rgba(255,255,255,0.1)" }} />
      </>
    )}

    {cropSrc && (
      <>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden", width: "360px" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setCropSrc(null)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer", padding: 0 }}>Cancel</button>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>Edit photo</p>
            <button onClick={handleCropAndUpload} style={{ background: "transparent", border: "none", color: accent, fontSize: "13px", fontWeight: "700", cursor: "pointer", padding: 0 }}>Done</button>
          </div>
          <div style={{ position: "relative", width: "360px", height: "360px", overflow: "hidden", background: "#000", cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={e => { setIsDragging(true); setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y }) }}
            onMouseMove={e => { if (isDragging) setCropPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }) }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onWheel={e => { e.preventDefault(); setCropZoom(z => Math.min(4, Math.max(1, z - e.deltaY * 0.002))) }}
          >
            <img ref={cropImgRef} src={cropSrc} alt="crop"
              onLoad={e => {
                const img = e.target
                const scale = Math.min(360 / img.naturalWidth, 360 / img.naturalHeight)
                img.style.width = img.naturalWidth * scale + "px"
                img.style.height = img.naturalHeight * scale + "px"
              }}
              style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(calc(-50% + ${cropPos.x}px), calc(-50% + ${cropPos.y}px)) scale(${cropZoom})`, transformOrigin: "center", userSelect: "none", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)", pointerEvents: "none" }} />
          </div>
          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => setCropZoom(z => Math.max(1, z - 0.1))} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>−</button>
              <div style={{ flex: 1, position: "relative", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", cursor: "pointer" }}
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setCropZoom(1 + ((e.clientX - r.left) / r.width) * 3) }}>
                <div style={{ height: "100%", width: `${((cropZoom - 1) / 3) * 100}%`, background: "#fff", borderRadius: "2px" }} />
                <div style={{ position: "absolute", top: "50%", left: `${((cropZoom - 1) / 3) * 100}%`, transform: "translate(-50%,-50%)", width: "13px", height: "13px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
              </div>
              <button onClick={() => setCropZoom(z => Math.min(4, z + 0.1))} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "8px 0 0" }}>Drag to reposition · scroll to zoom</p>
          </div>
        </div>
      </>
    )}

    {showLogoutConfirm && (
      <>
        <div onClick={() => setShowLogoutConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "360px", zIndex: 101, textAlign: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <LogOut size={20} color="#f87171" />
          </div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Log out?</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 20px", lineHeight: "1.6" }}>You'll be signed out. Your data and plans stay saved.</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>Stay</button>
            <button onClick={handleLogout} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", background: "#f87171", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Log out</button>
          </div>
        </div>
      </>
    )}

    {showDeleteConfirm && (
      <>
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "360px", zIndex: 101, textAlign: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Trash2 size={20} color="#f87171" />
          </div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Delete account?</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 20px", lineHeight: "1.6" }}>This permanently deletes your account, all plans, and content. Cannot be undone.</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleDeleteAccount} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", background: "#f87171", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Yes, delete</button>
          </div>
        </div>
      </>
    )}
    </>
  )
}
