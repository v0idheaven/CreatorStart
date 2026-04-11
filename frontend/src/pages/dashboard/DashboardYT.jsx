import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Eye, PlaySquare, Timer } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import StreakCard from "../../components/StreakCard"
import StatGrid from "./StatGrid"
import QuickActions from "./QuickActions"
import { fmt } from "./dashUtils"
import useDashboardData from "./useDashboardData"
import "./Dashboard.css"

const YT = "#ff4444"
const YTbg = "#ff444415"

export default function DashboardYT() {
  const { ytVideos, ytStats, ytConnected, loading, realStats } = useDashboardData()

  // Build last 7 days chart from real video publish dates
  // Shows number of videos uploaded per day (not views — views per publish date is misleading)
  const viewData = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    if (!ytConnected || ytVideos.length === 0) return days.map(day => ({ day, views: 0 }))
    const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    todayIST.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(todayIST); d.setDate(todayIST.getDate() - (6 - i))
      const count = ytVideos.filter(v => {
        if (!v.publishedAt) return false
        const vd = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        vd.setHours(0, 0, 0, 0)
        return vd.getTime() === d.getTime()
      }).length
      return { day: days[d.getDay() === 0 ? 6 : d.getDay() - 1], views: count }
    })
  })()

  const stats = ytConnected && realStats ? [
    { label: "Subscribers", value: fmt(realStats.subscribers), icon: Users, color: YT },
    { label: "Total Views", value: fmt(realStats.views), icon: Eye, color: "#60a5fa" },
    { label: "Videos", value: realStats.videos, icon: PlaySquare, color: "#818cf8" },
    { label: "Watch Time", value: "—", icon: Timer, color: "#4ade80" },
  ] : [
    { label: "Subscribers", value: "—", icon: Users, color: YT },
    { label: "Total Views", value: "—", icon: Eye, color: "#60a5fa" },
    { label: "Videos", value: "—", icon: PlaySquare, color: "#818cf8" },
    { label: "Watch Time", value: "—", icon: Timer, color: "#4ade80" },
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
            <p className="dash-sub">{ytStats?.title || "Your channel"}</p>
          </div>

          <StatGrid stats={stats} trendLabel="all time" />

          <div className="dash-chart-row">
            <div className="card dash-chart-card">
              <div className="chart-header">
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Upload activity</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Videos uploaded per day (last 7 days)</p>
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

          <QuickActions accent={YT} />

          <div className="card" style={{ overflow: "hidden" }}>
            <div className="dash-table-header">
              <span className="dash-table-title">Recent Videos</span>
              {loading && <span style={{ fontSize: "11px", color: "var(--dim)" }}>Loading...</span>}
            </div>
            {ytVideos.length === 0 && !loading ? (
              <p style={{ padding: "16px 20px", fontSize: "13px", color: "var(--dim)", margin: 0 }}>
                {ytConnected ? "No videos found. Refresh to load." : "Connect YouTube to see your videos."}
              </p>
            ) : (
              <>
                <div className="dash-table-cols">
                  {["Title", "Type", "Views", "Likes", "Comments", "Published"].map(h => (
                    <span key={h} className="dash-table-col-label">{h}</span>
                  ))}
                </div>
                {ytVideos.slice(0, 5).map(v => (
                  <div key={v.id} className="dash-table-row">
                    <div>
                      <p className="dash-row-title">{v.title}</p>
                      <span className="dash-row-meta">{v.publishedAt ? new Date(v.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</span>
                    </div>
                    <span className="dash-type-badge" style={{ background: YTbg, color: YT }}>{v.type || "Video"}</span>
                    <span className="dash-row-stat">{fmt(v.views)}</span>
                    <span className="dash-row-stat">{fmt(v.likes)}</span>
                    <span className="dash-row-stat">{fmt(v.comments)}</span>
                    <span className="dash-row-stat" style={{ fontSize: "11px", color: "var(--dim)" }}>
                      {v.publishedAt ? new Date(v.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
