import { GOALS, TOPICS, FREQUENCIES, CONTENT_TYPES } from "../../constants/plannerConstants"

export function buildFallbackContent(goalLabel, topicLabel, platformLabel, dayNum, seed) {
  const angles = [
    "quick tip", "common mistake", "step-by-step guide", "myth vs reality",
    "behind-the-scenes", "beginner checklist", "pro strategy", "case study",
    "trending topic", "audience Q&A", "personal story", "tool review",
  ]
  const idx = (dayNum + seed) % angles.length
  return `${goalLabel} for ${topicLabel} on ${platformLabel} - ${angles[idx]}.`
}

function pickContentType(platform, dayNum, seed) {
  const types = CONTENT_TYPES[platform] || CONTENT_TYPES.both
  return types[(dayNum + seed) % types.length].id
}

export function generatePlan(goal, topic, freq, focus, platform, seed = 0) {
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const focusPlatform = focus || platform
  const goalLabel = GOALS.find(g => g.id === goal)?.label || goal
  const topicLabel = TOPICS.find(t => t.id === topic)?.label || topic

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + i)
    const dayNum = i + 1
    const isPast = date < today
    const isToday = date.getTime() === today.getTime()
    const offsetFromToday = Math.round((date - today) / 86400000)

    let isActive = false
    if (!isPast) {
      if (freq === "daily") isActive = true
      else if (freq === "alt") isActive = offsetFromToday % 2 === 0
      else if (freq === "weekdays") { const dow = date.getDay(); isActive = dow !== 0 && dow !== 6 }
      else isActive = true
    }

    let p
    if (platform !== "both") {
      p = platform
    } else if (focusPlatform === "youtube") {
      p = i % 10 < 7 ? "youtube" : "instagram"
    } else if (focusPlatform === "instagram") {
      p = i % 10 < 7 ? "instagram" : "youtube"
    } else {
      p = i % 3 === 0 ? "youtube" : i % 3 === 1 ? "instagram" : "both"
    }

    return {
      id: dayNum, day: dayNum,
      date: date.toISOString(),
      dateLabel: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      dayName: date.toLocaleDateString("en-IN", { weekday: "short" }),
      isToday,
      content: isActive ? buildFallbackContent(goalLabel, topicLabel, p === "both" ? "YouTube + Instagram" : p === "youtube" ? "YouTube" : "Instagram", dayNum, seed) : "",
      platform: p,
      contentType: isActive ? pickContentType(p === "both" ? "both" : p, dayNum, seed) : "",
      isCompleted: false,
      note: "",
      active: isActive,
    }
  })
}
