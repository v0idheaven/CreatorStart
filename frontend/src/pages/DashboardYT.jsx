import { createElement, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, CalendarDays, TrendingUp, Users, Eye, PlaySquare, Timer } from "lucide-react"
import Sidebar from "../components/Sidebar"
import StreakCard from "../components/StreakCard"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"
import "./Dashboard.css"

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
    <div className="dash-root">
      <Sidebar />
      <div className="dash-content">
        <main className="dash-main">

          <div className="dash-header">
            <div className="dash-kicker">
              <div className="dash-kicker-dot" style={{ background: YT }} />
              <p className="dash-kicker-label" style={{ color: YT }}>YouTube Studio</p>
            </div>
            <h1 className="dash-title">Channel Overview</h1>
            <p className="dash-sub">Last 28 days performance</p>
          </div>

          <div className="stat-grid" style={{ marginBottom: "20px" }}>
            {stats.map(({ label, value, icon, color }) => (
              <div key={label} className="card" style={{ padding: "20px 20px 16px" }}>
                <div className="stat-card-top">
                  <span className="dash-stat-label">{label}</span>
                  <div className="stat-icon" style={{ background: color + "20" }}>
                    {createElement(icon, { size: 14, color, strokeWidth: 2 })}
                  </div>
                </div>
                <p className="dash-stat-value">{value}</p>
                <div className="dash-stat-trend">
                  <TrendingUp size={11} color="#4ade80" />
                  <span className="dash-stat-trend-text">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-chart-row">
            <div className="card dash-chart-card">
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
            <p className="dash-quick-label">Quick Actions</p>
            <div className="quick-actions-grid">
              {quickActions.map(({ icon, title, desc, href }) => (
                <div key={title} className="card dash-quick-card"
                  onClick={() => navigate(href)}
                  onMouseEnter={() => setHovered(title)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ borderColor: hovered === title ? YT : "var(--border)" }}>
                  <div className="quick-action-icon" style={{ background: YTbg }}>
                    {createElement(icon, { size: 16, color: YT, strokeWidth: 2 })}
                  </div>
                  <p className="dash-quick-title">{title}</p>
                  <p className="dash-quick-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div className="dash-table-header">
              <span className="dash-table-title">Recent Videos</span>
            </div>
            <div className="dash-table-cols">
              {["Title", "Type", "Views", "Likes", "Comments", "Status"].map(h => (
                <span key={h} className="dash-table-col-label">{h}</span>
              ))}
            </div>
            {videos.map(v => (
              <div key={v.id} className="dash-table-row">
                <div>
                  <p className="dash-row-title">{v.title}</p>
                  <span className="dash-row-meta">{v.duration}</span>
                </div>
                <span className="dash-type-badge" style={{ background: YTbg, color: YT }}>{v.type}</span>
                <span className="dash-row-stat" style={{ color: v.views > 0 ? "var(--text)" : "var(--dim)" }}>{v.views > 0 ? fmt(v.views) : "—"}</span>
                <span className="dash-row-stat" style={{ color: v.likes > 0 ? "var(--text)" : "var(--dim)" }}>{v.likes > 0 ? fmt(v.likes) : "—"}</span>
                <span className="dash-row-stat" style={{ color: v.comments > 0 ? "var(--text)" : "var(--dim)" }}>{v.comments > 0 ? fmt(v.comments) : "—"}</span>
                <span className={`post-badge ${v.status}`}>{v.status}</span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
