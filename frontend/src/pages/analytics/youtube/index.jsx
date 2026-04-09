import { Youtube } from "lucide-react"
import YTStudioView from "./YTStudioView"
import YTVideoTable from "./YTVideoTable"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

// YouTube tab — shows Studio view if connected, else connect prompt
export default function YouTubeTab({ ytStats, ytAnalytics, ytVideos, loadingVideos, refreshingYT, ytError, onRefresh, fetchYTVideos, fmt }) {
  if (!ytStats) {
    return (
      <div className="yt-connect-empty">
        <Youtube size={28} color="#ff4444" />
        <div className="yt-connect-text">
          <p className="yt-connect-title">Connect YouTube</p>
          <p className="yt-connect-sub">See subscribers, views and video count.</p>
          <a href={`${API_BASE}/api/v1/auth/google`} className="yt-connect-btn">Connect with Google</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Error shown once at the top — not repeated in video table */}
      <YTStudioView ytStats={ytStats} ytAnalytics={ytAnalytics} refreshingYT={refreshingYT} ytError={ytError} onRefresh={onRefresh} fmt={fmt} />
      {/* Video table only shows its own loading/empty state, error already shown above */}
      <YTVideoTable ytVideos={ytVideos} loadingVideos={loadingVideos} ytError="" onRefresh={fetchYTVideos} fmt={fmt} />
    </div>
  )
}
