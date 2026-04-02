import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Youtube, Instagram, Zap, CalendarDays, FileText, TrendingUp, Clock, CheckCheck, AlignLeft } from "lucide-react"
import Sidebar from "../components/Sidebar"

const graphData = [
  { day: "Mon", posts: 2 },
  { day: "Tue", posts: 1 },
  { day: "Wed", posts: 4 },
  { day: "Thu", posts: 3 },
  { day: "Fri", posts: 2 },
  { day: "Sat", posts: 5 },
  { day: "Sun", posts: 3 },
]

const plannerFilled = [1, 3, 5, 7, 9, 12, 15, 18, 20, 22, 25, 28]

const recentPosts = [
  { id: 1, title: "How to grow on YouTube in 2025", day: 1, status: "done" },
  { id: 2, title: "Morning routine vlog ideas", day: 3, status: "planned" },
  { id: 3, title: "Top 10 finance tips for beginners", day: 5, status: "draft" },
  { id: 4, title: "AI tools for content creators", day: 7, status: "planned" },
  { id: 5, title: "Behind the scenes reel", day: 9, status: "done" },
]

export default function Dashboard() {
  const [activePlat, setActivePlat] = useState("overall")
  const [hoveredAction, setHoveredAction] = useState(null)
  const navigate = useNavigate()

  function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  }

  const stats = [
    { label: "Total Posts", value: 24, icon: AlignLeft, color: "#818cf8" },
    { label: "Planned", value: 8, icon: Clock, color: "#60a5fa" },
    { label: "Completed", value: 12, icon: CheckCheck, color: "#4ade80" },
    { label: "Drafts", value: 4, icon: FileText, color: "#f472b6" },
  ]

  const quickActions = [
    { icon: Zap, title: "Content Generator", desc: "Generate hooks, scripts & CTAs for your next video.", href: "/generator" },
    { icon: CalendarDays, title: "30-Day Planner", desc: "Organize your content pipeline for the month.", href: "/planner" },
    { icon: FileText, title: "Posts", desc: "View and manage all your content drafts.", href: "/posts" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />

      <main style={{ marginLeft: "72px", flex: 1, padding: "40px", maxWidth: "1100px" }}>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Dashboard</p>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
              {getGreeting()}, <span style={{ color: "#818cf8" }}>Varun</span> 👋
            </h1>
            <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Here's how your content is performing today.</p>
          </div>

          <div className="platform-switcher">
            {[
              { id: "overall", label: "Overall", Icon: null, color: "#818cf8" },
              { id: "youtube", label: "YouTube", Icon: Youtube, color: "#ff4444" },
              { id: "instagram", label: "Instagram", Icon: Instagram, color: "#c13584" },
            ].map(({ id, label, Icon, color }) => (
              <button
                key={id}
                className="platform-btn"
                onClick={() => setActivePlat(id)}
                style={{
                  background: activePlat === id ? "var(--border2)" : "transparent",
                  color: activePlat === id ? color : "var(--dim)",
                }}
              >
                {Icon && <Icon size={12} color={activePlat === id ? color : "var(--dim)"} />}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="stat-grid">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card" style={{ padding: "20px 20px 16px" }}>
              <div className="stat-card-top">
                <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>{label}</span>
                <div className="stat-icon" style={{ background: color + "20" }}>
                  <Icon size={14} color={color} strokeWidth={2} />
                </div>
              </div>
              <p style={{ fontSize: "30px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={11} color="#4ade80" />
                <span style={{ fontSize: "11px", color: "#4ade80" }}>this month</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <div className="chart-header">
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Content Activity</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Posts over this week</p>
              </div>
              <span className="chart-badge">This week</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={graphData}>
                <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="posts" stroke="#818cf8" strokeWidth={2} dot={{ fill: "#818cf8", strokeWidth: 0, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>30-Day Planner</p>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: "0 0 16px" }}>{plannerFilled.length} / 30 days planned</p>
            <div className="planner-mini-grid">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1
                const has = plannerFilled.includes(day)
                return (
                  <div
                    key={day}
                    className="planner-day"
                    onClick={() => navigate("/planner")}
                    style={{
                      background: has ? "#818cf8" : "var(--border)",
                      opacity: has ? 1 : 0.35,
                      color: has ? "#fff" : "var(--dim)",
                    }}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
            <button className="planner-open-btn" onClick={() => navigate("/planner")}>
              Open Planner →
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 12px" }}>Quick Actions</p>
          <div className="quick-actions-grid">
            {quickActions.map(({ icon: Icon, title, desc, href }) => (
              <div
                key={title}
                className="card"
                onClick={() => navigate(href)}
                onMouseEnter={() => setHoveredAction(title)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{ padding: "20px", cursor: "pointer", borderColor: hoveredAction === title ? "#818cf8" : "var(--border)", transition: "border-color 0.15s" }}
              >
                <div className="quick-action-icon">
                  <Icon size={16} color="#818cf8" strokeWidth={2} />
                </div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 5px" }}>{title}</p>
                <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0, lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>Recent Posts</span>
            <span onClick={() => navigate("/posts")} style={{ fontSize: "12px", color: "#818cf8", cursor: "pointer" }}>View all →</span>
          </div>
          {recentPosts.map(post => (
            <div key={post.id} className="post-row">
              <FileText size={13} color="var(--dim)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{post.title}</span>
              <span style={{ fontSize: "11px", color: "var(--dim)" }}>Day {post.day}</span>
              <span className={`post-badge ${post.status}`}>{post.status}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
