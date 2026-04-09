import { useState } from "react"
import { Youtube, RefreshCw } from "lucide-react"

// YouTube Studio tab — channel header + metrics + 28-day graph
export default function YTStudioView({ ytStats, ytAnalytics, refreshingYT, ytError, onRefresh, fmt }) {
  const [ytTab, setYtTab] = useState("overview")
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const daily = ytAnalytics?.daily || []
  const ov = ytAnalytics?.overview || {}
  const W = 800, H = 140, PADX = 40, PADY = 16
  const graphMetric = ytTab === "audience" ? "estimatedMinutesWatched" : "views"
  const maxV = Math.max(...daily.map(d => Number(d[graphMetric] || d.views || 0)), 1)
  const coords = daily.map((p, i) => {
    const v = Number(p[graphMetric] || p.views || 0)
    return { x: PADX + i * ((W - PADX * 2) / (daily.length - 1 || 1)), y: PADY + (1 - v / maxV) * (H - PADY * 2), v, day: p.day }
  })
  const linePath = coords.length > 1 ? coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ") : ""
  const areaPath = linePath ? `${linePath} L ${coords[coords.length-1]?.x} ${H} L ${PADX} ${H} Z` : ""
  const yLabels = [maxV, Math.round(maxV * 0.5), 0]

  const metricTiles = ytTab === "overview" ? [
    { label: "Views", value: fmt(ov.views || 0) },
    { label: "Watch time (hrs)", value: fmt(Math.round((ov.estimatedMinutesWatched || 0) / 60)) },
    { label: "Subscribers", value: fmt(ytStats.subscribers) },
  ] : ytTab === "content" ? [
    { label: "Impressions", value: fmt(ov.impressions || 0) },
    { label: "CTR", value: `${((ov.impressionClickThroughRate || 0) * 100).toFixed(1)}%` },
    { label: "Avg view duration", value: (() => { const s = ov.averageViewDuration || 0; return `${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}` })() },
  ] : [
    { label: "Unique viewers", value: fmt(ov.views || 0), color: "var(--text)" },
    { label: "Subs gained", value: fmt(ov.subscribersGained || 0), color: "#4ade80" },
    { label: "Subs lost", value: fmt(ov.subscribersLost || 0), color: "#f87171" },
  ]

  return (
    <div>
      <div className="yt-channel-header">
        {ytStats.thumbnail
          ? <img src={ytStats.thumbnail} alt="" className="yt-channel-thumb" />
          : <div className="yt-channel-thumb-placeholder"><Youtube size={20} color="#ff4444" /></div>
        }
        <div className="yt-channel-info">
          <p className="yt-channel-name">{ytStats.title}</p>
          <p className="yt-channel-meta">{fmt(ytStats.subscribers)} subscribers · {fmt(ytStats.videos)} videos</p>
        </div>
        <button onClick={onRefresh} disabled={refreshingYT} className="yt-refresh-btn">
          <RefreshCw size={11} className={refreshingYT ? "spin" : ""} /> Refresh
        </button>
      </div>

      {ytError && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: "#f8717115", border: "1px solid #f8717130", marginBottom: "16px" }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: "13px", color: "#f87171", margin: 0, lineHeight: "1.5" }}>{ytError}</p>
        </div>
      )}

      <div className="chart-card yt-analytics-card">
        <div className="yt-tab-row">
          {["overview", "audience"].map(t => (
            <button key={t} onClick={() => setYtTab(t)} className={`yt-tab${ytTab === t ? " yt-tab--active" : ""}`}>{t}</button>
          ))}
          <div className="yt-tab-period"><span className="yt-tab-period-label">Last 28 days</span></div>
        </div>

        <div className="yt-metrics-grid">
          {metricTiles.map((m, i) => (
            <div key={m.label} className={`yt-metric-cell${i < 2 ? " yt-metric-cell--border" : ""}`}>
              <p className="yt-metric-label">{m.label}</p>
              <p className="yt-metric-value" style={{ color: m.color || "var(--text)" }}>{m.value}</p>
            </div>
          ))}
        </div>

        <div className="yt-graph-wrap">
          {daily.length === 0 ? (
            <div className="yt-graph-empty"><p className="yt-graph-empty-text">No data for this period</p></div>
          ) : (
            <div className="yt-graph-inner">
              <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="yt-svg"
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const svgX = ((e.clientX - rect.left) / rect.width) * W
                  const closest = coords.reduce((a, b) => Math.abs(b.x - svgX) < Math.abs(a.x - svgX) ? b : a, coords[0])
                  setHoveredIdx(coords.indexOf(closest))
                }}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {yLabels.map((v, i) => {
                  const y = PADY + (1 - v / maxV) * (H - PADY * 2)
                  return (
                    <g key={i}>
                      <line x1={PADX} x2={W - 8} y1={y} y2={y} stroke="var(--border)" strokeWidth="0.5" />
                      <text x={PADX - 4} y={y + 4} textAnchor="end" fontSize="10" fill="var(--dim)">{fmt(v)}</text>
                    </g>
                  )
                })}
                <path d={areaPath} fill="#ff4444" opacity="0.06" />
                <path d={linePath} stroke="#ff4444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {hoveredIdx !== null && coords[hoveredIdx] && (
                  <g>
                    <line x1={coords[hoveredIdx].x} x2={coords[hoveredIdx].x} y1={PADY} y2={H} stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    <circle cx={coords[hoveredIdx].x} cy={coords[hoveredIdx].y} r="5" fill="#ff4444" />
                    <circle cx={coords[hoveredIdx].x} cy={coords[hoveredIdx].y} r="3" fill="var(--card)" />
                    {/* Tooltip inside SVG — no layout shift */}
                    <rect
                      x={Math.min(coords[hoveredIdx].x + 8, W - 120)}
                      y={Math.max(coords[hoveredIdx].y - 36, PADY)}
                      width="112" height="32" rx="6"
                      fill="var(--card)" stroke="var(--border)" strokeWidth="1"
                    />
                    <text
                      x={Math.min(coords[hoveredIdx].x + 14, W - 114)}
                      y={Math.max(coords[hoveredIdx].y - 18, PADY + 14)}
                      fontSize="12" fontWeight="700" fill="var(--text)"
                    >
                      {fmt(coords[hoveredIdx].v)}
                    </text>
                    <text
                      x={Math.min(coords[hoveredIdx].x + 14, W - 114)}
                      y={Math.max(coords[hoveredIdx].y - 6, PADY + 26)}
                      fontSize="10" fill="var(--dim)"
                    >
                      {coords[hoveredIdx].day ? new Date(coords[hoveredIdx].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                    </text>
                  </g>
                )}
              </svg>
              <div className="yt-x-axis">
                {coords.filter((_, i) => i % 7 === 0 || i === coords.length - 1).map((c, i) => (
                  <span key={i} className="yt-x-label" style={{ left: `${(c.x / W) * 100}%` }}>
                    {c.day ? new Date(c.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
