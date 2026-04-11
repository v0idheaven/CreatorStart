import { createElement } from "react"
import { X, ExternalLink, Eye, ThumbsUp, MessageCircle, Clock, Youtube } from "lucide-react"

function fmt(n) {
  const num = Number(n || 0)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toLocaleString()
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "14px 16px", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {createElement(icon, { size: 13, color })}
        </div>
        <span style={{ fontSize: "11px", color: "var(--dim)", fontWeight: "500" }}>{label}</span>
      </div>
      <p style={{ fontSize: "22px", fontWeight: "800", color: "var(--text)", margin: "0 0 2px", letterSpacing: "-0.5px" }}>{value}</p>
      {sub && <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{sub}</p>}
    </div>
  )
}

export default function VideoDetailPanel({ video, onClose }) {
  if (!video) return null
  const accent = "#ff4444"
  const date = new Date(video.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
  const likeRate = video.views ? ((video.likes / video.views) * 100).toFixed(1) : 0

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 100vw)", background: "var(--card)", borderLeft: "1px solid var(--border)", zIndex: 51, overflowY: "auto", overscrollBehavior: "contain", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--card)", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <Youtube size={13} color={accent} />
                <span style={{ fontSize: "11px", color: accent, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>YouTube · {video.type}</span>
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", margin: 0, lineHeight: "1.4" }}>{video.title}</h2>
              <p style={{ fontSize: "12px", color: "var(--dim)", margin: "6px 0 0" }}>Published {date} · {video.duration}</p>
            </div>
            <button onClick={onClose} style={{ background: "var(--border)", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <X size={15} color="var(--muted)" />
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Thumbnail */}
          <div style={{ borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9", background: "var(--border)" }}>
            {video.thumbnail && <img src={video.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
          </div>

          {/* Main stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <StatCard icon={Eye} label="Views" value={fmt(video.views)} color="#818cf8" sub="total views" />
            <StatCard icon={ThumbsUp} label="Likes" value={fmt(video.likes)} color="#4ade80" sub={`${likeRate}% like rate`} />
            <StatCard icon={MessageCircle} label="Comments" value={fmt(video.comments)} color="#f59e0b" sub="total comments" />
            <StatCard icon={Clock} label="Duration" value={video.duration || "—"} color="#06b6d4" sub="video length" />
          </div>

          {/* View on YouTube */}
          <a href={video.url || "#"} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", borderRadius: "10px", background: "#ff444415", border: "1px solid #ff444430", color: accent, fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
            <ExternalLink size={14} /> View on YouTube
          </a>

        </div>
      </div>
    </>
  )
}
