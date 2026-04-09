import { Check, Plus } from "lucide-react"
import { COLORS, PC } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

export default function PlannerCalendar({ entries, filter, activeDay, onDayClick, onAddDay, planInfo }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both

  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startDow = firstOfMonth.getDay()
  const mondayOffset = startDow === 0 ? 6 : startDow - 1
  const blanks = Array.from({ length: mondayOffset }, (_, i) => (
    <div key={`b${i}`} className="planner-blank" />
  ))

  const allEntries = filter === "all"
    ? entries
    : filter === "done"
    ? entries.map(e => e.active && !e.isCompleted ? { ...e, content: "" } : e)
    : entries.map(e => e.active && e.isCompleted ? { ...e, content: "" } : e)

  const cards = allEntries.map(entry => {
    const pc = PC[entry.platform] || PC.both
    const isSelected = activeDay === entry.day
    const dateLabel = entry.dateLabel || String(entry.date ? new Date(entry.date).getDate() : entry.day)
    const isEmpty = !entry.active || !entry.content

    const entryDateObj = entry.date ? new Date(entry.date) : null
    if (entryDateObj) entryDateObj.setHours(0, 0, 0, 0)
    const isTodayNow = entryDateObj ? entryDateObj.getTime() === today.getTime() : false
    const isPastNow = entryDateObj ? entryDateObj < today : false

    return (
      <div key={entry.id}
        onClick={() => { if (!isEmpty) onDayClick(entry.day) }}
        className={`planner-day-card ${isEmpty ? "planner-day-card--empty" : "planner-day-card--clickable"}`}
        style={{
          border: `1.5px solid ${isSelected ? accent : entry.isCompleted ? "#4ade8040" : isTodayNow ? accent + "70" : "var(--border)"}`,
          background: isSelected ? accent + "12" : entry.isCompleted ? "#4ade8008" : isTodayNow && !isEmpty ? accent + "08" : "var(--card)",
        }}>
        <div className="planner-day-card-top">
          <div className="planner-day-date-col">
            <span className="planner-day-date" style={{ color: isTodayNow ? accent : entry.isCompleted ? "#4ade80" : "var(--text)" }}>{dateLabel}</span>
            {isTodayNow && <div className="planner-day-today-dot" style={{ background: accent }} />}
          </div>
          {!isEmpty && <span className="planner-day-platform-badge" style={{ color: pc.color, background: pc.bg }}>{pc.label}</span>}
        </div>
        {!isEmpty && entry.content && (
          <p className="planner-day-content" style={{ color: entry.isCompleted ? "var(--dim)" : "var(--muted)", textDecoration: entry.isCompleted ? "line-through" : "none" }}>
            {entry.content}
          </p>
        )}
        {entry.isCompleted && (
          <div className="planner-day-done-dot"><Check size={7} color="#fff" strokeWidth={3} /></div>
        )}
        {entry.note && !entry.isCompleted && <div className="planner-day-note-dot" />}
        {entry.extraPosts?.length > 0 && (
          <div className="planner-day-extra-badge" style={{ color: accent, background: accent + "20" }}>+{entry.extraPosts.length}</div>
        )}
        {isEmpty && planInfo?.freq !== "daily" && !isPastNow && (
          <button onClick={e => { e.stopPropagation(); onAddDay(entry) }}
            className="planner-day-add-btn"
            style={{ border: `1.5px solid ${accent}`, background: accent + "30", color: accent }}>
            <Plus size={12} strokeWidth={2.5} />
          </button>
        )}
        {!isEmpty && !isPastNow && (
          <button onClick={e => { e.stopPropagation(); onAddDay(entry) }}
            className="planner-day-add-btn planner-day-add-btn-sm"
            style={{ border: `1px solid ${accent}50`, background: accent + "20", color: accent }}>
            <Plus size={10} strokeWidth={2.5} />
          </button>
        )}
      </div>
    )
  })

  return <>{[...blanks, ...cards]}</>
}
