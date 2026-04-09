import { Youtube, RefreshCw } from "lucide-react"

// Recent YouTube videos table with error state
export default function YTVideoTable({ ytVideos, loadingVideos, ytError, onRefresh, fmt }) {
  return (
    <div className="chart-card yt-videos-card">
      <div className="yt-videos-header">
        <div className="yt-videos-title-row">
          <Youtube size={14} color="#ff4444" />
          <p className="yt-videos-title">Recent videos</p>
        </div>
        <button onClick={onRefresh} disabled={loadingVideos} className="yt-videos-refresh">
          <RefreshCw size={10} className={loadingVideos ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {loadingVideos ? (
        <div className="yt-videos-loading">
          <div className="spinner spinner-sm" style={{ borderTopColor: "#ff4444" }} />
        </div>
      ) : ytError ? (
        <div className="yt-videos-loading" style={{ flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "13px", color: "#f87171", margin: 0 }}>{ytError}</p>
          <button onClick={onRefresh} style={{ fontSize: "12px", color: "#ff4444", background: "#ff444415", border: "1px solid #ff444430", borderRadius: "7px", padding: "6px 14px", cursor: "pointer" }}>
            Try again
          </button>
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
  )
}
