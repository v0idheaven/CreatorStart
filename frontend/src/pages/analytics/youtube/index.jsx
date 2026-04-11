import { Youtube } from "lucide-react"
import YTStudioView from "./YTStudioView"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

export default function YouTubeTab({ ytStats, ytAnalytics, ytVideos, loadingVideos, refreshingYT, ytError, days, onChangeDays, onRefresh, fetchYTVideos, fmt }) {
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
    <YTStudioView ytStats={ytStats} ytAnalytics={ytAnalytics} ytVideos={ytVideos} refreshingYT={refreshingYT} ytError={ytError} onRefresh={onRefresh} days={days} onChangeDays={onChangeDays} fmt={fmt} />
  )
}
