import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import OverviewTab from "./overview"
import YouTubeTab from "./youtube"
import useYouTubeData from "./useYouTubeData"
import useOverviewData from "./useOverviewData"
import "./Analytics.css"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }

export function fmt(n) {
  const num = Number(n || 0)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toLocaleString()
}

export default function Analytics() {
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both
  // Parse once — stable reference via useMemo equivalent (read once, don't re-parse on every render)
  const [storedUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"))
  const [tab, setTab] = useState("overview")

  const { ytStats, ytVideos, ytAnalytics, loadingVideos, refreshingYT, ytError, days, changeDays, fetchYTVideos, handleRefreshYT } = useYouTubeData(storedUser.youtubeStats)
  const ov = useOverviewData(platform, ytVideos, storedUser.youtubeStats)

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
                {t === "youtube" ? "YouTube" : "Overview"}
              </button>
            ))}
          </div>
        </div>

        <div className="analytics-body">
          {tab === "overview" && (
            <OverviewTab ov={ov} ytVideos={ytVideos} accent={accent} loadingVideos={loadingVideos} ytError={ytError} fetchYTVideos={fetchYTVideos} fmt={fmt} />
          )}
          {tab === "youtube" && (
            <YouTubeTab
              ytStats={ytStats} ytAnalytics={ytAnalytics} ytVideos={ytVideos}
              loadingVideos={loadingVideos} refreshingYT={refreshingYT} ytError={ytError}
              days={days} onChangeDays={changeDays}
              onRefresh={handleRefreshYT} fetchYTVideos={fetchYTVideos} fmt={fmt}
            />
          )}
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
