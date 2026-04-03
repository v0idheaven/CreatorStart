import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Camera, Eye, EyeOff, Pencil, Youtube, Instagram, Layers, ChevronRight, Lock, Trash2, LogOut, X } from "lucide-react"
import Sidebar from "../components/Sidebar"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }

function Toggle({ value, onChange, color }) {
  return (
    <div onClick={() => onChange(!value)}
      style={{ width: "38px", height: "22px", borderRadius: "11px", background: value ? color : "var(--border2)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: value ? "19px" : "3px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    </div>
  )
}

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
  const [saved, setSaved] = useState(false)
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

  const [notifNew, setNotifNew] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [notifTips, setNotifTips] = useState(false)
  const [notifPlanner, setNotifPlanner] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pwCurrent, setPwCurrent] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwError, setPwError] = useState("")
  const [pwSaved, setPwSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const [selectedPlatform, setSelectedPlatform] = useState(platform)

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  function handleSaveProfile() {
    const updated = { ...JSON.parse(localStorage.getItem("user") || "{}"), fullName: name, email, username, niche, bio }
    localStorage.setItem("user", JSON.stringify(updated))
    window.dispatchEvent(new Event("userUpdated"))
    setSaved(true)
    setEditingProfile(false)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleChangePassword() {
    setPwError("")
    const stored = JSON.parse(localStorage.getItem("user") || "{}")
    if (!pwCurrent) { setPwError("Enter your current password."); return }
    if (stored.password && pwCurrent !== stored.password) { setPwError("Current password is incorrect."); return }
    if (pwNew.length < 6) { setPwError("New password must be at least 6 characters."); return }
    if (pwNew !== pwConfirm) { setPwError("Passwords don't match."); return }
    const updated = { ...stored, password: pwNew }
    localStorage.setItem("user", JSON.stringify(updated))
    setPwSaved(true)
    setPwCurrent(""); setPwNew(""); setPwConfirm("")
    setTimeout(() => { setPwSaved(false); setShowPasswordForm(false) }, 2000)
  }

  function handleDeleteAccount() {
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

  function handleCropAndUpload() {
    const img = cropImgRef.current
    if (!img) return
    setAvatarUploading(true)
    setCropSrc(null)

    const size = 400
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()

    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const baseScale = Math.min(size / iw, size / ih) * cropZoom
    const sw = iw * baseScale
    const sh = ih * baseScale
    const dx = (size - sw) / 2 + cropPos.x * (size / 360)
    const dy = (size - sh) / 2 + cropPos.y * (size / 360)

    ctx.drawImage(img, dx, dy, sw, sh)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    setAvatar(dataUrl)
    const updated = { ...JSON.parse(localStorage.getItem("user") || "{}"), avatar: dataUrl }
    localStorage.setItem("user", JSON.stringify(updated))
    window.dispatchEvent(new Event("userUpdated"))
    setAvatarUploading(false)
  }

  function handlePlatformChange(p) {
    setSelectedPlatform(p)
    localStorage.setItem("platform", p)
    window.location.reload()
  }

  function handleLogout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    localStorage.removeItem("platform")
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
      <main style={{ width: "100%", maxWidth: "760px", padding: "40px 48px" }}>

        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Account</p>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Settings</h1>
          <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Manage your profile, platform and preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div onClick={() => { if (editingProfile) setShowAvatarMenu(m => !m); else if (avatar) setShowAvatarPreview(true) }}
                style={{ cursor: "pointer", position: "relative" }}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", color: "#fff" }}>
                      {initials}
                    </div>
                }
                {editingProfile && (
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Camera size={16} color="#fff" />
                  </div>
                )}
              </div>

              {showAvatarMenu && editingProfile && (
                <>
                  <div onClick={() => setShowAvatarMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                  <div style={{ position: "absolute", top: "72px", left: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", zIndex: 51, minWidth: "140px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                    {avatar && (
                      <button onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true) }}
                        style={{ width: "100%", padding: "10px 14px", background: "transparent", border: "none", color: "var(--text)", fontSize: "13px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <Eye size={14} color="var(--muted)" /> View photo
                      </button>
                    )}
                    <button onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click() }}
                      style={{ width: "100%", padding: "10px 14px", background: "transparent", border: "none", color: "var(--text)", fontSize: "13px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Pencil size={14} color="var(--muted)" /> Edit photo
                    </button>
                  </div>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {!editingProfile ? (
                <>
                  <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: "0 0 2px" }}>{name}</p>
                  <p style={{ fontSize: "12px", color: "var(--dim)", margin: "0 0 4px" }}>@{username}</p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>{email}</p>
                  {niche && <span style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", color: accent, background: accent + "15", padding: "2px 10px", borderRadius: "10px", fontWeight: "600" }}>{niche}</span>}
                </>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Full Name</label>
                    <input className="input-sm" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Username</label>
                    <input className="input-sm" value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Email</label>
                    <input className="input-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Niche</label>
                    <input className="input-sm" value={niche} onChange={e => setNiche(e.target.value)} placeholder="Tech, Finance..." />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Bio</label>
                    <input className="input-sm" value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio about you..." />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              {editingProfile && (
                <button onClick={handleSaveProfile}
                  style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: accent, color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                  {saved ? <><Check size={12} />Saved</> : "Save"}
                </button>
              )}
              <button onClick={() => setEditingProfile(!editingProfile)}
                style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${editingProfile ? "var(--border2)" : accent + "60"}`, background: "transparent", color: editingProfile ? "var(--muted)" : accent, fontSize: "12px", cursor: "pointer" }}>
                {editingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Platform */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 12px", fontWeight: "600" }}>Active Platform</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {platforms.map(({ id, label, desc, color, Icon }) => (
              <div key={id} onClick={() => handlePlatformChange(id)}
                style={{ padding: "16px", borderRadius: "12px", border: `1.5px solid ${selectedPlatform === id ? color : "var(--border)"}`, background: selectedPlatform === id ? color + "10" : "var(--card)", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  <Icon size={16} color={color} strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: selectedPlatform === id ? "var(--text)" : "var(--muted)", margin: "0 0 3px" }}>{label}</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0, lineHeight: "1.4" }}>{desc}</p>
                {selectedPlatform === id && (
                  <div style={{ position: "absolute", top: "10px", right: "10px", width: "18px", height: "18px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 12px", fontWeight: "600" }}>Notifications</p>
          <div className="card" style={{ overflow: "hidden" }}>
            {[
              { label: "AI content suggestions", desc: "When new ideas are ready for you", value: notifNew, set: setNotifNew },
              { label: "Weekly performance recap", desc: "Summary of your content this week", value: notifWeekly, set: setNotifWeekly },
              { label: "Planner reminders", desc: "Remind me to post on scheduled days", value: notifPlanner, set: setNotifPlanner },
              { label: "Creator tips & tricks", desc: "Occasional growth tips from CreatorStart", value: notifTips, set: setNotifTips },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)", margin: "0 0 2px" }}>{item.label}</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{item.desc}</p>
                </div>
                <Toggle value={item.value} onChange={item.set} color={accent} />
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 12px", fontWeight: "600" }}>Account</p>
          <div className="card" style={{ overflow: "hidden" }}>
            <div onClick={() => setShowPasswordForm(p => !p)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.1s" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Lock size={15} color={accent} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)", margin: "0 0 2px" }}>Change Password</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Update your login password</p>
              </div>
              <ChevronRight size={14} color="var(--dim)" style={{ transform: showPasswordForm ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </div>

            {showPasswordForm && (
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--sb)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Current password</label>
                    <input className="input-sm" type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>New password</label>
                    <div style={{ position: "relative" }}>
                      <input className="input-sm" type={showPw ? "text" : "password"} value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="Min 6 characters" style={{ paddingRight: "40px" }} />
                      <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex" }}>
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Confirm new password</label>
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

            <div onClick={() => setShowDeleteConfirm(true)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.1s" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={15} color="#f87171" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#f87171", margin: "0 0 2px" }}>Delete Account</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Permanently remove your account and all data</p>
              </div>
              <ChevronRight size={14} color="var(--dim)" />
            </div>

            <div onClick={() => setShowLogoutConfirm(true)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", cursor: "pointer", transition: "background 0.1s" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LogOut size={15} color="#f87171" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#f87171", margin: "0 0 2px" }}>Log Out</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Sign out of CreatorStart</p>
              </div>
              <ChevronRight size={14} color="var(--dim)" />
            </div>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "var(--dim)", textAlign: "center" }}>CreatorStart v1.0.0 · Made for creators</p>

      </main>
      </div>
    </div>

    {showAvatarPreview && avatar && (
      <>
        <div onClick={() => setShowAvatarPreview(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, cursor: "pointer" }} />
        <img src={avatar} alt="avatar"
          style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "240px", height: "240px", borderRadius: "50%", objectFit: "cover", zIndex: 101, boxShadow: "0 0 0 4px rgba(255,255,255,0.1)" }} />
      </>
    )}

    {cropSrc && (
      <>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden", width: "360px", boxSizing: "border-box" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setCropSrc(null)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer", padding: 0 }}>Cancel</button>
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
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: `translate(calc(-50% + ${cropPos.x}px), calc(-50% + ${cropPos.y}px)) scale(${cropZoom})`,
                transformOrigin: "center",
                userSelect: "none", pointerEvents: "none",
              }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)", pointerEvents: "none" }} />
          </div>

          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button onClick={() => setCropZoom(z => Math.max(1, z - 0.1))}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>−</button>
              <div style={{ flex: 1, position: "relative", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", cursor: "pointer" }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pct = (e.clientX - rect.left) / rect.width
                  setCropZoom(1 + pct * 3)
                }}>
                <div style={{ height: "100%", width: `${((cropZoom - 1) / 3) * 100}%`, background: "#fff", borderRadius: "2px", transition: "width 0.1s" }} />
                <div style={{ position: "absolute", top: "50%", left: `${((cropZoom - 1) / 3) * 100}%`, transform: "translate(-50%, -50%)", width: "14px", height: "14px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
              </div>
              <button onClick={() => setCropZoom(z => Math.min(4, z + 0.1))}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "10px 0 0" }}>Drag to reposition · Scroll or use slider to zoom</p>
          </div>
        </div>
      </>
    )}
    {showLogoutConfirm && (
      <>
        <div onClick={() => setShowLogoutConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "380px", zIndex: 101, boxSizing: "border-box", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <LogOut size={22} color="#f87171" />
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Log out?</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 24px", lineHeight: "1.6" }}>
            You'll be signed out of CreatorStart. Your data and plans will stay saved.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowLogoutConfirm(false)}
              style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>
              Stay
            </button>
            <button onClick={handleLogout}
              style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", background: "#f87171", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Log out
            </button>
          </div>
        </div>
      </>
    )}

    {showDeleteConfirm && (
      <>
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "380px", zIndex: 101, boxSizing: "border-box", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Trash2 size={22} color="#f87171" />
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Delete account?</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 24px", lineHeight: "1.6" }}>
            This will permanently delete your account, all your plans, and content. This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowDeleteConfirm(false)}
              style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleDeleteAccount}
              style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", background: "#f87171", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Yes, delete
            </button>
          </div>
        </div>
      </>
    )}
    </>
  )
}