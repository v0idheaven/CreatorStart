import { ChevronDown } from "lucide-react"
import { STATUSES } from "./contentConfig"

// Clean dropdown filters — Status + Type
export default function ContentFilters({ types, filterStatus, filterType, accent, onStatus, onType }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>

      {/* Status dropdown */}
      <div style={{ position: "relative" }}>
        <select
          value={filterStatus}
          onChange={e => onStatus(e.target.value)}
          style={{
            appearance: "none", WebkitAppearance: "none",
            padding: "7px 32px 7px 12px",
            borderRadius: "8px",
            border: `1px solid ${filterStatus !== "All" ? accent : "var(--border)"}`,
            background: filterStatus !== "All" ? accent + "12" : "var(--card)",
            color: filterStatus !== "All" ? accent : "var(--muted)",
            fontSize: "13px", fontWeight: "500", cursor: "pointer",
            outline: "none",
          }}>
          {["All", ...STATUSES].map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
        </select>
        <ChevronDown size={13} color={filterStatus !== "All" ? accent : "var(--dim)"}
          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>

      {/* Type dropdown */}
      <div style={{ position: "relative" }}>
        <select
          value={filterType}
          onChange={e => onType(e.target.value)}
          style={{
            appearance: "none", WebkitAppearance: "none",
            padding: "7px 32px 7px 12px",
            borderRadius: "8px",
            border: `1px solid ${filterType !== "All" ? accent : "var(--border)"}`,
            background: filterType !== "All" ? accent + "12" : "var(--card)",
            color: filterType !== "All" ? accent : "var(--muted)",
            fontSize: "13px", fontWeight: "500", cursor: "pointer",
            outline: "none",
          }}>
          {["All", ...types].map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
        </select>
        <ChevronDown size={13} color={filterType !== "All" ? accent : "var(--dim)"}
          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>

    </div>
  )
}
