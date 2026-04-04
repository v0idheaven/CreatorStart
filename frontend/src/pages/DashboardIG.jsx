import { createElement, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, CalendarDays, TrendingUp, Users, Eye, Heart, MessageCircle, Image } from "lucide-react"
import Sidebar from "../components/Sidebar"
import StreakCard from "../components/StreakCard"
import "./Dashboard.css"

const reachData = [
  { day: "Mon", reach: 3200 }, { day: "Tue", reach: 2800 },
  { day: "Wed", reach: 5100 }, { day: "Thu", reach: 4400 },
  { day: "Fri", reach: 6200 }, { day: "Sat", reach: 8900 }, { day: "Sun", reach: 7100 },
]

const posts = [
  { id: 1, title: "Behind the scenes reel", type: "Reel", likes: 2400, comments: 187, reach: 31000, status: "done" },
  { id: 2, title: "Top 10 finance tips", type: "Carousel", likes: 1100, comments: 54, reach: 8200, status: "done" },
  { id: 3, title: "AI tools for creators", type: "Reel", likes: 0, comments: 0, reach: 0, status: "planned" },
  { id: 4, title: "Morning routine aesthetic", type: "Post", likes: 0, comments: 0, reach: 0, status: "draft" },
]

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return String(n)
}

const IG = "#c13584"
const IGbg = "#c1358415"

export default function DashboardIG() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)

  const stats = [
    { label: "Followers", value: "5.8K", icon: Users, color: IG },
    { label: "Total Reach", value: "124K", icon: Eye, color: "#60a5fa" },
    { label: "Posts", value: 34, icon: Image, color: "#818cf8" },
    { label: "Avg. Likes", value: "1.2K", icon: Heart, color: "#f472b6" },
  ]

  const quickActions = [
    { icon: Zap, title: "Content Generator", desc: "Generate captions, hooks & reel ideas.", href: "/generator" },
    { icon: CalendarDays, title: "30-Day Planner", desc: "Plan your posting schedule for the month.", href: "/planner" },
  ]

  return (
    <div className="dash-root">
      <Sidebar />
      <div className="dash-content">
        <main className="dash-main">

          <div className="dash-header">
            <div className="dash-kicker">
              <div className="dash-kicker-dot" style={{ background: IG }} />
              <p className="dash-kicker-label" style={{ color: IG }}>Instagram Analytics</p>
            </div>
            <h1 className="dash-title">Profile Overview</h1>
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
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Reach this week</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Daily accounts reached</p>
                </div>
                <span className="chart-badge" style={{ color: IG, borderColor: "#c1358430", background: IGbg }}>Instagram</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={reachData}>
                  <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                  <Bar dataKey="reach" fill={IG} radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StreakCard accent={IG} platform="instagram" />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p className="dash-quick-label">Quick Actions</p>
            <div className="quick-actions-grid">
              {quickActions.map(({ icon, title, desc, href }) => (
                <div key={title} className="card dash-quick-card"
                  onClick={() => navigate(href)}
                  onMouseEnter={() => setHovered(title)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ borderColor: hovered === title ? IG : "var(--border)" }}>
                  <div className="quick-action-icon" style={{ background: IGbg }}>
                    {createElement(icon, { size: 16, color: IG, strokeWidth: 2 })}
                  </div>
                  <p className="dash-quick-title">{title}</p>
                  <p className="dash-quick-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div className="dash-table-header">
              <span className="dash-table-title">Recent Posts</span>
            </div>
            <div className="dash-table-cols">
              {["Title", "Type", "Reach", "Likes", "Comments", "Status"].map(h => (
                <span key={h} className="dash-table-col-label">{h}</span>
              ))}
            </div>
            {posts.map(p => (
              <div key={p.id} className="dash-table-row">
                <p className="dash-row-title">{p.title}</p>
                <span className="dash-type-badge" style={{ background: IGbg, color: IG }}>{p.type}</span>
                <span className="dash-row-stat" style={{ color: p.reach > 0 ? "var(--text)" : "var(--dim)" }}>{p.reach > 0 ? fmt(p.reach) : "—"}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <Heart size={10} color="#f472b6" />
                  <span className="dash-row-stat" style={{ color: p.likes > 0 ? "var(--text)" : "var(--dim)" }}>{p.likes > 0 ? fmt(p.likes) : "—"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <MessageCircle size={10} color="var(--dim)" />
                  <span className="dash-row-stat" style={{ color: p.comments > 0 ? "var(--text)" : "var(--dim)" }}>{p.comments > 0 ? fmt(p.comments) : "—"}</span>
                </div>
                <span className={`post-badge ${p.status}`}>{p.status}</span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
