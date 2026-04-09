import { COLORS, GOALS, TOPICS, FREQUENCIES } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

// Top header with title, month, plan info, and "New Plan" button
export default function PlannerHeader({ planInfo, screen, onNewPlan }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both

  return (
    <div className="planner-header">
      <div>
        <p className="planner-header-kicker">Content</p>
        <h1 className="planner-header-title">
          30-Day Planner &nbsp;
          <span className="planner-header-month">
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}
          </span>
        </h1>
        {planInfo && (
          <p className="planner-header-subtitle">
            {GOALS.find(g => g.id === planInfo.goal)?.label} · {TOPICS.find(t => t.id === planInfo.topic)?.label} · {FREQUENCIES.find(f => f.id === planInfo.freq)?.label}
          </p>
        )}
      </div>
      {screen === "plan" && (
        <div className="planner-top-actions">
          <button onClick={onNewPlan} className="planner-btn-inline planner-btn-ghost">New Plan</button>
        </div>
      )}
    </div>
  )
}
