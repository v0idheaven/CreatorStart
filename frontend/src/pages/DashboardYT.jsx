import { createElement, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, CalendarDays, FileText, TrendingUp, Users, Eye, PlaySquare, Timer } from "lucide-react"
import Sidebar from "../components/Sidebar"
import StreakCard from "../components/StreakCard"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"

const viewData = [
  { day: "Mon", views: 1200 }, { day: "Tue", views: 980 },
  { day: "Wed", views: 2100 }, { day: "Thu", views: 1800 },
  { day: "Fri", views: 2400 }, { day: "Sat", views: 3100 }, { day: "Sun", views: 2700 },
]


const videos = [
  { id: 1, title: "How to grow on YouTube in 2025", type: "Video", views: 12400, likes: 843, comments: 91, duration: "14:32", status: "done" },
  { id: 2, title: "Morning routine vlog", type: "Short", views: 31000, likes: 2100, comments: 187, duration: "0:58", status: "done" },
  { id: 3, title: "My editing workflow 2025", type: "Video", views: 0, likes: 0, comments: 0, duration: "22:10", status: "draft" },
  { id: 4, title: "5 mistakes new creators make", type: "Short", views: 0, likes: 0, comments: 0, duration: "0:55", status: "planned" },
]

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return String(n)
}

const YT = "#ff4444"
const YTbg = "#ff444415"

export default function DashboardYT() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)
  const [ytVideos, setYtVideos] = useState([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.youtubeStats) {
      apiFetch(API_ENDPOINTS.youtubeVideos).then(r => r.json()).then(d => {
        if (Array.isArray(d?.data)) setYtVideos(d.data)
      }).catch(() => {})
    }
  }, [])

  const stats = [
    { label: "Subscribers", value: "2.4K", icon: Users, color: YT },
    { label: "Total Views", value: "48.2K", icon: Eye, color: "#60a5fa" },
    { label: "Videos", value: 18, icon: PlaySquare, color: "#818cf8" },
    { label: "Watch Time", value: "1.2K hrs", icon: Timer, color: "#4ade80" },
  ]

  const quickActions = [
    { icon: Zap, title: "Content Generator", desc: "Generate hooks, scripts & CTAs for your next video.", href: "/generator" },
    { icon: CalendarDays, title: "30-Day Planner", desc: "Plan your upload schedule for the month.", href: "/planner" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ marginLeft: "72px", flex: 1, display: "flex", justifyContent: "center" }}>
      <main style={{ width: "100%", maxWidth: "1100px", padding: "40px" }}>

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: YT }} />
            <p style={{ fontSize: "11px", color: YT, textTransform: "uppercase", letterSpacing: "2px", margin: 0, fontWeight: "600" }}>YouTube Studio</p>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Channel Overview</h1>
          <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Last 28 days performance</p>
        </div>

        <div className="stat-grid" style={{ marginBottom: "20px" }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} className="card" style={{ padding: "20px 20px 16px" }}>
              <div className="stat-card-top">
                <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>{label}</span>
                <div className="stat-icon" style={{ background: color + "20" }}>
                  {createElement(icon, { size: 14, color, strokeWidth: 2 })}
                </div>
              </div>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={11} color="#4ade80" />
                <span style={{ fontSize: "11px", color: "#4ade80" }}>vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <div className="chart-header">
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Views this week</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Daily view count</p>
              </div>
              <span className="chart-badge" style={{ color: YT, borderColor: "#ff444430", background: YTbg }}>YouTube</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={viewData}>
                <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                <Bar dataKey="views" fill={YT} radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <StreakCard accent={YT} platform="youtube" ytVideos={ytVideos} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 12px" }}>Quick Actions</p>
          <div className="quick-actions-grid">
            {quickActions.map(({ icon, title, desc, href }) => (
              <div key={title} className="card" onClick={() => navigate(href)}
                onMouseEnter={() => setHovered(title)} onMouseLeave={() => setHovered(null)}
                style={{ padding: "20px", cursor: "pointer", borderColor: hovered === title ? YT : "var(--border)", transition: "border-color 0.15s" }}>
                <div className="quick-action-icon" style={{ background: YTbg }}>
                  {createElement(icon, { size: 16, color: YT, strokeWidth: 2 })}
                </div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 5px" }}>{title}</p>
                <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0, lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>Recent Videos</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px 80px 80px", padding: "10px 20px", borderBottom: "1px solid var(--border)" }}>
            {["Title", "Type", "Views", "Likes", "Comments", "Status"].map(h => (
              <span key={h} style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
            ))}
          </div>
          {videos.map(v => (
            <div key={v.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px 80px 80px", padding: "13px 20px", borderBottom: "1px solid var(--border)", alignItems: "center", transition: "background 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div>
                <p style={{ fontSize: "13px", color: "var(--text)", margin: "0 0 2px", fontWeight: "500" }}>{v.title}</p>
                <span style={{ fontSize: "11px", color: "var(--dim)" }}>{v.duration}</span>
              </div>
              <span style={{ fontSize: "11px", background: YTbg, color: YT, padding: "2px 8px", borderRadius: "4px", width: "fit-content" }}>{v.type}</span>
              <span style={{ fontSize: "12px", color: v.views > 0 ? "var(--text)" : "var(--dim)" }}>{v.views > 0 ? fmt(v.views) : "—"}</span>
              <span style={{ fontSize: "12px", color: v.likes > 0 ? "var(--text)" : "var(--dim)" }}>{v.likes > 0 ? fmt(v.likes) : "—"}</span>
              <span style={{ fontSize: "12px", color: v.comments > 0 ? "var(--text)" : "var(--dim)" }}>{v.comments > 0 ? fmt(v.comments) : "—"}</span>
              <span className={`post-badge ${v.status}`}>{v.status}</span>
            </div>
          ))}
        </div>

      </main>
      </div>
    </div>
  )
}
