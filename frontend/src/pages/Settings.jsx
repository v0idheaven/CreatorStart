import { createElement, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Bell, Shield, LogOut, ChevronRight, Check } from "lucide-react"
import Sidebar from "../components/Sidebar"

const platform = localStorage.getItem("platform") || "both"
const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
const accent = COLORS[platform] || COLORS.both

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 12px", fontWeight: "600" }}>
        {title}
      </p>
      <div className="card" style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  )
}

function Row({ icon, label, desc, right, onClick, danger }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        cursor: onClick ? "pointer" : "default",
        background: hovered && onClick ? "var(--sb)" : "transparent",
        transition: "background 0.1s",
      }}
    >
      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: danger ? "#f8717118" : accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {createElement(icon, { size: 15, color: danger ? "#f87171" : accent, strokeWidth: 2 })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", fontWeight: "500", color: danger ? "#f87171" : "var(--text)", margin: "0 0 2px" }}>{label}</p>
        {desc && <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{desc}</p>}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      {onClick && !right && <ChevronRight size={14} color="var(--dim)" />}
    </div>
  )
}

function Toggle({ value, onChange, color }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: "36px", height: "20px", borderRadius: "10px",
        background: value ? color : "var(--border2)",
        position: "relative", cursor: "pointer", transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
        position: "absolute", top: "3px",
        left: value ? "19px" : "3px",
        transition: "left 0.2s",
      }} />
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()

  const [name, setName] = useState("Varun Yadav")
  const [email, setEmail] = useState("varun@email.com")
  const [niche, setNiche] = useState("Tech")
  const [editingProfile, setEditingProfile] = useState(false)
  const [saved, setSaved] = useState(false)

  const [notifNew, setNotifNew] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [notifTips, setNotifTips] = useState(false)

  const [selectedPlatform, setSelectedPlatform] = useState(platform)

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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ marginLeft: "72px", flex: 1, padding: "40px", maxWidth: "700px" }}>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Preferences</p>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Settings</h1>
          <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Manage your account and preferences.</p>
        </div>

        <Section title="Profile">
          <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: editingProfile ? "20px" : "0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>
                VY
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>{name}</p>
                <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>{email}</p>
              </div>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${editingProfile ? "var(--border2)" : accent}`, background: "transparent", color: editingProfile ? "var(--muted)" : accent, fontSize: "12px", cursor: "pointer", fontWeight: "500" }}
              >
                {editingProfile ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingProfile && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Name</label>
                  <input className="input-sm" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Email</label>
                  <input className="input-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Niche</label>
                  <input className="input-sm" value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. Tech, Finance, Fitness..." />
                </div>
                <button
                  onClick={handleSaveProfile}
                  style={{ padding: "9px", borderRadius: "9px", border: "none", background: accent, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  {saved ? <><Check size={13} /> Saved</> : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </Section>

        <Section title="Platform">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 14px" }}>Change your active platform. This updates your dashboard and content tools.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "youtube", label: "YouTube", desc: "Videos, Shorts & channel growth", color: "#ff4444" },
                { id: "instagram", label: "Instagram", desc: "Reels, posts & profile growth", color: "#c13584" },
                { id: "both", label: "Both Platforms", desc: "One dashboard for everything", color: "#818cf8" },
              ].map(p => (
                <div
                  key={p.id}
                  onClick={() => handlePlatformChange(p.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "10px",
                    border: `1.5px solid ${selectedPlatform === p.id ? p.color : "var(--border2)"}`,
                    background: selectedPlatform === p.id ? p.color + "12" : "var(--bg)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: selectedPlatform === p.id ? "var(--text)" : "var(--muted)", margin: "0 0 1px" }}>{p.label}</p>
                    <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{p.desc}</p>
                  </div>
                  {selectedPlatform === p.id && <Check size={14} color={p.color} />}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Notifications">
          <Row icon={Bell} label="New content ideas" desc="Get notified when new AI suggestions are ready"
            right={<Toggle value={notifNew} onChange={setNotifNew} color={accent} />} />
          <Row icon={Bell} label="Weekly summary" desc="A weekly recap of your content performance"
            right={<Toggle value={notifWeekly} onChange={setNotifWeekly} color={accent} />} />
          <Row icon={Bell} label="Creator tips" desc="Occasional tips to grow your channel"
            right={<Toggle value={notifTips} onChange={setNotifTips} color={accent} />} />
        </Section>

        <Section title="Account">
          <Row icon={Shield} label="Change Password" desc="Update your account password" onClick={() => {}} />
          <Row icon={User} label="Delete Account" desc="Permanently delete your account and data" danger onClick={() => {}} />
          <Row icon={LogOut} label="Log Out" desc="Sign out of CreatorStart" danger onClick={handleLogout} />
        </Section>

      </main>
    </div>
  )
}
