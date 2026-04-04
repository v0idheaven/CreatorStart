import { useState, useMemo, useEffect } from "react"
import { Youtube, RefreshCw } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"
import "./Analytics.css"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
const STATUS_COLORS = { Idea: "#818cf8", Scripting: "#f59e0b", Filming: "#f97316", Editing: "#06b6d4", Published: "#4ade80" }

function YTStudioView({ ytStats, ytAnalytics, refreshingYT, ytError, onRefresh, fmt }) {
  const [ytTab, setYtTab] = useState("overview")
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const daily = ytAnalytics?.daily || []
  const ov = ytAnalytics?.overview || {}

  const W = 800, H = 140, PADX = 40, PADY = 16
  const graphMetric = ytTab === "audience" ? "estimatedMinutesWatched" : "views"
  const maxV = Math.max(...daily.map(d => Number(d[graphMetric] || d.views || 0)), 1)
  const coords = daily.map((p, i) => {
    const v = Number(p[graphMetric] || p.views || 0)
    return {
      x: PADX + i * ((W - PADX * 2) / (daily.length - 1 || 1)),
      y: PADY + (1 - v / maxV) * (H - PADY * 2),
      v, day: p.day
    }
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
    { label: "Unique viewers", value: fmt(ov.views || 0) },
    { label: "Subs gained", value: `+${fmt(ov.subscribersGained || 0)}` },
    { label: "Subs lost", value: `-${fmt(ov.subscribersLost || 0)}` },
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
          <RefreshCw size={11} className={refreshingYT ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {ytError && <p className="yt-error">{ytError}</p>}

      <div className="chart-card yt-analytics-card">
        <div className="yt-tab-row">
          {["overview", "audience"].map(t => (
            <button key={t} onClick={() => setYtTab(t)} className={`yt-tab${ytTab === t ? " yt-tab--active" : ""}`}>
              {t}
            </button>
          ))}
          <div className="yt-tab-period">
            <span className="yt-tab-period-label">Last 28 days</span>
          </div>
        </div>

        <div className="yt-metrics-grid">
          {metricTiles.map((m, i) => (
            <div key={m.label} className={`yt-metric-cell${i < 2 ? " yt-metric-cell--border" : ""}`}>
              <p className="yt-metric-label">{m.label}</p>
              <p className="yt-metric-value">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="yt-graph-wrap">
          {daily.length === 0 ? (
            <div className="yt-graph-empty">
              <p className="yt-graph-empty-text">No data for this period</p>
            </div>
          ) : (
            <div className="yt-graph-inner">
              {hoveredIdx !== null && coords[hoveredIdx] && (
                <div className="yt-hover-info">
                  <span className="yt-hover-value">{fmt(coords[hoveredIdx].v)}</span>
                  <span className="yt-hover-day">{coords[hoveredIdx].day}</span>
                </div>
              )}
              <div style={{ marginTop: hoveredIdx !== null ? "32px" : "0" }}>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
                  className="yt-svg"
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function fmt(n) {
  const num = Number(n || 0)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toLocaleString()
}

export default function Analytics() {
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
  const [ytStats, setYtStats] = useState(storedUser.youtubeStats || null)
  const [ytVideos, setYtVideos] = useState([])
  const [ytAnalytics, setYtAnalytics] = useState(null)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [refreshingYT, setRefreshingYT] = useState(false)
  const [ytError, setYtError] = useState("")
  const [tab, setTab] = useState("overview")
  const [hoveredDay, setHoveredDay] = useState(null)

  async function fetchYTVideos() {
    setLoadingVideos(true)
    try {
      const [vRes, aRes] = await Promise.all([
        apiFetch(API_ENDPOINTS.youtubeVideos),
        apiFetch(API_ENDPOINTS.youtubeAnalytics)
      ])
      const vData = await vRes.json()
      const aData = await aRes.json()
      if (vRes.ok && Array.isArray(vData?.data)) setYtVideos(vData.data)
      if (aRes.ok && aData?.data) setYtAnalytics(aData.data)
    } catch (error) {
      console.warn("Failed to load YouTube analytics data", error)
    }
    setLoadingVideos(false)
  }

  useEffect(() => {
    if (!storedUser.youtubeStats) return
    const timer = window.setTimeout(() => {
      fetchYTVideos()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [storedUser.youtubeStats])

  async function handleRefreshYT() {
    setRefreshingYT(true); setYtError("")
    try {
      const res = await apiFetch(API_ENDPOINTS.youtubeRefresh, { method: "POST" })
      const data = await res.json()
      if (res.ok && data?.data?.youtubeStats) {
        setYtStats(data.data.youtubeStats)
        const u = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...u, youtubeStats: data.data.youtubeStats }))
      } else setYtError(data.message || "Failed")
    } catch { setYtError("Network error") }
    setRefreshingYT(false)
  }

  const ov = useMemo(() => {
    const plan = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
    const streakArr = JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]")
    const contentArr = JSON.parse(localStorage.getItem(`content_data_${platform}`) || "[]")
    const entries = plan?.entries || []
    const active = entries.filter(e => e.active || e.content)
    const done = active.filter(e => e.isCompleted)
    const today = new Date(); today.setHours(0,0,0,0)

    const pastActive = active.filter(e => { if (!e.date) return false; const d = new Date(e.date); d.setHours(0,0,0,0); return d < today })
    const missed = pastActive.filter(e => !e.isCompleted).length
    const rate = pastActive.length ? Math.round((pastActive.filter(e => e.isCompleted).length / pastActive.length) * 100) : 0

    const upcoming = active.filter(e => {
      if (!e.date || e.isCompleted) return false
      const d = new Date(e.date); d.setHours(0,0,0,0)
      const diff = Math.floor((d - today) / 86400000)
      return diff >= 0 && diff <= 7
    }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4)

    const year = today.getFullYear(), month = today.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const realPostDates = new Set()
    ytVideos.forEach(v => {
      if (v.publishedAt) {
        const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        if (d.getFullYear() === year && d.getMonth() === month) realPostDates.add(d.getDate())
      }
    })
    const ytConnected = !!(storedUser.youtubeStats)
    const useRealData = ytConnected
    const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const todayPosted = useRealData && ytVideos.some(v => {
      if (!v.publishedAt) return false
      const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      return d.getDate() === todayIST.getDate() && d.getMonth() === todayIST.getMonth() && d.getFullYear() === todayIST.getFullYear()
    })

    const monthlyActivity = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1); date.setHours(0,0,0,0)
      let v = 0
      if (useRealData) {
        v = realPostDates.has(i + 1) ? 1 : 0
      } else {
        const entry = active.find(e => { if (!e.date) return false; const d = new Date(e.date); d.setHours(0,0,0,0); return d.getTime() === date.getTime() })
        v = entry?.isCompleted ? 1 : 0
      }
      return { day: i + 1, v, isToday: date.getTime() === today.getTime() }
    })

    const weeks = Array.from({ length: 4 }, (_, wi) => {
      if (useRealData) {
        const weekVideos = ytVideos.filter(v => {
          if (!v.publishedAt) return false
          const d = new Date(v.publishedAt); d.setHours(0,0,0,0)
          const diff = Math.floor((today - d) / 86400000)
          return diff >= wi * 7 && diff < (wi + 1) * 7
        })
        return { label: wi === 0 ? "This week" : wi === 1 ? "Last week" : `${wi + 1}w ago`, total: weekVideos.length, done: weekVideos.length }
      }
      const we = active.filter(e => {
        if (!e.date) return false
        const d = new Date(e.date); d.setHours(0,0,0,0)
        const diff = Math.floor((today - d) / 86400000)
        return diff >= wi * 7 && diff < (wi + 1) * 7
      })
      return { label: wi === 0 ? "This week" : wi === 1 ? "Last week" : `${wi + 1}w ago`, total: we.length, done: we.filter(e => e.isCompleted).length }
    }).reverse()

    const dayCounts = Array(7).fill(0)
    if (useRealData) {
      ytVideos.forEach(v => { if (v.publishedAt) dayCounts[new Date(v.publishedAt).getDay()]++ })
    } else {
      done.forEach(e => { if (e.date) dayCounts[new Date(e.date).getDay()]++ })
    }
    const bestDay = dayCounts.indexOf(Math.max(...dayCounts))

    const statusCounts = {}
    contentArr.forEach(c => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1 })
    const recent = done.slice(-4).reverse()
    const consistency = Math.round((weeks.filter(w => w.done > 0).length / 4) * 100)

    return { active: active.length, done: done.length, rate, total: streakArr.length, missed, upcoming, weeks, dayCounts, bestDay, statusCounts, recent, consistency, planInfo: plan?.planInfo, contentTotal: contentArr.length, contentItems: contentArr, monthlyActivity, todayPosted, useRealData }
  }, [platform, ytVideos, storedUser.youtubeStats])

  const showYT = platform === "youtube" || platform === "both"
  const tabs = ["overview", ...(showYT ? ["youtube"] : [])]

  return (
    <div className="page-root">
      <Sidebar />
      <div className="analytics-page-content">

        <div className="analytics-tabs">
          <h1 className="analytics-tabs-title">Analytics</h1>
          <div className="analytics-tab-row">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`analytics-tab${tab === t ? " active" : ""}`}
                style={{ borderBottomColor: tab === t ? accent : "transparent" }}>
                {t === "youtube" ? "YouTube" : t === "instagram" ? "Instagram" : "Overview"}
              </button>
            ))}
          </div>
        </div>

        <div className="analytics-body">

          {tab === "overview" && (
            <div>
              <div className="metrics-row">
                {(() => {
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
                  return items.map((s) => (
                    <div key={s.label} className="metric-item">
                      <p className="metric-value" style={{ color: s.green ? "#4ade80" : s.red ? "#f87171" : "var(--text)" }}>{s.n}</p>
                      <p className="metric-label">{s.label}</p>
                      <p className="metric-sub">{s.sub}</p>
                    </div>
                  ))
                })()}
              </div>

              {(() => {
                const W = 800, H = 120, PAD = 16
                const pts = ov.monthlyActivity
                const maxVal = Math.max(...pts.map(p => p.v), 1)
                const xStep = (W - PAD * 2) / (pts.length - 1 || 1)
                const coords = pts.map((p, i) => ({
                  x: PAD + i * xStep,
                  y: PAD + (1 - p.v / maxVal) * (H - PAD * 2),
                  ...p
                }))
                const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ")
                const areaPath = `${linePath} L ${coords[coords.length - 1]?.x} ${H} L ${PAD} ${H} Z`

                return (
                  <div className="chart-card">
                    <div className="activity-graph-header">
                      <div>
                        <p className="activity-graph-month">
                          {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                        </p>
                        {(() => {
                          const todayEntry = ov.monthlyActivity.find(d => d.isToday)
                          const posted = ov.useRealData ? ov.todayPosted : todayEntry?.v > 0
                          return (
                            <p className="activity-graph-status">
                              {posted
                                ? <><span className="activity-status--posted">Posted</span> <span className="activity-status-sub">today</span></>
                                : <><span className="activity-status--not">Not posted</span> <span className="activity-status-sub">today</span></>
                              }
                            </p>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="activity-graph-body">
                      {hoveredDay !== null && (() => {
                        const c = coords.find(c => c.day === hoveredDay)
                        if (!c) return null
                        const date = new Date(new Date().getFullYear(), new Date().getMonth(), c.day)
                        const dateStr = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
                        return (
                          <div className="activity-hover-info">
                            <div className="activity-hover-row">
                              <span className="activity-hover-value">{c.v > 0 ? "1" : "0"}</span>
                              <span className="activity-hover-date">{dateStr}</span>
                            </div>
                          </div>
                        )
                      })()}

                      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
                        className="activity-svg"
                        onMouseMove={e => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const svgX = ((e.clientX - rect.left) / rect.width) * W
                          const closest = coords.reduce((a, b) => Math.abs(b.x - svgX) < Math.abs(a.x - svgX) ? b : a)
                          setHoveredDay(closest.day)
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {[0.25, 0.5, 0.75, 1].map(f => (
                          <line key={f} x1={PAD} x2={W - PAD} y1={PAD + (1 - f) * (H - PAD * 2)} y2={PAD + (1 - f) * (H - PAD * 2)} stroke="var(--border)" strokeWidth="0.5" />
                        ))}
                        <path d={areaPath} fill={accent} opacity="0.08" />
                        <path d={linePath} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        {coords.filter(c => c.v > 0).map((c, i) => (
                          <circle key={i} cx={c.x} cy={c.y} r="3.5" fill={accent} />
                        ))}
                        {hoveredDay !== null && (() => {
                          const c = coords.find(c => c.day === hoveredDay)
                          if (!c) return null
                          return (
                            <g>
                              <line x1={c.x} x2={c.x} y1={PAD} y2={H} stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                              <circle cx={c.x} cy={c.y} r="5" fill={accent} />
                              <circle cx={c.x} cy={c.y} r="3" fill="var(--card)" />
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
              })()}

              <div className="two-col">
                <div className="chart-card">
                  <div className="weekly-chart-header">
                    <p className="weekly-chart-title">Weekly posting</p>
                    <span className="weekly-chart-consistency">{ov.consistency}% consistent</span>
                  </div>
                  {(() => {
                    const maxTotal = Math.max(...ov.weeks.map(x => x.total), 1)
                    const chartH = 80
                    return (
                      <div className="weekly-bars" style={{ height: `${chartH}px` }}>
                        {ov.weeks.map((w, wi) => {
                          const bgH = w.total ? Math.round((w.total / maxTotal) * chartH) : 3
                          const doneH = w.total ? Math.round((w.done / w.total) * bgH) : 0
                          const today = new Date()
                          const weeksAgo = ov.weeks.length - 1 - wi
                          const endDate = new Date(today); endDate.setDate(today.getDate() - weeksAgo * 7)
                          const startDate = new Date(endDate); startDate.setDate(endDate.getDate() - 6)
                          const dateRange = `${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`

                          return (
                            <div key={w.label} className="weekly-bar-col" style={{ height: `${chartH}px` }}
                              onMouseEnter={e => {
                                const tip = e.currentTarget.querySelector(".bar-tip")
                                if (tip) tip.style.opacity = "1"
                              }}
                              onMouseLeave={e => {
                                const tip = e.currentTarget.querySelector(".bar-tip")
                                if (tip) tip.style.opacity = "0"
                              }}>
                              <div className="bar-tip" style={{ bottom: `${bgH + 10}px` }}>
                                <p className="bar-tip-value">{w.done}/{w.total} posts</p>
                                <p className="bar-tip-range">{dateRange}</p>
                              </div>
                              <div className="weekly-bar-bg" style={{ height: `${bgH}px` }}>
                                {doneH > 0 && (
                                  <div className="weekly-bar-fill" style={{ height: `${(doneH / bgH) * 100}%`, background: doneH === bgH ? "#4ade80" : accent }} />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                  <div className="weekly-labels">
                    {ov.weeks.map(w => {
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
                  {ov.upcoming.length === 0 ? (
                    <p className="upcoming-empty">Nothing scheduled.</p>
                  ) : (
                    <div className="upcoming-list">
                      {ov.upcoming.map((e, i) => (
                        <div key={i} className="upcoming-item">
                          <span className="upcoming-date" style={{ color: accent }}>{e.dateLabel?.split(" ")[0]}</span>
                          <p className="upcoming-content">{e.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {ov.contentTotal > 0 && (
                <div className="chart-card content-table-card">
                  <div className="content-table-header">
                    <p className="content-table-title">Your content</p>
                    <span className="content-table-count">{ov.contentTotal} pieces</span>
                  </div>
                  <table className="table-full">
                    <thead>
                      <tr className="table-row">
                        {["", "Title", "Type", "Status", "Views", "Likes", "Comments"].map((h, i) => (
                          <th key={i} className="table-th">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ov.contentItems.map(item => (
                        <tr key={item.id} className="table-row"
                          onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td className="table-td content-thumb-cell">
                            {item.thumbnail
                              ? <img src={item.thumbnail} alt="" className="content-thumb" />
                              : <div className="content-thumb-placeholder"><span className="content-thumb-none">No img</span></div>
                            }
                          </td>
                          <td className="table-td content-title-cell">
                            <p className="content-title-text">{item.title}</p>
                          </td>
                          <td className="table-td">
                            <span className="badge" style={{ color: accent, background: accent + "15" }}>{item.type || "—"}</span>
                          </td>
                          <td className="table-td">
                            <span className="content-status" style={{ color: STATUS_COLORS[item.status] || "var(--dim)" }}>{item.status}</span>
                          </td>
                          <td className="table-td">{item.views ? Number(item.views).toLocaleString() : "—"}</td>
                          <td className="table-td">{item.likes ? Number(item.likes).toLocaleString() : "—"}</td>
                          <td className="table-td">{item.comments ? Number(item.comments).toLocaleString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {showYT && ytStats && (
                <div className="chart-card yt-videos-card">
                  <div className="yt-videos-header">
                    <div className="yt-videos-title-row">
                      <Youtube size={14} color="#ff4444" />
                      <p className="yt-videos-title">Recent videos</p>
                    </div>
                    <button onClick={fetchYTVideos} disabled={loadingVideos} className="yt-videos-refresh">
                      <RefreshCw size={10} className={loadingVideos ? "spin" : ""} />
                      Refresh
                    </button>
                  </div>
                  {loadingVideos ? (
                    <div className="yt-videos-loading">
                      <div className="spinner spinner-sm" style={{ borderTopColor: "#ff4444" }} />
                    </div>
                  ) : ytVideos.length === 0 ? (
                    <p className="yt-videos-empty">No videos found.</p>
                  ) : (
                    <table className="table-full">
                      <thead>
                        <tr className="table-row">
                          {["", "Title", "Type", "Views", "Likes", "Comments", "Published"].map((h, i) => (
                            <th key={i} className="table-th">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ytVideos.map(v => (
                          <tr key={v.id} className="table-row"
                            onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td className="table-td yt-video-thumb-cell">
                              <a href={v.url} target="_blank" rel="noreferrer">
                                <img src={v.thumbnail} alt="" className="yt-video-thumb" />
                              </a>
                            </td>
                            <td className="table-td yt-video-title-cell">
                              <a href={v.url} target="_blank" rel="noreferrer" className="yt-video-link">
                                <p className="yt-video-title-text">{v.title}</p>
                              </a>
                            </td>
                            <td className="table-td">
                              <span className="badge" style={{ color: v.type === "Short" ? "#06b6d4" : "#ff4444", background: v.type === "Short" ? "#06b6d415" : "#ff444415" }}>
                                {v.type || "Video"}
                              </span>
                            </td>
                            <td className="table-td yt-video-views">{fmt(v.views)}</td>
                            <td className="table-td">{fmt(v.likes)}</td>
                            <td className="table-td">{fmt(v.comments)}</td>
                            <td className="table-td yt-video-date">
                              {new Date(v.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

            </div>
          )}

          {tab === "youtube" && (
            <div>
              {ytStats ? (
                <YTStudioView
                  ytStats={ytStats} ytAnalytics={ytAnalytics}
                  refreshingYT={refreshingYT}
                  ytError={ytError} onRefresh={handleRefreshYT} fmt={fmt}
                />
              ) : (
                <div className="yt-connect-empty">
                  <Youtube size={28} color="#ff4444" />
                  <div className="yt-connect-text">
                    <p className="yt-connect-title">Connect YouTube</p>
                    <p className="yt-connect-sub">See subscribers, views and video count.</p>
                    <a href={`${API_BASE}/api/v1/auth/google`} className="yt-connect-btn">
                      Connect with Google
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
