import { createElement, useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, CalendarDays, FileText, AlignLeft, Clock, CheckCheck, Users, Eye, PlaySquare, Timer, Instagram, Youtube } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import StreakCard from "../../components/StreakCard"
import StatGrid from "./StatGrid"
import { fmt, getGreeting } from "./dashUtils"
import useDashboardData from "./useDashboardData"
import "./Dashboard.css"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

const SWITCHER = [
  { id: "overall", label: "Overall", color: "#818cf8" },
  { id: "youtube", label: "YouTube", color: "#ff4444" },
  { id: "instagram", label: "Instagram", color: "#c13584" },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function DashboardBoth() {
  const [view, setView] = useState("overall")
  const { ytVideos, ytStats, ytConnected, realStats, storedUser, streak } = useDashboardData()

  const firstName = storedUser.fullName?.split(" ")[0] || "Creator"
  const platform = localStorage.getItem("platform") || "both"
  const accent = SWITCHER.find(s => s.id === view).color

  // Overall: real planner data
  const plannerData = (() => {
    const plan = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
    const entries = plan?.entries || []
    const active = entries.filter(e => e.active || e.content)
    const done = active.filter(e => e.isCompleted)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const upcoming = active.filter(e => {
      if (!e.date || e.isCompleted) return false
      const d = new Date(e.date); d.setHours(0, 0, 0, 0)
      return d >= today
    }).slice(0, 5)
    return { total: active.length, done: done.length, upcoming }
  })()

  // Overall chart: last 7 days posting activity from planner
  const overallChartData = (() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const plan = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
    const entries = plan?.entries || []
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - (6 - i))
      const posted = entries.filter(e => {
        if (!e.date || !e.isCompleted) return false
        const ed = new Date(e.date); ed.setHours(0, 0, 0, 0)
        return ed.getTime() === d.getTime()
      }).length
      return { day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], value: posted }
    })
  })()

  // YouTube chart: last 7 days upload views
  const ytChartData = (() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - (6 - i))
      const views = ytVideos.filter(v => {
        if (!v.publishedAt) return false
        const vd = new Date(v.publishedAt); vd.setHours(0, 0, 0, 0)
        return vd.getTime() === d.getTime()
      }).reduce((s, v) => s + Number(v.views || 0), 0)
      return { day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1], value: views }
    })
  })()

  // Overall stats — streak from YT videos, replace "Upcoming" with total views
  const ytTotalViews = ytVideos.reduce((s, v) => s + Number(v.views || 0), 0)
  const ytThisMonth = ytVideos.filter(v => {
    if (!v.publishedAt) return false
    const d = new Date(v.publishedAt)
    return d.getFullYear() === new Date().getFullYear() && d.getMonth() === new Date().getMonth()
  }).length

  const overallStats = [
    { label: "Planned", value: plannerData.total, icon: AlignLeft, color: "#818cf8" },
    { label: "Completed", value: plannerData.done, icon: CheckCheck, color: "#4ade80" },
    { label: "Streak", value: streak > 0 ? `${streak}d` : "0d", icon: Clock, color: "#f59e0b" },
    ytConnected
      ? { label: "Views", value: fmt(ytTotalViews), icon: Eye, color: "#60a5fa" }
      : { label: "This month", value: ytThisMonth, icon: FileText, color: "#60a5fa" },
  ]

  const ytStats_display = ytConnected && realStats ? [
    { label: "Subscribers", value: fmt(realStats.subscribers), icon: Users, color: "#ff4444" },
    { label: "Total Views", value: fmt(realStats.views), icon: Eye, color: "#60a5fa" },
    { label: "Videos", value: realStats.videos, icon: PlaySquare, color: "#818cf8" },
    { label: "Watch Time", value: "—", icon: Timer, color: "#4ade80" },
  ] : [
    { label: "Subscribers", value: "—", icon: Users, color: "#ff4444" },
    { label: "Total Views", value: "—", icon: Eye, color: "#60a5fa" },
    { label: "Videos", value: "—", icon: PlaySquare, color: "#818cf8" },
    { label: "Watch Time", value: "—", icon: Timer, color: "#4ade80" },
  ]

  const currentStats = view === "overall" ? overallStats : view === "youtube" ? ytStats_display : []
  const currentChartData = view === "youtube" ? ytChartData : overallChartData
  const chartLabel = view === "youtube" ? "Upload views" : "Posts completed"
  const chartType = view === "youtube" ? "bar" : "line"

  return (
    <div className="dash-root">
      <Sidebar />
      <div className="dash-content">
        <main className="dash-main">

          <div className="dash-header-row">
            <div>
              <p className="page-kicker">Dashboard</p>
              <h1 className="dash-greeting">{getGreeting()}, <span style={{ color: "#818cf8" }}>{firstName}</span> 👋</h1>
              <p className="dash-sub">Here's how your content is performing today.</p>
            </div>
            <div className="platform-switcher">
              {SWITCHER.map(({ id, label, color }) => (
                <button key={id} className="platform-btn" onClick={() => setView(id)}
                  style={{ background: view === id ? "var(--border2)" : "transparent", color: view === id ? color : "var(--dim)" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Instagram connect prompt */}
          {view === "instagram" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "10px", textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", margin: 0 }}>Coming Soon</p>
              <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Instagram analytics are on the way.</p>
            </div>
          ) : (
            <>
              <StatGrid stats={currentStats} trendLabel={view === "youtube" ? "all time" : "this month"} />

              <div className="dash-chart-row">
                <div className="card dash-chart-card">
                  <div className="chart-header">
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>{chartLabel}</p>
                      <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Last 7 days</p>
                    </div>
                    <span className="chart-badge" style={{ color: accent, borderColor: accent + "30", background: accent + "10" }}>
                      {SWITCHER.find(s => s.id === view).label}
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    {chartType === "bar" ? (
                      <BarChart data={currentChartData}>
                        <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                        <Bar dataKey="value" fill={accent} radius={[4, 4, 0, 0]} opacity={0.85} />
                      </BarChart>
                    ) : (
                      <LineChart data={currentChartData}>
                        <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                        <Line type="monotone" dataKey="value" stroke={accent} strokeWidth={2} dot={{ fill: accent, strokeWidth: 0, r: 3 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <StreakCard accent={accent} platform="both" ytVideos={ytVideos} />
              </div>

              {/* YouTube not connected prompt */}
              {view === "youtube" && !ytConnected && (
                <div className="card" style={{ padding: "24px", textAlign: "center", marginBottom: "20px" }}>
                  <Youtube size={24} color="#ff4444" style={{ marginBottom: "8px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>Connect YouTube to see real stats</p>
                  <a href={`${API_BASE}/api/v1/auth/google`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "8px", background: "#ff4444", color: "#fff", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                    Connect with Google
                  </a>
                </div>
              )}

              {/* Quick actions */}
              <div style={{ marginBottom: "20px" }}>
                <p className="dash-quick-label">Quick Actions</p>
                <div className="quick-actions-grid">
                  {[{ icon: Zap, title: "Content Generator", desc: "Generate hooks, scripts & CTAs.", href: "/generator" }, { icon: CalendarDays, title: "30-Day Planner", desc: "Organize your content pipeline.", href: "/planner" }].map(({ icon, title, desc, href }) => (
                    <div key={title} className="card dash-quick-card" onClick={() => window.location.href = href} style={{ cursor: "pointer" }}>
                      <div className="quick-action-icon" style={{ background: accent + "15" }}>
                        {createElement(icon, { size: 16, color: accent, strokeWidth: 2 })}
                      </div>
                      <p className="dash-quick-title">{title}</p>
                      <p className="dash-quick-desc">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent content */}
              <div className="card" style={{ overflow: "hidden" }}>
                <div className="dash-table-header">
                  <span className="dash-table-title">
                    {view === "youtube" ? "Recent Videos" : "Upcoming Posts"}
                  </span>
                </div>
                {view === "youtube" ? (
                  ytVideos.length === 0 ? (
                    <p style={{ padding: "16px 20px", fontSize: "13px", color: "var(--dim)", margin: 0 }}>
                      {ytConnected ? "No videos found." : "Connect YouTube to see your videos."}
                    </p>
                  ) : ytVideos.slice(0, 5).map(v => (
                    <div key={v.id} className="post-row">
                      <FileText size={13} color="var(--dim)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{v.title}</span>
                      <span style={{ fontSize: "11px", color: "var(--dim)" }}>{v.type || "Video"} · {fmt(v.views)} views</span>
                      <span className="post-badge done">published</span>
                    </div>
                  ))
                ) : (
                  plannerData.upcoming.length === 0 ? (
                    <p style={{ padding: "16px 20px", fontSize: "13px", color: "var(--dim)", margin: 0 }}>No upcoming posts. Create a plan first.</p>
                  ) : plannerData.upcoming.map((e, i) => (
                    <div key={i} className="post-row">
                      <FileText size={13} color="var(--dim)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{e.content}</span>
                      <span style={{ fontSize: "11px", color: "var(--dim)" }}>{e.dateLabel}</span>
                      <span className={`post-badge ${e.isCompleted ? "done" : "planned"}`}>{e.isCompleted ? "done" : "planned"}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
