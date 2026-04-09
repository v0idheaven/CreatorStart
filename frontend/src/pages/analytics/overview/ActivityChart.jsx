import { useState } from "react"

// Monthly posting activity line chart with hover tooltip inside SVG
export default function ActivityChart({ monthlyActivity, accent, todayPosted, useRealData }) {
  const [hoveredDay, setHoveredDay] = useState(null)

  const W = 800, H = 120, PAD = 16
  const maxVal = Math.max(...monthlyActivity.map(p => p.v), 1)
  const xStep = (W - PAD * 2) / (monthlyActivity.length - 1 || 1)
  const coords = monthlyActivity.map((p, i) => ({
    x: PAD + i * xStep,
    y: PAD + (1 - p.v / maxVal) * (H - PAD * 2),
    ...p
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ")
  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x} ${H} L ${PAD} ${H} Z`
  const todayEntry = monthlyActivity.find(d => d.isToday)
  const posted = useRealData ? todayPosted : todayEntry?.v > 0

  return (
    <div className="chart-card">
      <div className="activity-graph-header">
        <div>
          <p className="activity-graph-month">
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
          <p className="activity-graph-status">
            {posted
              ? <><span className="activity-status--posted">Posted</span> <span className="activity-status-sub">today</span></>
              : <><span className="activity-status--not">Not posted</span> <span className="activity-status-sub">today</span></>
            }
          </p>
        </div>
      </div>

      <div className="activity-graph-body">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="activity-svg"
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const svgX = ((e.clientX - rect.left) / rect.width) * W
            setHoveredDay(coords.reduce((a, b) => Math.abs(b.x - svgX) < Math.abs(a.x - svgX) ? b : a).day)
          }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {[0.25, 0.5, 0.75, 1].map(f => (
            <line key={f} x1={PAD} x2={W - PAD} y1={PAD + (1 - f) * (H - PAD * 2)} y2={PAD + (1 - f) * (H - PAD * 2)} stroke="var(--border)" strokeWidth="0.5" />
          ))}
          <path d={areaPath} fill={accent} opacity="0.08" />
          <path d={linePath} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {coords.filter(c => c.v > 0).map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="3.5" fill={accent} />)}

          {hoveredDay !== null && (() => {
            const c = coords.find(c => c.day === hoveredDay)
            if (!c) return null
            const date = new Date(new Date().getFullYear(), new Date().getMonth(), c.day)
            const dateStr = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
            const label = c.v > 0 ? "Posted" : "No post"
            const tooltipX = Math.min(c.x + 8, W - 110)
            const tooltipY = Math.max(c.y - 38, PAD)
            return (
              <g>
                <line x1={c.x} x2={c.x} y1={PAD} y2={H} stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <circle cx={c.x} cy={c.y} r="5" fill={accent} />
                <circle cx={c.x} cy={c.y} r="3" fill="var(--card)" />
                {/* Tooltip inside SVG */}
                <rect x={tooltipX} y={tooltipY} width="104" height="32" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                <text x={tooltipX + 8} y={tooltipY + 13} fontSize="11" fontWeight="700" fill={c.v > 0 ? accent : "var(--dim)"}>{label}</text>
                <text x={tooltipX + 8} y={tooltipY + 25} fontSize="10" fill="var(--dim)">{dateStr}</text>
              </g>
            )
          })()}
        </svg>

        <div className="activity-x-axis">
          {coords.filter((_, i) => i % 5 === 0 || i === coords.length - 1).map(c => (
            <span key={c.day} className="activity-x-label" style={{ left: `${(c.x / W) * 100}%`, color: c.isToday ? accent : "var(--dim)", fontWeight: c.isToday ? "700" : "400" }}>
              {c.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
