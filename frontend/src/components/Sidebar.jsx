import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Zap, Calendar, Settings, FileText, BarChart2 } from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Zap, label: "Generator", href: "/generator" },
  { icon: Calendar, label: "Planner", href: "/planner" },
  { icon: FileText, label: "Content", href: "/content" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const PLATFORM_CONFIG = {
  youtube: { color: "#ff4444", bg: "#ff444418", logoColor: "#ff4444", label: "YouTube" },
  instagram: { color: "#c13584", bg: "#c1358418", logoColor: "#c13584", label: "Instagram" },
  both: { color: "#818cf8", bg: "#818cf818", logoColor: "#818cf8", label: "CreatorStart" },
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isMobile
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()

  const platform = localStorage.getItem("platform") || "both"
  const cfg = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.both
  const { color, bg, logoColor, label } = cfg

  const [userState, setUserState] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"))
  useEffect(() => {
    const refresh = () => setUserState(JSON.parse(localStorage.getItem("user") || "{}"))
    window.addEventListener("userUpdated", refresh)
    return () => window.removeEventListener("userUpdated", refresh)
  }, [])

  const displayName = userState.fullName || "User"
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  const avatarUrl = userState.avatar || ""

  // Mobile — bottom tab bar
  if (isMobile) {
    return (
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "60px", background: "var(--sb)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", zIndex: 200, padding: "0 4px" }}>
        {navItems.map(item => {
          const active = location.pathname === item.href
          return (
            <div key={item.label} onClick={() => navigate(item.href)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", padding: "6px 4px", borderRadius: "8px", cursor: "pointer", background: active ? bg : "transparent" }}>
              <item.icon size={18} color={active ? color : "var(--dim)"} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: "9px", color: active ? color : "var(--dim)", fontWeight: active ? "600" : "400" }}>{item.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // Desktop — left sidebar
  return (
    <div className="sidebar" style={{ width: isOpen ? "240px" : "72px" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}>

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: color }}>
          {platform === "youtube" ? "YT" : platform === "instagram" ? "IG" : "CS"}
        </div>
        <span className="sidebar-logo-text" style={{ opacity: isOpen ? 1 : 0 }}>
          {platform === "both"
            ? <>Creator<span style={{ color: logoColor }}>Start</span></>
            : <span style={{ color: logoColor }}>{label}</span>
          }
        </span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const active = location.pathname === item.href
          return (
            <div key={item.label} className={`sidebar-nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.href)}
              style={{ background: active ? bg : "transparent" }}>
              <item.icon size={20} color={active ? color : "var(--dim)"} strokeWidth={active ? 2.2 : 1.8} style={{ minWidth: "20px" }} />
              <span className="sidebar-nav-label" style={{ color: active ? color : "var(--muted)", fontWeight: active ? "600" : "400", opacity: isOpen ? 1 : 0 }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="sidebar-user">
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{ width: "28px", height: "28px", minWidth: "28px", borderRadius: "50%", objectFit: "cover" }} />
            : <div className="sidebar-avatar" style={{ background: color }}>{initials}</div>
          }
          {isOpen && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="sidebar-user-name">{displayName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
