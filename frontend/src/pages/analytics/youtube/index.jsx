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
      <YTStudioView ytStats={ytStats} ytAnalytics={ytAnalytics} refreshingYT={refreshingYT} ytError={ytError} onRefresh={onRefresh} fmt={fmt} />
      <YTVideoTable ytVideos={ytVideos} loadingVideos={loadingVideos} ytError={ytError} onRefresh={fetchYTVideos} fmt={fmt} />
    </div>
  )
}
