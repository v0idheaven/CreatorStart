import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Zap, Calendar, FileText, Settings, BarChart2, LogOut } from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FileText, label: "Content", href: "/posts" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Zap, label: "Content Generator", href: "/generator" },
  { icon: Calendar, label: "30-Day Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      className="sidebar"
      style={{ width: isOpen ? "240px" : "72px" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">CS</div>
        <span className="sidebar-logo-text" style={{ opacity: isOpen ? 1 : 0 }}>
          Creator<span>Start</span>
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
            >
              <item.icon
                size={20}
                color={active ? "#818cf8" : "var(--dim)"}
                strokeWidth={active ? 2.2 : 1.8}
                style={{ minWidth: "20px" }}
              />
              <span
                className="sidebar-nav-label"
                style={{
                  color: active ? "var(--text)" : "var(--muted)",
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
          <div className="sidebar-avatar">VY</div>
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
