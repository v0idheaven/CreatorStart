import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Bell, Shield, LogOut, Check, Camera, Youtube, Instagram, Layers, ChevronRight, Lock, Trash2 } from "lucide-react"
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

  const [name, setName] = useState("Varun Yadav")
  const [email, setEmail] = useState("varun@email.com")
  const [username, setUsername] = useState("varunyadav")
  const [niche, setNiche] = useState("Tech")
  const [bio, setBio] = useState("")
  const [editingProfile, setEditingProfile] = useState(false)
  const [saved, setSaved] = useState(false)

  const [notifNew, setNotifNew] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [notifTips, setNotifTips] = useState(false)
  const [notifPlanner, setNotifPlanner] = useState(true)

  const [selectedPlatform, setSelectedPlatform] = useState(platform)

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  function handleSaveProfile() {
    setSaved(true)
    setEditingProfile(false)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePlatformChange(p) {
    setSelectedPlatform(p)
    localStorage.setItem("platform", p)
    window.location.reload()
  }

  function handleLogout() {
    localStorage.removeItem("platform")
    navigate("/auth")
  }

  const platforms = [
    { id: "youtube", label: "YouTube", desc: "Videos, Shorts & channel growth", color: "#ff4444", Icon: Youtube },
    { id: "instagram", label: "Instagram", desc: "Reels, posts & profile growth", color: "#c13584", Icon: Instagram },
    { id: "both", label: "Both Platforms", desc: "One dashboard for everything", color: "#818cf8", Icon: Layers },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ marginLeft: "72px", flex: 1, padding: "40px 48px", maxWidth: "760px" }}>

        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Account</p>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Settings</h1>
          <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Manage your profile, platform and preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", color: "#fff" }}>
                {initials}
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "20px", height: "20px", borderRadius: "50%", background: "var(--border2)", border: "2px solid var(--card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={10} color="var(--muted)" />
              </div>
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
            {[
              { icon: Lock, label: "Change Password", desc: "Update your login password", danger: false, onClick: () => {} },
              { icon: Trash2, label: "Delete Account", desc: "Permanently remove your account and all data", danger: true, onClick: () => {} },
              { icon: LogOut, label: "Log Out", desc: "Sign out of CreatorStart", danger: true, onClick: handleLogout },
            ].map((item, i, arr) => (
              <div key={item.label} onClick={item.onClick}
                onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.1s" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: item.danger ? "#f8717115" : accent + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={15} color={item.danger ? "#f87171" : accent} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: item.danger ? "#f87171" : "var(--text)", margin: "0 0 2px" }}>{item.label}</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{item.desc}</p>
                </div>
                <ChevronRight size={14} color="var(--dim)" />
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "var(--dim)", textAlign: "center" }}>CreatorStart v1.0.0 · Made for creators</p>

      </main>
    </div>
  )
}
