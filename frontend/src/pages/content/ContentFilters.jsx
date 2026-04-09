import { Filter } from "lucide-react"
import { STATUSES } from "./contentConfig"

// Status + type filter chips row
export default function ContentFilters({ types, filterStatus, filterType, accent, onStatus, onType }) {
  return (
    <div className="filter-row">
      <Filter size={13} color="var(--dim)" />
      {["All", ...STATUSES].map(s => (
        <button key={s} onClick={() => onStatus(s)} className="filter-chip"
          style={{ border: `1px solid ${filterStatus === s ? accent : "var(--border)"}`, background: filterStatus === s ? accent + "15" : "transparent", color: filterStatus === s ? accent : "var(--muted)" }}>
          {s}
        </button>
      ))}
      <div style={{ width: "1px", background: "var(--border)", margin: "0 4px" }} />
      {["All", ...types].map(t => (
        <button key={t} onClick={() => onType(t)} className="filter-chip"
          style={{ border: `1px solid ${filterType === t ? accent : "var(--border)"}`, background: filterType === t ? accent + "15" : "transparent", color: filterType === t ? accent : "var(--muted)" }}>
          {t}
        </button>
      ))}
    </div>
  )
}
