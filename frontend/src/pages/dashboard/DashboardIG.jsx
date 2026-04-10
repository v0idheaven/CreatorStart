import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Eye, Heart, Image, Instagram } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import StreakCard from "../../components/StreakCard"
import StatGrid from "./StatGrid"
import QuickActions from "./QuickActions"
import "./Dashboard.css"

const IG = "#c13584"

// Instagram API requires Business account linked to Facebook page.
// Until connected, show a helpful prompt with planner-based stats.
export default function DashboardIG() {
  const platform = localStorage.getItem("platform") || "instagram"
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
    })
    return { total: active.length, done: done.length, upcoming: upcoming.length }
  })()

  const stats = [
    { label: "Planned posts", value: plannerData.total, icon: Image, color: IG },
    { label: "Completed", value: plannerData.done, icon: Heart, color: "#4ade80" },
    { label: "Upcoming", value: plannerData.upcoming, icon: Eye, color: "#60a5fa" },
    { label: "Followers", value: "—", icon: Users, color: "#f472b6" },
  ]

  // Chart from planner completions last 7 days
  const chartData = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const plan = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
    const entries = plan?.entries || []
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - (6 - i))
      const posted = entries.filter(e => {
        if (!e.date || !e.isCompleted) return false
        const ed = new Date(e.date); ed.setHours(0, 0, 0, 0)
        return ed.getTime() === d.getTime()
      }).length
      return { day: days[d.getDay() === 0 ? 6 : d.getDay() - 1], posts: posted }
    })
  })()

  return (
    <div className="dash-root">
      <Sidebar />
      <div className="dash-content">
        <main className="dash-main">
          <div className="dash-header">
            <div className="dash-kicker">
              <div className="dash-kicker-dot" style={{ background: IG }} />
              <p className="dash-kicker-label" style={{ color: IG }}>Instagram</p>
            </div>
            <h1 className="dash-title">Profile Overview</h1>
            <p className="dash-sub">Based on your content planner</p>
          </div>

          <StatGrid stats={stats} trendLabel="this month" />

          <div className="dash-chart-row">
            <div className="card dash-chart-card">
              <div className="chart-header">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Posts completed</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Last 7 days (from planner)</p>
                </div>
                <span className="chart-badge" style={{ color: IG, borderColor: "#c1358430", background: "#c1358415" }}>Instagram</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                  <Bar dataKey="posts" fill={IG} radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <StreakCard accent={IG} platform="instagram" />
          </div>

          {/* Instagram connect prompt */}
          <div className="card" style={{ padding: "24px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#c1358420", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Instagram size={20} color={IG} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Connect Instagram for real analytics</p>
              <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>Requires a Business/Creator account linked to a Facebook Page. Coming soon.</p>
            </div>
          </div>

          <QuickActions accent={IG} />
        </main>
      </div>
    </div>
  )
}
