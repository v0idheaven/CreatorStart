import { useNavigate } from "react-router-dom"
import { Flame } from "lucide-react"

function getStreakData(platform) {
  const key = `planner_data_${platform}`
  const saved = JSON.parse(localStorage.getItem(key) || "null")
  if (!saved?.entries) return { streak: 0, longest: 0, total: 0, entries: [] }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const active = saved.entries.filter(e => e.active)
  const total = active.filter(e => e.isCompleted).length

  let longest = 0
  let current = 0
  for (const e of active) {
    if (e.isCompleted) { current++; if (current > longest) longest = current }
    else current = 0
  }

  // streak = consecutive completed days going backwards from today
  const pastAndToday = active.filter(e => {
    if (!e.date) return true
    const d = new Date(e.date)
    d.setHours(0, 0, 0, 0)
    return d <= today
  }).sort((a, b) => b.day - a.day)

  let streak = 0
  for (const e of pastAndToday) {
    if (e.isCompleted) streak++
    else break
  }

  return { streak, longest, total, entries: saved.entries }
}

export default function StreakCard({ accent, platform }) {
  const navigate = useNavigate()
  const { streak, longest, total, entries } = getStreakData(platform)

  return (
    <div className="card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>Posting Streak</p>
          <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>
            <span style={{ color: streak > 0 ? "#f59e0b" : "var(--dim)", fontWeight: "600" }}>{streak} day{streak !== 1 ? "s" : ""}</span>
            {longest > 0 && <span style={{ marginLeft: "8px" }}>· best {longest}</span>}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Flame size={16} color={streak > 0 ? "#f59e0b" : "var(--dim)"} />
          <span style={{ fontSize: "20px", fontWeight: "800", color: streak > 0 ? "#f59e0b" : "var(--dim)", lineHeight: 1 }}>{streak}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px", marginBottom: "10px" }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "9px", color: "var(--dim)", marginBottom: "2px" }}>{d}</div>
        ))}
        {(() => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const year = today.getFullYear()
          const month = today.getMonth()
          const firstDay = new Date(year, month, 1)
          const lastDay = new Date(year, month + 1, 0)
          const totalDays = lastDay.getDate()

          const firstDow = firstDay.getDay()
          const mondayOffset = firstDow === 0 ? 6 : firstDow - 1
          const blanks = Array.from({ length: mondayOffset }, (_, i) => (
            <div key={`b${i}`} style={{ aspectRatio: "1" }} />
          ))

          const cells = Array.from({ length: totalDays }, (_, i) => {
            const dayNum = i + 1
            const date = new Date(year, month, dayNum)
            date.setHours(0, 0, 0, 0)
            const isPast = date < today
            const isToday = date.getTime() === today.getTime()
            const isFuture = date > today

            const entry = entries.find(e => {
              if (!e.date) return false
              const d = new Date(e.date)
              d.setHours(0, 0, 0, 0)
              return d.getTime() === date.getTime()
            })

            let bg, opacity
            if (entry?.isCompleted) { bg = accent; opacity = 1 }
            else if (entry?.active) { bg = accent; opacity = 0.35 }
            else if (isFuture) { bg = "var(--border)"; opacity = 0.2 }
            else { bg = "var(--border)"; opacity = 0.4 }

            return (
              <div key={dayNum}
                title={`Apr ${dayNum}${entry?.content ? `: ${entry.content}` : ""}`}
                onClick={() => !isFuture && navigate("/planner")}
                style={{ aspectRatio: "1", borderRadius: "3px", background: bg, opacity, cursor: isFuture ? "default" : "pointer", transition: "opacity 0.1s", position: "relative" }}
                onMouseEnter={e => { if (!isFuture) e.currentTarget.style.opacity = "0.9" }}
                onMouseLeave={e => e.currentTarget.style.opacity = String(opacity)}
              >
                {isToday && (
                  <div style={{ position: "absolute", bottom: "1px", left: "50%", transform: "translateX(-50%)", width: "3px", height: "3px", borderRadius: "50%", background: "#fff" }} />
                )}
              </div>
            )
          })

          return [...blanks, ...cells]
        })()}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "var(--border)", opacity: 0.4 }} />
          <span style={{ fontSize: "10px", color: "var(--dim)" }}>Empty</span>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: accent, opacity: 0.4, marginLeft: "6px" }} />
          <span style={{ fontSize: "10px", color: "var(--dim)" }}>Planned</span>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: accent, marginLeft: "6px" }} />
          <span style={{ fontSize: "10px", color: "var(--dim)" }}>Done</span>
        </div>
        <span style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{total} posted</span>
      </div>
    </div>
  )
}
