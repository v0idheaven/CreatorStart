import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Camera, Eye, EyeOff, Pencil, Youtube, Instagram, Layers, ChevronRight, Lock, Trash2, LogOut, Loader } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"
import "./Settings.css"

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

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  function syncLocal(updates) {
    const current = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem("user", JSON.stringify({ ...current, ...updates }))
    window.dispatchEvent(new Event("userUpdated"))
  }

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
      } catch (error) {
        console.warn("Failed to fetch latest user profile", error)
      }
    }
    fetchUser()
  }, [])

  async function handleSaveProfile() {
    setProfileError("")
    setProfileSaving(true)
    const updates = { fullName: name, email, username, niche, bio }
    try {
      const res = await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify(updates) })
      const data = await res.json()
      if (!res.ok) { setProfileError(data.message || "Failed to save"); setProfileSaving(false); return }
      syncLocal(data.data?.user || updates)
    } catch { syncLocal(updates) }
    setProfileSaving(false)
    setProfileSaved(true)
    setEditingProfile(false)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function handleChangePassword() {
    setPwError("")
    if (!pwCurrent) { setPwError("Enter your current password."); return }
    if (pwNew.length < 6) { setPwError("New password must be at least 6 characters."); return }
    if (pwNew === pwCurrent) { setPwError("New password cannot be the same."); return }
    if (pwNew !== pwConfirm) { setPwError("Passwords do not match."); return }
    try {
      const res = await apiFetch(API_ENDPOINTS.updatePassword, { method: "PATCH", body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }) })
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
    try { await apiFetch(API_ENDPOINTS.deleteAccount, { method: "DELETE" }) } catch (error) { console.warn("Delete account request failed", error) }
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
        setAvatar(url); syncLocal({ avatar: url }); setAvatarUploading(false)
      }, "image/jpeg", 0.92)
    } catch {
      setAvatar(dataUrl); syncLocal({ avatar: dataUrl }); setAvatarUploading(false)
    }
  }

  async function handlePlatformChange(p) {
    setSelectedPlatform(p)
    localStorage.setItem("platform", p)
    syncLocal({ platform: p })
    try { await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify({ platform: p }) }) } catch (error) { console.warn("Failed to sync platform to server", error) }
    window.location.reload()
  }

  async function handleLogout() {
    try { await apiFetch(API_ENDPOINTS.logout, { method: "POST" }) } catch (error) { console.warn("Logout request failed", error) }
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
      <div className="page-root">
        <Sidebar />
        <div className="settings-content">
          <main className="settings-main">
            <div className="settings-heading">
              <p className="page-kicker">Account</p>
              <h1 className="page-title">Settings</h1>
            </div>

            <div className="settings-stats-grid">
              {statItems.map(s => (
                <div key={s.label} className="card settings-stat-card">
                  <p className="settings-stat-value" style={{ color: accent }}>{s.value}</p>
                  <p className="settings-stat-label">{s.label}</p>
                  <p className="settings-stat-sub">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="card settings-profile-card">
              <div className="settings-profile-row">
                <div className="settings-avatar-wrap">
                  <div className="settings-avatar-click" onClick={() => { if (editingProfile) setShowAvatarMenu(m => !m); else if (avatar) setShowAvatarPreview(true) }}>
                    {avatarUploading
                      ? <div className="settings-avatar-loading"><Loader size={18} color="var(--dim)" /></div>
                      : avatar
                      ? <img src={avatar} alt="avatar" className="settings-avatar-img" />
                      : <div className="settings-avatar-initials" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>{initials}</div>
                    }
                    {editingProfile && !avatarUploading && (
                      <div className="settings-avatar-overlay"><Camera size={15} color="#fff" /></div>
                    )}
                  </div>
                  {showAvatarMenu && editingProfile && (
                    <>
                      <div onClick={() => setShowAvatarMenu(false)} className="settings-avatar-menu-backdrop" />
                      <div className="settings-avatar-menu">
                        {avatar && (
                          <button onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true) }} className="settings-avatar-menu-item">
                            <Eye size={13} color="var(--muted)" /> View photo
                          </button>
                        )}
                        <button onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click() }} className="settings-avatar-menu-item">
                          <Pencil size={13} color="var(--muted)" /> Change photo
                        </button>
                      </div>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                <div className="settings-profile-info">
                  {!editingProfile ? (
                    <>
                      <p className="settings-profile-name">{name || "—"}</p>
                      <p className="settings-profile-username">@{username || "—"}</p>
                      <p className="settings-profile-email">{email}</p>
                      {bio && <p className="settings-profile-bio">{bio}</p>}
                      {niche && <span className="settings-niche-badge" style={{ color: accent, background: accent + "15" }}>{niche}</span>}
                    </>
                  ) : (
                    <div className="settings-edit-grid">
                      {[["Full Name", name, setName, "text"], ["Username", username, setUsername, "text"], ["Email", email, setEmail, "email"], ["Niche", niche, setNiche, "text"]].map(([label, val, setter, type]) => (
                        <div key={label}>
                          <label className="field-label">{label}</label>
                          <input className="input-sm" type={type} value={val} onChange={e => setter(e.target.value)} placeholder={label} />
                        </div>
                      ))}
                      <div className="settings-edit-full">
                        <label className="field-label">Bio</label>
                        <input className="input-sm" value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..." />
                      </div>
                      {profileError && <p className="settings-edit-error">{profileError}</p>}
                    </div>
                  )}
                </div>

                <div className="settings-profile-actions">
                  {editingProfile && (
                    <button onClick={handleSaveProfile} disabled={profileSaving} className="settings-save-btn" style={{ background: profileSaved ? "#4ade80" : accent, opacity: profileSaving ? 0.7 : 1 }}>
                      {profileSaving ? <Loader size={12} /> : profileSaved ? <><Check size={12} />Saved</> : "Save"}
                    </button>
                  )}
                  <button onClick={() => { setEditingProfile(!editingProfile); setProfileError("") }} className="settings-edit-btn" style={{ border: `1px solid ${editingProfile ? "var(--border2)" : accent + "60"}`, color: editingProfile ? "var(--muted)" : accent }}>
                    {editingProfile ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <p className="settings-section-label">Active Platform</p>
              <div className="settings-platform-grid">
                {platforms.map((p) => (
                  <div key={p.id} onClick={() => handlePlatformChange(p.id)} className="settings-platform-card" style={{ border: `1.5px solid ${selectedPlatform === p.id ? p.color : "var(--border)"}`, background: selectedPlatform === p.id ? p.color + "10" : "var(--card)" }}>
                    <div className="settings-platform-icon" style={{ background: p.color + "20" }}>
                      <p.Icon size={14} color={p.color} strokeWidth={1.8} />
                    </div>
                    <p className="settings-platform-label" style={{ color: selectedPlatform === p.id ? "var(--text)" : "var(--muted)" }}>{p.label}</p>
                    <p className="settings-platform-desc">{p.desc}</p>
                    {selectedPlatform === p.id && (
                      <div className="settings-platform-check" style={{ background: p.color }}>
                        <Check size={9} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <p className="settings-section-label">Account</p>
              <div className="card settings-account-card">
                <div className="settings-action-row" onClick={() => setShowPasswordForm(p => !p)}>
                  <div className="settings-action-icon" style={{ background: accent + "15" }}>
                    <Lock size={14} color={accent} strokeWidth={2} />
                  </div>
                  <div className="settings-action-body">
                    <p className="settings-action-title">Change Password</p>
                    <p className="settings-action-sub">Update your login password</p>
                  </div>
                  <ChevronRight size={13} color="var(--dim)" className={showPasswordForm ? "chevron-open" : ""} />
                </div>

                {showPasswordForm && (
                  <div className="settings-pw-form">
                    <div>
                      <label className="field-label">Current password</label>
                      <input className="input-sm" type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className="field-label">New password</label>
                      <div className="settings-pw-input-wrap">
                        <input className="input-sm settings-pw-input" type={showPw ? "text" : "password"} value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="Min 6 characters" />
                        <button onClick={() => setShowPw(p => !p)} className="settings-pw-toggle">
                          {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Confirm new password</label>
                      <input className="input-sm" type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="Repeat new password" />
                    </div>
                    {pwError && <p className="error-box">{pwError}</p>}
                    <div className="settings-pw-btns">
                      <button onClick={() => { setShowPasswordForm(false); setPwError(""); setPwCurrent(""); setPwNew(""); setPwConfirm("") }} className="btn-cancel">Cancel</button>
                      <button onClick={handleChangePassword} className="btn-primary settings-pw-save" style={{ background: pwSaved ? "#4ade80" : accent }}>
                        {pwSaved ? <><Check size={12} />Saved!</> : "Update Password"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="settings-action-row" onClick={() => setShowLogoutConfirm(true)}>
                  <div className="settings-action-icon settings-action-icon--danger">
                    <LogOut size={14} color="#f87171" strokeWidth={2} />
                  </div>
                  <div className="settings-action-body">
                    <p className="settings-action-title danger">Log Out</p>
                    <p className="settings-action-sub">Sign out of CreatorStart</p>
                  </div>
                  <ChevronRight size={13} color="var(--dim)" />
                </div>

                <div className="settings-action-row" onClick={() => setShowDeleteConfirm(true)}>
                  <div className="settings-action-icon settings-action-icon--danger">
                    <Trash2 size={14} color="#f87171" strokeWidth={2} />
                  </div>
                  <div className="settings-action-body">
                    <p className="settings-action-title danger">Delete Account</p>
                    <p className="settings-action-sub">Permanently remove your account and all data</p>
                  </div>
                  <ChevronRight size={13} color="var(--dim)" />
                </div>
              </div>
            </div>

            <p className="settings-footer">CreatorStart v1.0.0 · Made for creators</p>
          </main>
        </div>
      </div>

      {showAvatarPreview && avatar && (
        <>
          <div onClick={() => setShowAvatarPreview(false)} className="modal-overlay settings-preview-overlay" />
          <img src={avatar} alt="avatar" className="settings-avatar-preview" />
        </>
      )}

      {cropSrc && (
        <>
          <div className="crop-overlay" />
          <div className="crop-modal">
            <div className="crop-modal-head">
              <button onClick={() => setCropSrc(null)} className="crop-cancel-btn">Cancel</button>
              <p className="crop-modal-title">Edit photo</p>
              <button onClick={handleCropAndUpload} className="crop-done-btn" style={{ color: accent }}>Done</button>
            </div>
            <div className={`crop-canvas${isDragging ? " crop-canvas--grabbing" : ""}`}
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
              <div className="crop-circle-mask" />
            </div>
            <div className="crop-zoom-row">
              <button onClick={() => setCropZoom(z => Math.max(1, z - 0.1))} className="crop-zoom-btn">−</button>
              <div className="crop-zoom-track" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setCropZoom(1 + ((e.clientX - r.left) / r.width) * 3) }}>
                <div className="crop-zoom-fill" style={{ width: `${((cropZoom - 1) / 3) * 100}%` }} />
                <div className="crop-zoom-thumb" style={{ left: `${((cropZoom - 1) / 3) * 100}%` }} />
              </div>
              <button onClick={() => setCropZoom(z => Math.min(4, z + 0.1))} className="crop-zoom-btn">+</button>
            </div>
            <p className="crop-hint">Drag to reposition · scroll to zoom</p>
          </div>
        </>
      )}

      {showLogoutConfirm && (
        <>
          <div onClick={() => setShowLogoutConfirm(false)} className="modal-overlay" />
          <div className="modal-box settings-confirm-modal">
            <div className="settings-confirm-icon settings-confirm-icon--danger"><LogOut size={20} color="#f87171" /></div>
            <h2 className="settings-confirm-title">Log out?</h2>
            <p className="settings-confirm-sub">You will be signed out. Your data and plans stay saved.</p>
            <div className="settings-confirm-btns">
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-cancel">Stay</button>
              <button onClick={handleLogout} className="btn-danger">Log out</button>
            </div>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <>
          <div onClick={() => setShowDeleteConfirm(false)} className="modal-overlay" />
          <div className="modal-box settings-confirm-modal">
            <div className="settings-confirm-icon settings-confirm-icon--danger"><Trash2 size={20} color="#f87171" /></div>
            <h2 className="settings-confirm-title">Delete account?</h2>
            <p className="settings-confirm-sub">This permanently deletes your account, all plans, and content. Cannot be undone.</p>
            <div className="settings-confirm-btns">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleDeleteAccount} className="btn-danger">Yes, delete</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
