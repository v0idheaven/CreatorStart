import { createElement, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, CalendarDays, FileText, AlignLeft, Clock, CheckCheck, Users, Eye, PlaySquare, Timer, Youtube } from "lucide-react"
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

// Format date to YYYY-MM-DD in IST
function toISTDateStr(date) {
  const ist = new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  return `${ist.getFullYear()}-${String(ist.getMonth()+1).padStart(2,"0")}-${String(ist.getDate()).padStart(2,"0")}`
}

// Build chart data between two IST dates from ytVideos
function buildChartData(fromDate, toDate, ytVideos, ytConnected, platform) {
  const from = new Date(fromDate + "T00:00:00")
  const to = new Date(toDate + "T00:00:00")
  const days = Math.round((to - from) / 86400000) + 1
  const result = []
  for (let i = 0; i < days; i++) {
    const d = new Date(from); d.setDate(from.getDate() + i)
    const dStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    let value = 0
    if (ytConnected && ytVideos.length > 0) {
      value = ytVideos.filter(v => {
        if (!v.publishedAt) return false
        return toISTDateStr(v.publishedAt) === dStr
      }).length
    } else {
      try {
        const plan = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
        const entries = plan?.entries || []
        value = entries.filter(e => e.date && e.isCompleted && e.date.slice(0,10) === dStr).length
      } catch { value = 0 }
    }
    result.push({ day: label, value })
  }
  return result
}

export default function DashboardBoth() {
  const [view, setView] = useState("overall")
  const [dateRange, setDateRange] = useState("7")   // "7" | "30" | "90" | "custom"
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  const { ytVideos, ytConnected, realStats, storedUser, streak } = useDashboardData()
  const navigate = useNavigate()
  const firstName = storedUser.fullName?.split(" ")[0] || "Creator"
  const platform = localStorage.getItem("platform") || "both"
  const accent = SWITCHER.find(s => s.id === view).color

  // Compute from/to dates
  const { fromDate, toDate } = useMemo(() => {
    const todayIST = toISTDateStr(new Date())
    if (dateRange === "custom" && customFrom && customTo) {
      return { fromDate: customFrom, toDate: customTo }
    }
    const days = Number(dateRange) || 7
    const from = new Date()
    from.setDate(from.getDate() - (days - 1))
    return { fromDate: toISTDateStr(from), toDate: todayIST }
  }, [dateRange, customFrom, customTo])

  // Chart data
  const overallChartData = useMemo(() =>
    buildChartData(fromDate, toDate, ytVideos, ytConnected, platform),
    [fromDate, toDate, ytVideos, ytConnected, platform]
  )

  const ytChartData = useMemo(() =>
    buildChartData(fromDate, toDate, ytVideos, true, platform),
    [fromDate, toDate, ytVideos, platform]
  )

  // Planner data
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
      ? { label: "Views", value: fmt(realStats?.views || 0), icon: Eye, color: "#60a5fa" }
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
  const chartLabel = view === "youtube" ? "Upload activity" : ytConnected ? "Videos uploaded" : "Posts completed"
  const chartType = view === "youtube" ? "bar" : "line"

  // Date range label
  const rangeLabel = dateRange === "custom" && customFrom && customTo
    ? `${new Date(customFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(customTo).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
    : `Last ${dateRange} days`

  return (
    <div className="dash-root">
      <Sidebar />
      <div className="dash-content">
        <main className="dash-main">

          <div className="dash-header-row">
            <div>
              <p className="page-kicker">Dashboard</p>
              <h1 className="dash-greeting">{getGreeting()}, <span style={{ color: "#818cf8" }}>{firstName}</span></h1>
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
                      <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{rangeLabel}</p>
                    </div>
                    {/* Date range selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {["7", "30", "90"].map(d => (
                        <button key={d} onClick={() => { setDateRange(d); setShowCustom(false) }}
                          style={{ padding: "3px 9px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: dateRange === d ? "600" : "400", background: dateRange === d ? accent + "20" : "transparent", color: dateRange === d ? accent : "var(--dim)", transition: "all 0.15s" }}>
                          {d}d
                        </button>
                      ))}
                      <button onClick={() => { setDateRange("custom"); setShowCustom(p => !p) }}
                        style={{ padding: "3px 9px", borderRadius: "6px", border: `1px solid ${dateRange === "custom" ? accent : "var(--border)"}`, cursor: "pointer", fontSize: "11px", fontWeight: dateRange === "custom" ? "600" : "400", background: dateRange === "custom" ? accent + "20" : "transparent", color: dateRange === "custom" ? accent : "var(--dim)", transition: "all 0.15s" }}>
                        Custom
                      </button>
                    </div>
                  </div>

                  {/* Custom date inputs */}
                  {showCustom && (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "var(--dim)" }}>From</span>
                        <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                          style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid var(--border2)", background: "var(--bg)", color: "var(--text)", fontSize: "12px", outline: "none", colorScheme: "dark" }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "var(--dim)" }}>To</span>
                        <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                          style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid var(--border2)", background: "var(--bg)", color: "var(--text)", fontSize: "12px", outline: "none", colorScheme: "dark" }} />
                      </div>
                    </div>
                  )}

                  <ResponsiveContainer width="100%" height={180}>
                    {chartType === "bar" ? (
                      <BarChart data={currentChartData}>
                        <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                        <Bar dataKey="value" fill={accent} radius={[4, 4, 0, 0]} opacity={0.85} />
                      </BarChart>
                    ) : (
                      <LineChart data={currentChartData}>
                        <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                        <Line type="monotone" dataKey="value" stroke={accent} strokeWidth={2} dot={{ fill: accent, strokeWidth: 0, r: 3 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <StreakCard accent={accent} platform="both" ytVideos={ytVideos} />
              </div>

              {view === "youtube" && !ytConnected && (
                <div className="card" style={{ padding: "24px", textAlign: "center", marginBottom: "20px" }}>
                  <Youtube size={24} color="#ff4444" style={{ marginBottom: "8px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>Connect YouTube to see real stats</p>
                  <a href={`${API_BASE}/api/v1/auth/google`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "8px", background: "#ff4444", color: "#fff", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                    Connect with Google
                  </a>
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <p className="dash-quick-label">Quick Actions</p>
                <div className="quick-actions-grid">
                  {[{ icon: Zap, title: "Content Generator", desc: "Generate hooks, scripts & CTAs.", href: "/generator" }, { icon: CalendarDays, title: "30-Day Planner", desc: "Organize your content pipeline.", href: "/planner" }].map(({ icon, title, desc, href }) => (
                    <div key={title} className="card dash-quick-card" onClick={() => navigate(href)} style={{ cursor: "pointer" }}>
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
                  <span className="dash-table-title">{view === "youtube" ? "Recent Videos" : "Upcoming Posts"}</span>
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
