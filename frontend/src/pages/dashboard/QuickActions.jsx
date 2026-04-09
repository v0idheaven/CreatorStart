import { createElement, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Zap, CalendarDays } from "lucide-react"

const ACTIONS = [
  { icon: Zap, title: "Content Generator", desc: "Generate hooks, scripts & CTAs.", href: "/generator" },
  { icon: CalendarDays, title: "30-Day Planner", desc: "Organize your content pipeline.", href: "/planner" },
]

// Quick action cards — Content Generator + Planner
export default function QuickActions({ accent }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ marginBottom: "20px" }}>
      <p className="dash-quick-label">Quick Actions</p>
      <div className="quick-actions-grid">
        {ACTIONS.map(({ icon, title, desc, href }) => (
          <div key={title} className="card dash-quick-card"
            onClick={() => navigate(href)}
            onMouseEnter={() => setHovered(title)}
            onMouseLeave={() => setHovered(null)}
            style={{ borderColor: hovered === title ? accent : "var(--border)" }}>
            <div className="quick-action-icon" style={{ background: accent + "15" }}>
              {createElement(icon, { size: 16, color: accent, strokeWidth: 2 })}
            </div>
            <p className="dash-quick-title">{title}</p>
            <p className="dash-quick-desc">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
