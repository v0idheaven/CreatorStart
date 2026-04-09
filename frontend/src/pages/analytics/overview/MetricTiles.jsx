// 4 top stat cards — videos, views, posted today, etc.
export default function MetricTiles({ ov, ytVideos, accent }) {
  const thisMonthVideos = ytVideos.filter(v => {
    if (!v.publishedAt) return false
    const d = new Date(v.publishedAt)
    return d.getFullYear() === new Date().getFullYear() && d.getMonth() === new Date().getMonth()
  })

  const items = ov.useRealData ? [
    { n: thisMonthVideos.length, label: "videos this month", sub: "published on YouTube" },
    { n: ytVideos.length, label: "total videos", sub: "on your channel" },
    { n: ov.todayPosted ? "Yes" : "No", label: "posted today", sub: "on YouTube", green: ov.todayPosted },
    { n: ytVideos.reduce((s, v) => s + Number(v.views || 0), 0).toLocaleString(), label: "total views", sub: "across all videos" },
  ] : [
    { n: ov.done, label: "posts done", sub: `of ${ov.active} planned` },
    { n: `${ov.rate}%`, label: "completion rate", sub: "past days" },
    { n: ov.missed, label: "missed", sub: "past days", red: ov.missed > 0 },
    { n: ov.total, label: "all-time posts", sub: "across plans" },
  ]

  return (
    <div className="metrics-row">
      {items.map(s => (
        <div key={s.label} className="metric-item">
          <p className="metric-value" style={{ color: s.green ? "#4ade80" : s.red ? "#f87171" : "var(--text)" }}>{s.n}</p>
          <p className="metric-label">{s.label}</p>
          <p className="metric-sub">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
