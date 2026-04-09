import { useState, useMemo } from "react"
import { Search, Youtube, Film, BarChart2 } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { MOCK_CONTENT } from "./mockContent"
import VideoDetailPanel from "./VideoDetailPanel"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
const TYPE_COLORS = { Video: "#818cf8", Short: "#06b6d4", Reel: "#c13584", Carousel: "#f59e0b", Post: "#4ade80", Story: "#f97316", Live: "#ff4444" }

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
  const date = new Date(item.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div onClick={onClick} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", transition: "border-color 0.15s, transform 0.15s", cursor: "pointer" }}
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
        {/* Type badge */}
        <span style={{ position: "absolute", top: "8px", left: "8px", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: typeColor + "dd", color: "#fff", backdropFilter: "blur(4px)" }}>
          {item.type}
        </span>
        {/* Duration */}
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

        {/* Platform + date */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Youtube size={11} color="#ff4444" />
            <span style={{ fontSize: "11px", color: "var(--dim)" }}>YouTube</span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--dim)" }}>{date}</span>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", padding: "10px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "12px" }}>
          <StatPill label="Views" value={item.views} />
          <StatPill label="Likes" value={item.likes} />
          <StatPill label="Comments" value={item.comments} />
        </div>

        {/* Action */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "7px", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--dim)", fontSize: "12px", fontWeight: "500" }}>
          <BarChart2 size={12} /> View analytics
        </div>
      </div>
    </div>
  )
}

export default function Content() {
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both

  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [selectedVideo, setSelectedVideo] = useState(null)

  const types = [...new Set(MOCK_CONTENT.map(c => c.type))]

  const filtered = useMemo(() => MOCK_CONTENT.filter(item => {
    if (filterType !== "All" && item.type !== filterType) return false
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [filterType, search])

  // Summary stats
  const totalViews = MOCK_CONTENT.reduce((s, c) => s + c.views, 0)
  const totalLikes = MOCK_CONTENT.reduce((s, c) => s + c.likes, 0)

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
            {/* Summary */}
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "20px", fontWeight: "800", color: accent, margin: 0, letterSpacing: "-0.5px" }}>{fmt(totalViews)}</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Total views</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "#4ade80", margin: 0, letterSpacing: "-0.5px" }}>{fmt(totalLikes)}</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Total likes</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>{MOCK_CONTENT.length}</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Videos</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
              <Search size={13} color="var(--dim)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..."
                style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Type filter */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["All", ...types].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${filterType === t ? accent : "var(--border)"}`, background: filterType === t ? accent + "15" : "transparent", color: filterType === t ? accent : "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
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

        </main>
      </div>
      <VideoDetailPanel video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  )
}
