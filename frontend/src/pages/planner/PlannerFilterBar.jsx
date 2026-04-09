import { COLORS } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

// Filter chips (All/Pending/Done) + progress bar
export default function PlannerFilterBar({ filter, onFilter, completed, total }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both
  const pct = total ? Math.round((completed / total) * 100) : 0

  return (
    <div className="planner-filter-row">
      <div className="planner-filter-chips">
        {[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "done", label: "Done" }].map(f => (
          <button key={f.id} onClick={() => onFilter(f.id)} className="planner-filter-chip"
            style={{ border: `1px solid ${filter === f.id ? accent : "var(--border)"}`, background: filter === f.id ? accent : "transparent", color: filter === f.id ? "#fff" : "var(--muted)" }}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="planner-progress-row">
        <span className="planner-progress-label">{completed} of {total} done</span>
        <div className="planner-progress-bar">
          <div className="planner-progress-fill-bar" style={{ width: `${pct}%` }} />
        </div>
        <span className="planner-progress-pct">{pct}%</span>
      </div>
    </div>
  )
}
