import { createElement } from "react"
import { TrendingUp } from "lucide-react"

// 4-column stat cards row used across all dashboard variants
export default function StatGrid({ stats, trendLabel = "this month" }) {
  return (
    <div className="stat-grid" style={{ marginBottom: "20px" }}>
      {stats.map(({ label, value, icon, color }) => (
        <div key={label} className="card" style={{ padding: "20px 20px 16px" }}>
          <div className="stat-card-top">
            <span className="dash-stat-label">{label}</span>
            <div className="stat-icon" style={{ background: color + "20" }}>
              {createElement(icon, { size: 14, color, strokeWidth: 2 })}
            </div>
          </div>
          <p className="dash-stat-value">{value}</p>
          <div className="dash-stat-trend">
            <TrendingUp size={11} color="#4ade80" />
            <span className="dash-stat-trend-text">{trendLabel}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
