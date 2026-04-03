import { Flame } from "lucide-react"

function getStreakData(platform, ytVideos = []) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const year = today.getFullYear()
  const month = today.getMonth()

  // real post dates from YouTube videos this month
  const realPostDates = new Set()
  ytVideos.forEach(v => {
    if (v.publishedAt) {
      const d = new Date(v.publishedAt)
      d.setHours(0, 0, 0, 0)
      realPostDates.add(d.getTime())
    }
  })

  const useReal = !!(JSON.parse(localStorage.getItem("user") || "{}").youtubeStats)

  // for streak grid — use real dates if available
  const postedDates = useReal ? realPostDates : (() => {
    const accumulated = JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]")
    return new Set(accumulated.map(a => {
      if (!a.date) return null
      const d = new Date(a.date); d.setHours(0,0,0,0)
      return d.getTime()
    }).filter(Boolean))
  })()

  // total posted
  const total = useReal
    ? ytVideos.length
    : JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]").length

  // current streak — consecutive days going back from today with a post
  let streak = 0
  const check = new Date(today)
  while (true) {
    if (postedDates.has(check.getTime())) {
      streak++
      check.setDate(check.getDate() - 1)
    } else break
  }

  // longest streak from all posted dates
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
          const today = new Date(); today.setHours(0,0,0,0)
          const year = today.getFullYear(), month = today.getMonth()
          const firstDay = new Date(year, month, 1)
          const totalDays = new Date(year, month + 1, 0).getDate()
          const firstDow = firstDay.getDay()
          const mondayOffset = firstDow === 0 ? 6 : firstDow - 1
          const blanks = Array.from({ length: mondayOffset }, (_, i) => <div key={`b${i}`} style={{ aspectRatio: "1" }} />)
          const cells = Array.from({ length: totalDays }, (_, i) => {
            const date = new Date(year, month, i + 1); date.setHours(0,0,0,0)
            const isToday = date.getTime() === today.getTime()
            const isPosted = postedDates.has(date.getTime())
            return (
              <div key={i + 1}
                title={`${date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}${isPosted ? " · Posted" : ""}`}
                style={{ aspectRatio: "1", borderRadius: "3px", background: isPosted ? accent : "var(--border2)", opacity: isPosted ? 1 : 0.6, position: "relative" }}>
                {isToday && <div style={{ position: "absolute", bottom: "1px", left: "50%", transform: "translateX(-50%)", width: "3px", height: "3px", borderRadius: "50%", background: "#fff" }} />}
              </div>
            )
          })
          return [...blanks, ...cells]
        })()}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "var(--border2)", opacity: 0.6 }} />
          <span style={{ fontSize: "10px", color: "var(--dim)" }}>No post</span>
          <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: accent, marginLeft: "6px" }} />
          <span style={{ fontSize: "10px", color: "var(--dim)" }}>Posted</span>
        </div>
        <span style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{total} posted</span>
      </div>
    </div>
  )
}
