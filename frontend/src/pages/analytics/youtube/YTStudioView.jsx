import { useState } from "react"
import { Youtube, RefreshCw } from "lucide-react"

export default function YTStudioView({ ytStats, ytAnalytics, ytVideos, refreshingYT, ytError, onRefresh, days, onChangeDays, fmt }) {
  const [ytTab, setYtTab] = useState("overview")
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const daily = ytAnalytics?.daily || []
  const ov = ytAnalytics?.overview || {}

  // Views: use analytics period total (most accurate for selected period)
  // Fallback to channel lifetime views only if analytics has no data at all
  const analyticsViews = Number(ov.views || 0)
  const channelViews = Number(ytStats?.views || 0)
  const displayViews = analyticsViews > 0 ? analyticsViews : channelViews

  const W = 800, H = 140, PADX = 40, PADY = 16
  const graphMetric = ytTab === "audience" ? "estimatedMinutesWatched" : "views"
  const maxV = Math.max(...daily.map(d => Number(d[graphMetric] || 0)), 1)

  const coords = daily.map((p, i) => {
    const v = Number(p[graphMetric] || 0)
    return {
      x: PADX + i * ((W - PADX * 2) / Math.max(daily.length - 1, 1)),
      y: PADY + (1 - v / maxV) * (H - PADY * 2),
      v,
      day: p.day
    }
  })

  const linePath = coords.length > 1
    ? coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ")
    : ""
  const areaPath = linePath
    ? `${linePath} L ${coords[coords.length - 1]?.x} ${H} L ${PADX} ${H} Z`
    : ""
  const yLabels = [maxV, Math.round(maxV * 0.5), 0]

  const metricTiles = ytTab === "overview" ? [
    { label: "Views", value: fmt(displayViews) },
    { label: "Watch time (hrs)", value: fmt(Math.round((ov.estimatedMinutesWatched || 0) / 60)) },
    { label: "Subscribers", value: fmt(ytStats?.subscribers || 0) },
  ] : [
    { label: "Unique viewers", value: fmt(displayViews) },
    { label: "Subs gained", value: fmt(ov.subscribersGained || 0), color: "#4ade80" },
    { label: "Subs lost", value: fmt(ov.subscribersLost || 0), color: "#f87171" },
  ]

  return (
    <div>
      <div className="yt-channel-header">
        {ytStats?.thumbnail
          ? <img src={ytStats.thumbnail} alt="" className="yt-channel-thumb" />
          : <div className="yt-channel-thumb-placeholder"><Youtube size={20} color="#ff4444" /></div>
        }
        <div className="yt-channel-info">
          <p className="yt-channel-name">{ytStats?.title}</p>
          <p className="yt-channel-meta">{fmt(ytStats?.subscribers || 0)} subscribers · {fmt(ytStats?.videos || 0)} videos</p>
        </div>
        <button onClick={onRefresh} disabled={refreshingYT} className="yt-refresh-btn">
          <RefreshCw size={11} className={refreshingYT ? "spin" : ""} /> Refresh
        </button>
      </div>

      {ytError && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: "#f8717115", border: "1px solid #f8717130", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#f87171", margin: 0, lineHeight: "1.5" }}>{ytError}</p>
        </div>
      )}

      <div className="chart-card yt-analytics-card">
        <div className="yt-tab-row">
          {["overview", "audience"].map(t => (
            <button key={t} onClick={() => setYtTab(t)} className={`yt-tab${ytTab === t ? " yt-tab--active" : ""}`}>{t}</button>
          ))}
          <div className="yt-tab-period">
            {[7, 28, 90].map(d => (
              <button key={d} onClick={() => onChangeDays(d)}
                style={{ padding: "3px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: days === d ? "600" : "400", background: days === d ? "#ff444420" : "transparent", color: days === d ? "#ff4444" : "var(--dim)", transition: "all 0.15s" }}>
                {d}d
              </button>
            ))}
          </div>
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
            <div className="yt-graph-empty">
              <p className="yt-graph-empty-text">No daily data for this period yet.</p>
            </div>
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
                    <rect x={Math.min(coords[hoveredIdx].x + 8, W - 120)} y={Math.max(coords[hoveredIdx].y - 36, PADY)} width="112" height="32" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                    <text x={Math.min(coords[hoveredIdx].x + 14, W - 114)} y={Math.max(coords[hoveredIdx].y - 18, PADY + 14)} fontSize="12" fontWeight="700" fill="var(--text)">{fmt(coords[hoveredIdx].v)}</text>
                    <text x={Math.min(coords[hoveredIdx].x + 14, W - 114)} y={Math.max(coords[hoveredIdx].y - 6, PADY + 26)} fontSize="10" fill="var(--dim)">
                      {coords[hoveredIdx].day ? new Date(coords[hoveredIdx].day + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                    </text>
                  </g>
                )}
              </svg>
              <div className="yt-x-axis">
                {coords.filter((_, i) => i % Math.ceil(coords.length / 6) === 0 || i === coords.length - 1).map((c, i) => (
                  <span key={i} className="yt-x-label" style={{ left: `${(c.x / W) * 100}%` }}>
                    {c.day ? new Date(c.day + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent videos */}
      {ytVideos?.length > 0 && (
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Youtube size={14} color="#ff4444" />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>Recent videos</span>
            </div>
            <button onClick={onRefresh} disabled={refreshingYT} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <RefreshCw size={11} className={refreshingYT ? "spin" : ""} /> Refresh
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table-full">
              <thead>
                <tr>
                  {["", "Title", "Type", "Views", "Likes", "Comments", "Published"].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ytVideos.map(v => (
                  <tr key={v.id} className="table-row">
                    <td className="table-td" style={{ width: "60px" }}>
                      {v.thumbnail && <img src={v.thumbnail} alt="" style={{ width: "52px", height: "30px", objectFit: "cover", borderRadius: "4px" }} />}
                    </td>
                    <td className="table-td" style={{ color: "var(--text)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</td>
                    <td className="table-td"><span style={{ fontSize: "11px", fontWeight: "600", color: v.type === "Short" ? "#818cf8" : "#ff4444" }}>{v.type || "Video"}</span></td>
                    <td className="table-td">{fmt(v.views)}</td>
                    <td className="table-td">{fmt(v.likes)}</td>
                    <td className="table-td">{fmt(v.comments)}</td>
                    <td className="table-td">{v.publishedAt ? new Date(v.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
