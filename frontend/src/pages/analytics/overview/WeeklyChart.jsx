// Weekly posting bar chart + upcoming 7 days — side by side
export default function WeeklyChart({ weeks, upcoming, accent, consistency }) {
  const maxTotal = Math.max(...weeks.map(x => x.total), 1)
  const chartH = 80

  return (
    <div className="two-col">
      <div className="chart-card">
        <div className="weekly-chart-header">
          <p className="weekly-chart-title">Weekly posting</p>
          <span className="weekly-chart-consistency">{consistency}% consistent</span>
        </div>
        <div className="weekly-bars" style={{ height: `${chartH}px` }}>
          {weeks.map((w, wi) => {
            const bgH = w.total ? Math.round((w.total / maxTotal) * chartH) : 3
            const doneH = w.total ? Math.round((w.done / w.total) * bgH) : 0
            const today = new Date()
            const weeksAgo = weeks.length - 1 - wi
            const endDate = new Date(today); endDate.setDate(today.getDate() - weeksAgo * 7)
            const startDate = new Date(endDate); startDate.setDate(endDate.getDate() - 6)
            const dateRange = `${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
            return (
              <div key={w.label} className="weekly-bar-col" style={{ height: `${chartH}px` }}
                onMouseEnter={e => { const t = e.currentTarget.querySelector(".bar-tip"); if (t) t.style.opacity = "1" }}
                onMouseLeave={e => { const t = e.currentTarget.querySelector(".bar-tip"); if (t) t.style.opacity = "0" }}>
                <div className="bar-tip" style={{ bottom: `${bgH + 10}px` }}>
                  <p className="bar-tip-value">{w.done}/{w.total} posts</p>
                  <p className="bar-tip-range">{dateRange}</p>
                </div>
                <div className="weekly-bar-bg" style={{ height: `${bgH}px` }}>
                  {doneH > 0 && <div className="weekly-bar-fill" style={{ height: `${(doneH / bgH) * 100}%`, background: doneH === bgH ? "#4ade80" : accent }} />}
                </div>
              </div>
            )
          })}
        </div>
        <div className="weekly-labels">
          {weeks.map(w => {
            const isThis = w.label === "This week"
            return (
              <div key={w.label} className="weekly-label-item">
                <span className="weekly-label-text" style={{ color: isThis ? accent : "var(--dim)", fontWeight: isThis ? "600" : "400" }}>
                  {w.label === "This week" ? "This" : w.label === "Last week" ? "Last" : w.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="chart-card">
        <p className="upcoming-title">Next 7 days</p>
        {upcoming.length === 0 ? (
          <p className="upcoming-empty">Nothing scheduled.</p>
        ) : (
          <div className="upcoming-list">
            {upcoming.map((e, i) => (
              <div key={i} className="upcoming-item">
                <span className="upcoming-date" style={{ color: accent }}>{e.dateLabel?.split(" ")[0]}</span>
                <p className="upcoming-content">{e.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
