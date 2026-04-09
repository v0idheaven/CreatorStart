import { Sparkles } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { COLORS } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

// Full-screen loading state while plan is being generated
export default function GeneratingScreen() {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both

  return (
    <div className="planner-generating-root">
      <Sidebar />
      <div className="planner-generating-main">
        <div className="planner-generating-icon" style={{ background: accent + "18" }}>
          <Sparkles size={24} color={accent} />
        </div>
        <div className="planner-generating-copy">
          <p className="planner-generating-title">Building your plan...</p>
          <p className="planner-generating-subtitle">AI is creating 30 days of content ideas for you</p>
        </div>
        <div className="planner-progress-track">
          <div className="planner-progress-fill" style={{ background: accent }} />
        </div>
      </div>
    </div>
  )
}
