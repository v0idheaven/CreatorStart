import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Zap, Calendar, Settings, LogOut } from "lucide-react"

const ytNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Zap, label: "Content Generator", href: "/generator" },
  { icon: Calendar, label: "30-Day Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const igNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Zap, label: "Content Generator", href: "/generator" },
  { icon: Calendar, label: "30-Day Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const bothNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Zap, label: "Content Generator", href: "/generator" },
  { icon: Calendar, label: "30-Day Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const PLATFORM_CONFIG = {
  youtube: {
    color: "#ff4444",
    bg: "#ff444418",
    logoColor: "#ff4444",
    navItems: ytNav,
    label: "YouTube",
  },
  instagram: {
    color: "#c13584",
    bg: "#c1358418",
    logoColor: "#c13584",
    navItems: igNav,
    label: "Instagram",
  },
  both: {
    color: "#818cf8",
    bg: "#818cf818",
    logoColor: "#818cf8",
    navItems: bothNav,
    label: "CreatorStart",
  },
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const platform = localStorage.getItem("platform") || "both"
  const cfg = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.both
  const { color, bg, logoColor, navItems, label } = cfg

  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? "240px" : "72px" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
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
        {navItems.map((item) => {
          const active = location.pathname === item.href
          return (
            <div
              key={item.label}
              className={`sidebar-nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.href)}
              style={{ background: active ? bg : "transparent" }}
            >
              <item.icon
                size={20}
                color={active ? color : "var(--dim)"}
                strokeWidth={active ? 2.2 : 1.8}
                style={{ minWidth: "20px" }}
              />
              <span
                className="sidebar-nav-label"
                style={{
                  color: active ? color : "var(--muted)",
                  fontWeight: active ? "600" : "400",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="sidebar-user" onClick={() => navigate("/auth")}>
          <div className="sidebar-avatar" style={{ background: color }}>VY</div>
          {isOpen && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="sidebar-user-name">Varun Yadav</p>
                <p className="sidebar-user-email">varun@email.com</p>
              </div>
              <LogOut size={16} color="var(--dim)" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
