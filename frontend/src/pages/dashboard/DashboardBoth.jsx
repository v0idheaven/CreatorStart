import { createElement, useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, CalendarDays, FileText, AlignLeft, Clock, CheckCheck, Users, Eye, PlaySquare, Timer, Heart, Image } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import StreakCard from "../../components/StreakCard"
import StatGrid from "./StatGrid"
import { fmt, getGreeting } from "./dashUtils"
import useDashboardData from "./useDashboardData"
import "./Dashboard.css"

const SWITCHER = [
  { id: "overall", label: "Overall", color: "#818cf8" },
  { id: "youtube", label: "YouTube", color: "#ff4444" },
  { id: "instagram", label: "Instagram", color: "#c13584" },
]

const DATA = {
  overall: {
    stats: [
      { label: "Total Posts", value: 24, icon: AlignLeft, color: "#818cf8" },
      { label: "Planned", value: 8, icon: Clock, color: "#60a5fa" },
      { label: "Completed", value: 12, icon: CheckCheck, color: "#4ade80" },
      { label: "Drafts", value: 4, icon: FileText, color: "#f472b6" },
    ],
    chartData: [{ day: "Mon", value: 2 }, { day: "Tue", value: 1 }, { day: "Wed", value: 4 }, { day: "Thu", value: 3 }, { day: "Fri", value: 2 }, { day: "Sat", value: 5 }, { day: "Sun", value: 3 }],
    chartLabel: "Content Activity", chartSub: "Posts this week", chartKey: "value", chartType: "line",
    recentLabel: "Recent Posts",
    recent: [
      { id: 1, title: "How to grow on YouTube in 2025", meta: "Day 1", status: "done" },
      { id: 2, title: "Morning routine vlog ideas", meta: "Day 3", status: "planned" },
      { id: 3, title: "Top 10 finance tips", meta: "Day 5", status: "draft" },
      { id: 4, title: "AI tools for content creators", meta: "Day 7", status: "planned" },
      { id: 5, title: "Behind the scenes reel", meta: "Day 9", status: "done" },
    ],
  },
  youtube: {
    stats: [
      { label: "Subscribers", value: "2.4K", icon: Users, color: "#ff4444" },
      { label: "Total Views", value: "48.2K", icon: Eye, color: "#60a5fa" },
      { label: "Videos", value: 18, icon: PlaySquare, color: "#818cf8" },
      { label: "Watch Time", value: "1.2K hrs", icon: Timer, color: "#4ade80" },
    ],
    chartData: [{ day: "Mon", value: 1200 }, { day: "Tue", value: 980 }, { day: "Wed", value: 2100 }, { day: "Thu", value: 1800 }, { day: "Fri", value: 2400 }, { day: "Sat", value: 3100 }, { day: "Sun", value: 2700 }],
    chartLabel: "Views this week", chartSub: "Daily view count", chartKey: "value", chartType: "bar",
    recentLabel: "Recent Videos",
    recent: [
      { id: 1, title: "How to grow on YouTube in 2025", meta: "14:32 · Video", status: "done" },
      { id: 2, title: "Morning routine vlog", meta: "0:58 · Short", status: "done" },
      { id: 3, title: "My editing workflow 2025", meta: "22:10 · Video", status: "draft" },
      { id: 4, title: "5 mistakes new creators make", meta: "0:55 · Short", status: "planned" },
    ],
  },
  instagram: {
    stats: [
      { label: "Followers", value: "5.8K", icon: Users, color: "#c13584" },
      { label: "Total Reach", value: "124K", icon: Eye, color: "#60a5fa" },
      { label: "Posts", value: 34, icon: Image, color: "#818cf8" },
      { label: "Avg. Likes", value: "1.2K", icon: Heart, color: "#f472b6" },
    ],
    chartData: [{ day: "Mon", value: 3200 }, { day: "Tue", value: 2800 }, { day: "Wed", value: 5100 }, { day: "Thu", value: 4400 }, { day: "Fri", value: 6200 }, { day: "Sat", value: 8900 }, { day: "Sun", value: 7100 }],
    chartLabel: "Reach this week", chartSub: "Daily accounts reached", chartKey: "value", chartType: "bar",
    recentLabel: "Recent Posts",
    recent: [
      { id: 1, title: "Behind the scenes reel", meta: "Reel", status: "done" },
      { id: 2, title: "Top 10 finance tips", meta: "Carousel", status: "done" },
      { id: 3, title: "AI tools for creators", meta: "Reel", status: "planned" },
      { id: 4, title: "Morning routine aesthetic", meta: "Post", status: "draft" },
    ],
  },
}

export default function DashboardBoth() {
  const [view, setView] = useState("overall")
  const { ytVideos, ytStats, ytConnected, realStats, storedUser } = useDashboardData()

  const firstName = storedUser.fullName?.split(" ")[0] || "Creator"

  // Build real YouTube stats for the youtube tab
  const ytTabStats = ytConnected && realStats ? [
    { label: "Subscribers", value: fmt(realStats.subscribers), icon: Users, color: "#ff4444" },
    { label: "Total Views", value: fmt(realStats.views), icon: Eye, color: "#60a5fa" },
    { label: "Videos", value: realStats.videos, icon: PlaySquare, color: "#818cf8" },
    { label: "Watch Time", value: "—", icon: Timer, color: "#4ade80" },
  ] : DATA.youtube.stats

  const DATA_WITH_REAL = {
    ...DATA,
    youtube: { ...DATA.youtube, stats: ytTabStats },
  }
  const d = DATA_WITH_REAL[view]
  const accent = SWITCHER.find(s => s.id === view).color

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

          <StatGrid stats={d.stats} trendLabel="this month" />

          <div className="dash-chart-row">
            <div className="card dash-chart-card">
              <div className="chart-header">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>{d.chartLabel}</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{d.chartSub}</p>
                </div>
                <span className="chart-badge" style={{ color: accent, borderColor: accent + "30", background: accent + "10" }}>
                  {SWITCHER.find(s => s.id === view).label}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                {d.chartType === "bar" ? (
                  <BarChart data={d.chartData}>
                    <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                    <Bar dataKey={d.chartKey} fill={accent} radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                ) : (
                  <LineChart data={d.chartData}>
                    <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                    <Line type="monotone" dataKey={d.chartKey} stroke={accent} strokeWidth={2} dot={{ fill: accent, strokeWidth: 0, r: 3 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            <StreakCard accent={accent} platform="both" ytVideos={ytVideos} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p className="dash-quick-label">Quick Actions</p>
            <div className="quick-actions-grid">
              {[{ icon: Zap, title: "Content Generator", desc: "Generate hooks, scripts & CTAs.", href: "/generator" }, { icon: CalendarDays, title: "30-Day Planner", desc: "Organize your content pipeline.", href: "/planner" }].map(({ icon, title, desc, href }) => (
                <div key={title} className="card dash-quick-card" onClick={() => window.location.href = href}
                  style={{ cursor: "pointer" }}>
                  <div className="quick-action-icon" style={{ background: accent + "15" }}>
                    {createElement(icon, { size: 16, color: accent, strokeWidth: 2 })}
                  </div>
                  <p className="dash-quick-title">{title}</p>
                  <p className="dash-quick-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div className="dash-table-header">
              <span className="dash-table-title">{d.recentLabel}</span>
            </div>
            {d.recent.map(post => (
              <div key={post.id} className="post-row">
                <FileText size={13} color="var(--dim)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{post.title}</span>
                <span style={{ fontSize: "11px", color: "var(--dim)" }}>{post.meta}</span>
                <span className={`post-badge ${post.status}`}>{post.status}</span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
