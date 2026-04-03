import { useState, useMemo, useEffect } from "react"
import { Youtube, Instagram, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
const STATUS_COLORS = { Idea: "#818cf8", Scripting: "#f59e0b", Filming: "#f97316", Editing: "#06b6d4", Published: "#4ade80" }
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function IGConnectView({ apiBase }) {
  const [username, setUsername] = useState("")
  const [isProfessional, setIsProfessional] = useState(false)
  const [isLinked, setIsLinked] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifyError, setVerifyError] = useState("")
  const canVerify = username.trim().length > 0 && isProfessional && isLinked

  async function handleVerify() {
    setVerifying(true)
    setVerifyError("")
    setVerified(false)
    const clean = username.trim()
    if (!clean || clean.length > 30 || /\s/.test(clean)) {
      setVerifyError("Enter a valid Instagram username.")
      setVerifying(false)
      return
    }
    try {
      const res = await fetch(`${apiBase}/api/v1/auth/instagram/check/${clean}`)
      const data = await res.json()
      if (data?.data?.exists === false) {
        setVerifyError(`@${clean} not found on Instagram. Check the username.`)
      } else {
        setVerified(true)
      }
    } catch {
      // network error — allow anyway
      setVerified(true)
    }
    setVerifying(false)
  }

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #c13584, #f56040)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Instagram size={20} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", margin: 0 }}>Connect Instagram</p>
          <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>Professional account required</p>
        </div>
      </div>

      <div>
        <label style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Your Instagram username</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            className="input-sm"
            value={username}
            onChange={e => { setUsername(e.target.value.replace("@", "")); setVerified(false); setVerifyError("") }}
            placeholder="yourhandle"
            style={{ flex: 1, boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>Before connecting, confirm:</p>

        <div onClick={() => { setIsProfessional(p => !p); setVerified(false) }}
          style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "12px", borderRadius: "8px", border: `1px solid ${isProfessional ? "#c13584" : "var(--border)"}`, background: isProfessional ? "#c1358408" : "transparent", transition: "all 0.15s" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${isProfessional ? "#c13584" : "var(--border2)"}`, background: isProfessional ? "#c13584" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
            {isProfessional && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)", margin: "0 0 2px" }}>My account is Professional (Creator or Business)</p>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Instagram → Settings → Account → Switch to Professional Account</p>
          </div>
        </div>

        <div onClick={() => { setIsLinked(p => !p); setVerified(false) }}
          style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "12px", borderRadius: "8px", border: `1px solid ${isLinked ? "#c13584" : "var(--border)"}`, background: isLinked ? "#c1358408" : "transparent", transition: "all 0.15s" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${isLinked ? "#c13584" : "var(--border2)"}`, background: isLinked ? "#c13584" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
            {isLinked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)", margin: "0 0 2px" }}>My Instagram is linked to a Facebook Page</p>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Instagram → Settings → Account → Linked Accounts → Facebook</p>
          </div>
        </div>
      </div>

      {verifyError && <p style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{verifyError}</p>}

      {!verified ? (
        <button onClick={handleVerify} disabled={!canVerify || verifying}
          style={{ padding: "11px", borderRadius: "10px", border: "none", background: canVerify ? "#c13584" : "var(--border)", color: canVerify ? "#fff" : "var(--dim)", fontSize: "13px", fontWeight: "600", cursor: canVerify ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {verifying ? <><div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Verifying...</> : "Verify & Continue"}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", background: "#4ade8015", border: "1px solid #4ade8030" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#4ade80"/><path d="M4 7L6 9L10 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: "600" }}>@{username} — ready to connect</span>
          </div>
          <a href={`${apiBase}/api/v1/auth/instagram`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px", borderRadius: "10px", background: "linear-gradient(135deg, #c13584, #f56040)", color: "#fff", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
            <Instagram size={15} />
            Connect Instagram
          </a>
        </div>
      )}
    </div>
  )
}

function YTStudioView({ ytStats, ytVideos, ytAnalytics, loadingVideos, refreshingYT, ytError, onRefresh, fmt }) {
  const [ytTab, setYtTab] = useState("overview")
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const daily = ytAnalytics?.daily || []
  const ov = ytAnalytics?.overview || {}

  // build graph coords
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
      {/* Channel header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        {ytStats.thumbnail
          ? <img src={ytStats.thumbnail} alt="" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
          : <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#ff444420", display: "flex", alignItems: "center", justifyContent: "center" }}><Youtube size={20} color="#ff4444" /></div>
        }
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", margin: "0 0 1px" }}>{ytStats.title}</p>
          <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{fmt(ytStats.subscribers)} subscribers · {fmt(ytStats.videos)} videos</p>
        </div>
        <button onClick={onRefresh} disabled={refreshingYT}
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "12px", cursor: "pointer" }}>
          <RefreshCw size={11} style={{ animation: refreshingYT ? "spin 0.8s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      {ytError && <p style={{ fontSize: "12px", color: "#f87171", margin: "0 0 12px" }}>{ytError}</p>}

      {/* Channel analytics — YT Studio layout */}
      <div style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)", overflow: "hidden", marginBottom: "16px" }}>
        {/* Sub-tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 20px" }}>
          {["overview", "audience"].map(t => (
            <button key={t} onClick={() => setYtTab(t)}
              style={{ padding: "12px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${ytTab === t ? "#ff4444" : "transparent"}`, color: ytTab === t ? "var(--text)" : "var(--dim)", fontSize: "13px", fontWeight: ytTab === t ? "600" : "400", cursor: "pointer", textTransform: "capitalize", marginBottom: "-1px" }}>
              {t}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "0 4px" }}>
            <span style={{ fontSize: "11px", color: "var(--dim)" }}>Last 28 days</span>
          </div>
        </div>

        {/* Metric tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid var(--border)" }}>
          {metricTiles.map((m, i) => (
            <div key={m.label} style={{ padding: "16px 20px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
              <p style={{ fontSize: "11px", color: "var(--dim)", margin: "0 0 4px" }}>{m.label}</p>
              <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--text)", margin: 0, letterSpacing: "-1px" }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Graph */}
        <div style={{ padding: "20px", position: "relative" }}>
          {daily.length === 0 ? (
            <div style={{ height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>No data for this period</p>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* hover info */}
              {hoveredIdx !== null && coords[hoveredIdx] && (
                <div style={{ position: "absolute", top: 0, left: 0, display: "flex", alignItems: "baseline", gap: "8px", pointerEvents: "none" }}>
                  <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.5px" }}>{fmt(coords[hoveredIdx].v)}</span>
                  <span style={{ fontSize: "12px", color: "var(--dim)" }}>{coords[hoveredIdx].day}</span>
                </div>
              )}
              <div style={{ marginTop: hoveredIdx !== null ? "32px" : "0" }}>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
                  style={{ display: "block", overflow: "visible" }}
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const svgX = ((e.clientX - rect.left) / rect.width) * W
                    const closest = coords.reduce((a, b) => Math.abs(b.x - svgX) < Math.abs(a.x - svgX) ? b : a, coords[0])
                    setHoveredIdx(coords.indexOf(closest))
                  }}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* y-axis grid lines */}
                  {yLabels.map((v, i) => {
                    const y = PADY + (1 - v / maxV) * (H - PADY * 2)
                    return (
                      <g key={i}>
                        <line x1={PADX} x2={W - 8} y1={y} y2={y} stroke="var(--border)" strokeWidth="0.5" />
                        <text x={PADX - 4} y={y + 4} textAnchor="end" fontSize="10" fill="var(--dim)">{fmt(v)}</text>
                      </g>
                    )
                  })}
                  {/* area */}
                  <path d={areaPath} fill="#ff4444" opacity="0.06" />
                  {/* line */}
                  <path d={linePath} stroke="#ff4444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {/* hover crosshair */}
                  {hoveredIdx !== null && coords[hoveredIdx] && (
                    <g>
                      <line x1={coords[hoveredIdx].x} x2={coords[hoveredIdx].x} y1={PADY} y2={H} stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                      <circle cx={coords[hoveredIdx].x} cy={coords[hoveredIdx].y} r="5" fill="#ff4444" />
                      <circle cx={coords[hoveredIdx].x} cy={coords[hoveredIdx].y} r="3" fill="var(--card)" />
                    </g>
                  )}
                </svg>
                {/* x-axis labels */}
                <div style={{ display: "flex", position: "relative", height: "16px", marginTop: "4px" }}>
                  {coords.filter((_, i) => i % 7 === 0 || i === coords.length - 1).map((c, i) => (
                    <span key={i} style={{ position: "absolute", left: `${(c.x / W) * 100}%`, transform: "translateX(-50%)", fontSize: "10px", color: "var(--dim)", whiteSpace: "nowrap" }}>
                      {c.day ? new Date(c.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Videos table removed — see Content page */}
    </div>
  )
}

function fmt(n) {
  const num = Number(n || 0)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toLocaleString()
}

function Sparkline({ color }) {
  return (
    <svg width="100%" height="40" viewBox="0 0 160 40" preserveAspectRatio="none" fill="none">
      <polyline points="0,36 25,28 50,22 75,16 100,20 125,10 160,6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  )
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
    } catch {}
    setLoadingVideos(false)
  }

  // fetch videos on mount if YT connected
  useEffect(() => {
    if (storedUser.youtubeStats) fetchYTVideos()
  }, [])
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

    // real post dates from YouTube videos — IST timezone
    const realPostDates = new Set()
    ytVideos.forEach(v => {
      if (v.publishedAt) {
        const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        if (d.getFullYear() === year && d.getMonth() === month) realPostDates.add(d.getDate())
      }
    })
    // if YT connected but no videos yet — use empty data, NOT planner fallback
    const ytConnected = !!(storedUser.youtubeStats)
    const useRealData = ytConnected // always use real mode when YT connected
    const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    // todayPosted = true only if a video was published TODAY (not just this month)
    const todayPosted = useRealData && ytVideos.some(v => {
      if (!v.publishedAt) return false
      const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      return d.getDate() === todayIST.getDate() && d.getMonth() === todayIST.getMonth() && d.getFullYear() === todayIST.getFullYear()
    })

    // monthly activity graph — real YT data if available, else planner
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

    // weekly — real YT data if available
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
  }, [platform, ytVideos])

  const showYT = platform === "youtube" || platform === "both"
  const showIG = platform === "instagram" || platform === "both"
  const tabs = ["overview", ...(showYT ? ["youtube"] : []), ...(showIG ? ["instagram"] : [])]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ marginLeft: "72px", flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "24px 40px 0", borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text)", margin: "0 0 18px" }}>Analytics</h1>
          <div style={{ display: "flex" }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: "7px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? accent : "transparent"}`, color: tab === t ? "var(--text)" : "var(--dim)", fontSize: "13px", fontWeight: tab === t ? "600" : "400", cursor: "pointer", marginBottom: "-1px", transition: "color 0.15s" }}>
                {t === "youtube" ? "YouTube" : t === "instagram" ? "Instagram" : "Overview"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: "24px 40px", overflowY: "auto" }}>

          {tab === "overview" && (
            <div>
              {/* 4 numbers — real YT data when connected */}
              <div style={{ display: "flex", gap: "0", paddingBottom: "28px", marginBottom: "28px", borderBottom: "1px solid var(--border)" }}>
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
                  return items.map((s, i) => (
                    <div key={s.label} style={{ flex: 1, paddingRight: "32px", marginRight: "32px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                      <p style={{ fontSize: "36px", fontWeight: "800", color: s.green ? "#4ade80" : s.red ? "#f87171" : "var(--text)", margin: "0 0 4px", letterSpacing: "-2px", lineHeight: 1 }}>{s.n}</p>
                      <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 1px" }}>{s.label}</p>
                      <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{s.sub}</p>
                    </div>
                  ))
                })()}
              </div>

              {/* main activity graph */}
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
                  <div style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)", padding: "20px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>
                          {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                        </p>
                        {(() => {
                          const todayEntry = ov.monthlyActivity.find(d => d.isToday)
                          const posted = ov.useRealData ? ov.todayPosted : todayEntry?.v > 0
                          return (
                            <p style={{ fontSize: "22px", fontWeight: "800", color: "var(--text)", margin: 0, letterSpacing: "-1px", lineHeight: 1 }}>
                              {posted
                                ? <><span style={{ color: "#4ade80" }}>Posted</span> <span style={{ fontSize: "13px", fontWeight: "400", color: "var(--dim)", letterSpacing: 0 }}>today</span></>
                                : <><span style={{ color: "var(--muted)" }}>Not posted</span> <span style={{ fontSize: "13px", fontWeight: "400", color: "var(--dim)", letterSpacing: 0 }}>today</span></>
                              }
                            </p>
                          )
                        })()}
                      </div>
                    </div>

                    {/* graph with hover overlay */}
                    <div style={{ position: "relative" }}>
                      {/* hover info — top left inside graph */}
                      {hoveredDay !== null && (() => {
                        const c = coords.find(c => c.day === hoveredDay)
                        if (!c) return null
                        const date = new Date(new Date().getFullYear(), new Date().getMonth(), c.day)
                        const dateStr = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
                        return (
                          <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 5, pointerEvents: "none" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                              <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--text)", letterSpacing: "-1px", lineHeight: 1 }}>{c.v > 0 ? "1" : "0"}</span>
                              <span style={{ fontSize: "13px", color: "var(--dim)" }}>{dateStr}</span>
                            </div>
                          </div>
                        )
                      })()}

                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
                      style={{ display: "block", overflow: "visible", cursor: "default" }}
                      onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const svgX = ((e.clientX - rect.left) / rect.width) * W
                        const closest = coords.reduce((a, b) => Math.abs(b.x - svgX) < Math.abs(a.x - svgX) ? b : a)
                        setHoveredDay(closest.day)
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {/* grid lines */}
                      {[0.25, 0.5, 0.75, 1].map(f => (
                        <line key={f} x1={PAD} x2={W - PAD} y1={PAD + (1 - f) * (H - PAD * 2)} y2={PAD + (1 - f) * (H - PAD * 2)} stroke="var(--border)" strokeWidth="0.5" />
                      ))}
                      {/* area fill */}
                      <path d={areaPath} fill={accent} opacity="0.08" />
                      {/* line */}
                      <path d={linePath} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      {/* dots for posted days */}
                      {coords.filter(c => c.v > 0).map((c, i) => (
                        <circle key={i} cx={c.x} cy={c.y} r="3.5" fill={accent} />
                      ))}
                      {/* hover crosshair */}
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

                    {/* x-axis labels */}
                    <div style={{ display: "flex", marginTop: "6px", position: "relative", height: "14px" }}>
                      {coords.filter((_, i) => i % 5 === 0 || i === coords.length - 1).map(c => (
                        <span key={c.day} style={{ position: "absolute", left: `${(c.x / W) * 100}%`, transform: "translateX(-50%)", fontSize: "10px", color: c.isToday ? accent : "var(--dim)", fontWeight: c.isToday ? "700" : "400" }}>
                          {c.day}
                        </span>
                      ))}
                    </div>
                    </div>
                  </div>
                )
              })()}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                {/* weekly bar chart */}
                <div style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: 0 }}>Weekly posting</p>
                    <span style={{ fontSize: "11px", color: "var(--dim)" }}>{ov.consistency}% consistent</span>
                  </div>
                  {(() => {
                    const maxTotal = Math.max(...ov.weeks.map(x => x.total), 1)
                    const chartH = 80
                    return (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: `${chartH}px`, borderBottom: "1px solid var(--border)", position: "relative" }}>
                        {ov.weeks.map((w, wi) => {
                          const bgH = w.total ? Math.round((w.total / maxTotal) * chartH) : 3
                          const doneH = w.total ? Math.round((w.done / w.total) * bgH) : 0
                          const isThis = w.label === "This week"
                          const today = new Date()
                          const weeksAgo = ov.weeks.length - 1 - wi
                          const endDate = new Date(today); endDate.setDate(today.getDate() - weeksAgo * 7)
                          const startDate = new Date(endDate); startDate.setDate(endDate.getDate() - 6)
                          const dateRange = `${startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`

                          return (
                            <div key={w.label} style={{ flex: 1, height: `${chartH}px`, display: "flex", alignItems: "flex-end", position: "relative" }}
                              onMouseEnter={e => {
                                const tip = e.currentTarget.querySelector(".bar-tip")
                                if (tip) tip.style.opacity = "1"
                              }}
                              onMouseLeave={e => {
                                const tip = e.currentTarget.querySelector(".bar-tip")
                                if (tip) tip.style.opacity = "0"
                              }}>
                              {/* floating tooltip */}
                              <div className="bar-tip" style={{
                                position: "absolute", bottom: `${bgH + 10}px`, left: "50%", transform: "translateX(-50%)",
                                background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px",
                                padding: "7px 10px", whiteSpace: "nowrap", opacity: 0,
                                transition: "opacity 0.12s", pointerEvents: "none", zIndex: 20,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
                              }}>
                                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)", margin: "0 0 2px", letterSpacing: "-0.3px" }}>{w.done}/{w.total} posts</p>
                                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{dateRange}</p>
                              </div>
                              <div style={{ width: "100%", height: `${bgH}px`, background: "var(--border)", borderRadius: "3px 3px 0 0", position: "relative", overflow: "hidden" }}>
                                {doneH > 0 && (
                                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(doneH / bgH) * 100}%`, background: doneH === bgH ? "#4ade80" : accent, borderRadius: "3px 3px 0 0" }} />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {ov.weeks.map(w => {
                      const isThis = w.label === "This week"
                      return (
                        <div key={w.label} style={{ flex: 1, textAlign: "center" }}>
                          <span style={{ fontSize: "11px", color: isThis ? accent : "var(--dim)", fontWeight: isThis ? "600" : "400" }}>
                            {w.label === "This week" ? "This" : w.label === "Last week" ? "Last" : w.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* upcoming */}
                <div style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)", padding: "20px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 16px" }}>Next 7 days</p>
                  {ov.upcoming.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Nothing scheduled.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {ov.upcoming.map((e, i) => (
                        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "11px", color: accent, fontWeight: "700", minWidth: "30px", paddingTop: "1px", flexShrink: 0 }}>{e.dateLabel?.split(" ")[0]}</span>
                          <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* content posts list — YT Studio style */}
              {ov.contentTotal > 0 && (
                <div style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)", overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: 0 }}>Your content</p>
                    <span style={{ fontSize: "11px", color: "var(--dim)" }}>{ov.contentTotal} pieces</span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["", "Title", "Type", "Status", "Views", "Likes", "Comments"].map((h, i) => (
                          <th key={i} style={{ padding: "9px 14px", textAlign: "left", fontSize: "11px", color: "var(--dim)", fontWeight: "500", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ov.contentItems.map(item => (
                        <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "10px 14px", width: "60px" }}>
                            {item.thumbnail
                              ? <img src={item.thumbnail} alt="" style={{ width: "52px", height: "30px", borderRadius: "4px", objectFit: "cover", display: "block" }} />
                              : <div style={{ width: "52px", height: "30px", borderRadius: "4px", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <span style={{ fontSize: "9px", color: "var(--dim)" }}>No img</span>
                                </div>
                            }
                          </td>
                          <td style={{ padding: "10px 14px", maxWidth: "240px" }}>
                            <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: "500", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: "11px", color: accent, background: accent + "15", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>{item.type || "—"}</span>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: "11px", color: STATUS_COLORS[item.status] || "var(--dim)", fontWeight: "600" }}>{item.status}</span>
                          </td>
                          <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--muted)" }}>{item.views ? Number(item.views).toLocaleString() : "—"}</td>
                          <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--muted)" }}>{item.likes ? Number(item.likes).toLocaleString() : "—"}</td>
                          <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--muted)" }}>{item.comments ? Number(item.comments).toLocaleString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* recent YouTube videos */}
              {showYT && ytStats && (
                <div style={{ background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)", overflow: "hidden", marginTop: "12px" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <Youtube size={14} color="#ff4444" />
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: 0 }}>Recent videos</p>
                    </div>
                    <button onClick={fetchYTVideos} disabled={loadingVideos}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "11px", cursor: "pointer" }}>
                      <RefreshCw size={10} style={{ animation: loadingVideos ? "spin 0.8s linear infinite" : "none" }} />
                      Refresh
                    </button>
                  </div>
                  {loadingVideos ? (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <div style={{ width: "18px", height: "18px", border: "2px solid var(--border)", borderTopColor: "#ff4444", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                    </div>
                  ) : ytVideos.length === 0 ? (
                    <p style={{ padding: "16px 20px", fontSize: "13px", color: "var(--dim)", margin: 0 }}>No videos found.</p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          {["", "Title", "Type", "Views", "Likes", "Comments", "Published"].map((h, i) => (
                            <th key={i} style={{ padding: "9px 14px", textAlign: "left", fontSize: "11px", color: "var(--dim)", fontWeight: "500" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ytVideos.map(v => (
                          <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "10px 14px", width: "80px" }}>
                              <a href={v.url} target="_blank" rel="noreferrer">
                                <img src={v.thumbnail} alt="" style={{ width: "64px", height: "36px", borderRadius: "4px", objectFit: "cover", display: "block" }} />
                              </a>
                            </td>
                            <td style={{ padding: "10px 14px", maxWidth: "220px" }}>
                              <a href={v.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                                <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: "500", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
                              </a>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontSize: "11px", fontWeight: "600", color: v.type === "Short" ? "#06b6d4" : "#ff4444", background: v.type === "Short" ? "#06b6d415" : "#ff444415", padding: "2px 8px", borderRadius: "4px" }}>
                                {v.type || "Video"}
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--text)", fontWeight: "500" }}>{fmt(v.views)}</td>
                            <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--muted)" }}>{fmt(v.likes)}</td>
                            <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--muted)" }}>{fmt(v.comments)}</td>
                            <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--dim)", whiteSpace: "nowrap" }}>
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

          {tab === "youtube" && (            <div>
              {ytStats ? (
                <YTStudioView
                  ytStats={ytStats} ytVideos={ytVideos} ytAnalytics={ytAnalytics}
                  loadingVideos={loadingVideos} refreshingYT={refreshingYT}
                  ytError={ytError} onRefresh={handleRefreshYT} fmt={fmt}
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: "14px" }}>
                  <Youtube size={28} color="#ff4444" />
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>Connect YouTube</p>
                    <p style={{ fontSize: "13px", color: "var(--dim)", margin: "0 0 20px" }}>See subscribers, views and video count.</p>
                    <a href={`${API_BASE}/api/v1/auth/google`}
                      style={{ padding: "8px 18px", borderRadius: "8px", background: "#ff4444", color: "#fff", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                      Connect with Google
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "instagram" && (
            <IGConnectView apiBase={API_BASE} />
          )}

        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
