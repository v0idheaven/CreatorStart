// Top 3 stat cards: total videos, streak, audience
export default function StatCards({ statItems, accent }) {
  return (
    <div className="settings-stats-grid">
      {statItems.map(s => (
        <div key={s.label} className="card settings-stat-card">
          <p className="settings-stat-value" style={{ color: accent }}>{s.value}</p>
          <p className="settings-stat-label">{s.label}</p>
          <p className="settings-stat-sub">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
