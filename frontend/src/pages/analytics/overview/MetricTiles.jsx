// Overall creator stats — planner + YouTube combined
export default function MetricTiles({ ov, ytVideos, accent }) {
  const platform = localStorage.getItem("platform") || "both"
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const ytConnected = !!user.youtubeStats

  // Planner stats
  const plannerDone = ov.done || 0
  const plannerActive = ov.active || 0
  const completionRate = plannerActive > 0 ? Math.round((plannerDone / plannerActive) * 100) : 0

  // YouTube stats
  const totalYTViews = ytVideos.reduce((s, v) => s + Number(v.views || 0), 0)
  const totalYTVideos = ytConnected ? Number(user.youtubeStats?.videos || 0) : ytVideos.length
  const subscribers = ytConnected ? Number(user.youtubeStats?.subscribers || 0) : 0

  // Streak from cached videos
  const streak = (() => {
    try {
      const cached = JSON.parse(localStorage.getItem("yt_videos_cache") || "[]")
      if (!ytConnected || cached.length === 0) return 0
      const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      todayIST.setHours(0, 0, 0, 0)
      const dates = new Set(cached.filter(v => v.publishedAt).map(v => {
        const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        d.setHours(0, 0, 0, 0); return d.getTime()
      }))
      let count = 0, check = new Date(todayIST)
      while (dates.has(check.getTime())) { count++; check.setDate(check.getDate() - 1) }
      return count
    } catch { return 0 }
  })()

  const items = [
    {
      n: plannerDone,
      label: "posts completed",
      sub: plannerActive > 0 ? `${completionRate}% of ${plannerActive} planned` : "from your planner",
      color: "#4ade80"
    },
    {
      n: streak > 0 ? `${streak}d` : "0d",
      label: "current streak",
      sub: streak > 0 ? "consecutive days posted" : "post today to start",
      color: streak > 0 ? "#f59e0b" : "var(--dim)"
    },
    {
      n: ytConnected ? totalYTVideos : plannerActive,
      label: ytConnected ? "total videos" : "total planned",
      sub: ytConnected ? "on YouTube" : "in your planner",
      color: accent
    },
    {
      n: ytConnected ? (subscribers > 0 ? subscribers.toLocaleString() : "—") : `${completionRate}%`,
      label: ytConnected ? "subscribers" : "completion rate",
      sub: ytConnected ? "YouTube subscribers" : "past days",
      color: ytConnected ? "#818cf8" : accent
    },
  ]

  return (
    <div className="metrics-row">
      {items.map(s => (
        <div key={s.label} className="metric-item">
          <p className="metric-value" style={{ color: s.color }}>{s.n}</p>
          <p className="metric-label">{s.label}</p>
          <p className="metric-sub">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
