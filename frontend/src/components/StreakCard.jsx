import { Flame } from "lucide-react"

function getStreakData(platform, ytVideos = []) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const realPostDates = new Set()
  ytVideos.forEach(v => {
    if (v.publishedAt) {
      const d = new Date(v.publishedAt)
      d.setHours(0, 0, 0, 0)
      realPostDates.add(d.getTime())
    }
  })

  const useReal = !!(JSON.parse(localStorage.getItem("user") || "{}").youtubeStats)

  const postedDates = useReal ? realPostDates : (() => {
    const accumulated = JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]")
    return new Set(accumulated.map(a => {
      if (!a.date) return null
      const d = new Date(a.date); d.setHours(0, 0, 0, 0)
      return d.getTime()
    }).filter(Boolean))
  })()

  const total = useReal
    ? ytVideos.length
    : JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]").length

  let streak = 0
  const check = new Date(today)
  while (true) {
    if (postedDates.has(check.getTime())) {
      streak++
      check.setDate(check.getDate() - 1)
    } else break
  }

  const sortedDates = [...postedDates].sort((a, b) => a - b)
  let longest = 0, cur = 0, prev = null
  for (const ts of sortedDates) {
    if (prev && ts - prev === 86400000) {
      cur++
    } else {
      cur = 1
    }
    if (cur > longest) longest = cur
    prev = ts
  }

  return { streak, longest, total, postedDates }
}

export default function StreakCard({ accent, platform, ytVideos = [] }) {
  const { streak, longest, total, postedDates } = getStreakData(platform, ytVideos)

  return (
    <div className="card streak-card">
      <div className="streak-header">
        <div>
          <p className="streak-title">Posting Streak</p>
          <p className="streak-sub">
            <span className="streak-days" style={{ color: streak > 0 ? "#f59e0b" : "var(--dim)" }}>
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
            {longest > 0 && <span className="streak-best">· best {longest}</span>}
          </p>
        </div>
        <div className="streak-flame">
          <Flame size={16} color={streak > 0 ? "#f59e0b" : "var(--dim)"} />
          <span className="streak-count" style={{ color: streak > 0 ? "#f59e0b" : "var(--dim)" }}>{streak}</span>
        </div>
      </div>

      <div className="streak-grid">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="streak-day-label">{d}</div>
        ))}
        {(() => {
          const today = new Date(); today.setHours(0, 0, 0, 0)
          const year = today.getFullYear(), month = today.getMonth()
          const firstDay = new Date(year, month, 1)
          const totalDays = new Date(year, month + 1, 0).getDate()
          const firstDow = firstDay.getDay()
          const mondayOffset = firstDow === 0 ? 6 : firstDow - 1
          const blanks = Array.from({ length: mondayOffset }, (_, i) => <div key={`b${i}`} className="streak-cell-blank" />)
          const cells = Array.from({ length: totalDays }, (_, i) => {
            const date = new Date(year, month, i + 1); date.setHours(0, 0, 0, 0)
            const isToday = date.getTime() === today.getTime()
            const isPosted = postedDates.has(date.getTime())
            return (
              <div key={i + 1}
                title={`${date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}${isPosted ? " · Posted" : ""}`}
                className="streak-cell"
                style={{ background: isPosted ? accent : "var(--border2)", opacity: isPosted ? 1 : 0.6 }}>
                {isToday && <div className="streak-today-dot" />}
              </div>
            )
          })
          return [...blanks, ...cells]
        })()}
      </div>

      <div className="streak-legend">
        <div className="streak-legend-left">
          <div className="streak-legend-dot" style={{ background: "var(--border2)", opacity: 0.6 }} />
          <span className="streak-legend-label">No post</span>
          <div className="streak-legend-dot" style={{ background: accent, marginLeft: "6px" }} />
          <span className="streak-legend-label">Posted</span>
        </div>
        <span className="streak-total" style={{ color: accent }}>{total} posted</span>
      </div>
    </div>
  )
}
