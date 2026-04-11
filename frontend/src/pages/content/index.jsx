import { useState, useEffect, useMemo, createElement } from "react"
import { Search, Youtube, Film, BarChart2, Instagram, Layers, RefreshCw } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import VideoDetailPanel from "./VideoDetailPanel"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"
import { getMergedYoutubeViews } from "../../utils/youtubeStats"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
const TYPE_COLORS = { Video: "#818cf8", Short: "#06b6d4", Reel: "#c13584", Carousel: "#f59e0b", Post: "#4ade80", Story: "#f97316", Live: "#ff4444" }

const PLATFORM_TABS = [
  { id: "all", label: "Overall", icon: Layers, color: "#818cf8" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "#ff4444" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#c13584" },
]

function fmt(n) {
  const num = Number(n || 0)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toLocaleString()
}

function StatPill({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)" }}>{fmt(value)}</span>
      <span style={{ fontSize: "10px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
    </div>
  )
}

function ContentCard({ item, accent, onClick }) {
  const typeColor = TYPE_COLORS[item.type] || accent
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—"

  return (
    <div onClick={onClick}
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", transition: "border-color 0.15s, transform 0.15s", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent + "60"; e.currentTarget.style.transform = "translateY(-2px)" }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}>

      {/* Thumbnail */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--border)", overflow: "hidden" }}>
        {item.thumbnail
          ? <img src={item.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Youtube size={28} color="var(--dim)" />
            </div>
        }
        <span style={{ position: "absolute", top: "8px", left: "8px", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: typeColor + "dd", color: "#fff", backdropFilter: "blur(4px)" }}>
          {item.type}
        </span>
        {item.duration && (
          <span style={{ position: "absolute", bottom: "8px", right: "8px", padding: "2px 7px", borderRadius: "5px", fontSize: "11px", fontWeight: "600", background: "rgba(0,0,0,0.75)", color: "#fff" }}>
            {item.duration}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 8px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Youtube size={11} color="#ff4444" />
            <span style={{ fontSize: "11px", color: "var(--dim)" }}>YouTube</span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--dim)" }}>{date}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", padding: "10px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "12px" }}>
          <StatPill label="Views" value={item.views} />
          <StatPill label="Likes" value={item.likes} />
          <StatPill label="Comments" value={item.comments} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "7px", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--dim)", fontSize: "12px", fontWeight: "500" }}>
          <BarChart2 size={12} /> View analytics
        </div>
      </div>
    </div>
  )
}

export default function Content() {
  const platform = localStorage.getItem("platform") || "both"
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
  const ytConnected = !!storedUser.youtubeStats

  const [ytVideos, setYtVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [ytAnalytics, setYtAnalytics] = useState(null)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [platformTab, setPlatformTab] = useState("all")

  const accent = platformTab === "youtube" ? "#ff4444" : platformTab === "instagram" ? "#c13584" : COLORS[platform] || COLORS.both

  async function fetchVideos() {
    if (!ytConnected) return
    setLoading(true); setError("")
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 20000)
      const [videosRes, analyticsRes] = await Promise.all([
        apiFetch(API_ENDPOINTS.youtubeVideos, { signal: controller.signal }),
        apiFetch(`${API_ENDPOINTS.youtubeAnalytics}?days=28`, { signal: controller.signal }),
      ])
      clearTimeout(timeout)
      const [videosData, analyticsData] = await Promise.all([videosRes.json(), analyticsRes.json()])
      if (videosRes.ok && Array.isArray(videosData?.data)) {
        setYtVideos(videosData.data.map(v => ({ ...v, platform: "youtube" })))
      } else {
        const msg = String(videosData?.message || "").replace(/<[^>]*>/g, "").trim()
        setError(msg.toLowerCase().includes("quota") ? "YouTube API quota exceeded. Try again after midnight Pacific Time." : msg || "Failed to load videos")
      }
      if (analyticsRes.ok && analyticsData?.data) {
        setYtAnalytics(analyticsData.data)
      }
    } catch (e) {
      setError(e.name === "AbortError" ? "Backend is waking up. Click Refresh in a moment." : "Could not load videos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ytConnected) fetchVideos()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // All content — YT videos + (future: IG posts)
  const allContent = useMemo(() => [...ytVideos], [ytVideos])

  const types = [...new Set(allContent.filter(c => platformTab === "all" || c.platform === platformTab).map(c => c.type))]

  const filtered = useMemo(() => allContent.filter(item => {
    if (platformTab !== "all" && item.platform !== platformTab) return false
    if (filterType !== "All" && item.type !== filterType) return false
    if (search && !item.title?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [allContent, filterType, search, platformTab])

  const tabContent = platformTab === "all" ? allContent : allContent.filter(c => c.platform === platformTab)
  const totalViews = getMergedYoutubeViews({ ytStats: storedUser.youtubeStats, ytAnalytics, ytVideos }) || tabContent.reduce((s, c) => s + Number(c.views || 0), 0)
  const totalLikes = tabContent.reduce((s, c) => s + Number(c.likes || 0), 0)
  const totalCount = tabContent.length

  return (
    <div className="page-root">
      <Sidebar />
      <div className="page-content">
        <main className="page-main">

          {/* Header */}
          <div className="page-header" style={{ marginBottom: "20px" }}>
            <div>
              <p className="page-kicker">Library</p>
              <h1 className="page-title">Content</h1>
            </div>
            {ytConnected && !loading && allContent.length > 0 && (
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: accent, margin: 0, letterSpacing: "-0.5px" }}>{fmt(totalViews)}</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Total views</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "#4ade80", margin: 0, letterSpacing: "-0.5px" }}>{fmt(totalLikes)}</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Total likes</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>{totalCount}</p>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{platformTab === "instagram" ? "Posts" : "Videos"}</p>
                </div>
                <button onClick={fetchVideos} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "12px", cursor: "pointer" }}>
                  <RefreshCw size={11} className={loading ? "spin" : ""} /> Refresh
                </button>
              </div>
            )}
          </div>

          {/* Platform tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "4px", width: "fit-content" }}>
            {PLATFORM_TABS.map(({ id, label, icon, color }) => (
              <button key={id} onClick={() => { setPlatformTab(id); setFilterType("All") }}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: platformTab === id ? "600" : "400", background: platformTab === id ? color + "18" : "transparent", color: platformTab === id ? color : "var(--muted)", transition: "all 0.15s" }}>
                {createElement(icon, { size: 13, strokeWidth: platformTab === id ? 2.5 : 1.8 })}
                {label}
              </button>
            ))}
          </div>

          {/* Not connected */}
          {!ytConnected && (
            <div className="card empty-state">
              <Youtube size={32} color="#ff4444" style={{ marginBottom: "12px" }} />
              <p className="empty-title">Connect YouTube</p>
              <p className="empty-sub">Connect your YouTube account to see your videos here.</p>
              <a href={`${API_BASE}/api/v1/auth/google`} className="btn-primary" style={{ background: "#ff4444", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                Connect with Google
              </a>
            </div>
          )}

          {/* Loading */}
          {ytConnected && loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: "12px" }}>
              <div className="spinner spinner-sm" style={{ borderTopColor: "#ff4444" }} />
              <span style={{ fontSize: "13px", color: "var(--dim)" }}>Loading your videos...</span>
            </div>
          )}

          {/* Error */}
          {ytConnected && !loading && error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "14px 16px", borderRadius: "10px", background: "#f8717115", border: "1px solid #f8717130", marginBottom: "16px" }}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <div>
                <p style={{ fontSize: "13px", color: "#f87171", margin: "0 0 8px" }}>{error}</p>
                <button onClick={fetchVideos} style={{ fontSize: "12px", color: "#ff4444", background: "#ff444415", border: "1px solid #ff444430", borderRadius: "7px", padding: "5px 12px", cursor: "pointer" }}>Try again</button>
              </div>
            </div>
          )}

          {/* Filters + Grid */}
          {ytConnected && !loading && !error && allContent.length > 0 && (
            <>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
                  <Search size={13} color="var(--dim)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..."
                    style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["All", ...types].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                      style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${filterType === t ? accent : "var(--border)"}`, background: filterType === t ? accent + "15" : "transparent", color: filterType === t ? accent : "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="card empty-state">
                  <Film size={32} color="var(--dim)" style={{ marginBottom: "12px" }} />
                  <p className="empty-title">No videos found</p>
                  <p className="empty-sub">Try a different search or filter.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {filtered.map(item => <ContentCard key={item.id} item={item} accent={accent} onClick={() => setSelectedVideo(item)} />)}
                </div>
              )}
            </>
          )}

          {/* No videos yet */}
          {ytConnected && !loading && !error && allContent.length === 0 && (
            <div className="card empty-state">
              <Film size={32} color="var(--dim)" style={{ marginBottom: "12px" }} />
              <p className="empty-title">No videos found</p>
              <p className="empty-sub">Upload a video on YouTube and click Refresh.</p>
              <button onClick={fetchVideos} className="btn-primary" style={{ background: "#ff4444", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          )}

        </main>
      </div>
      <VideoDetailPanel video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
