import { useMemo } from "react"

// Computes all overview stats from localStorage + ytVideos
export default function useOverviewData(platform, ytVideos, youtubeStats) {
  // Use boolean as memo dep — object reference changes every render causing infinite loops
  const ytConnected = !!youtubeStats
  return useMemo(() => {
    const useRealData = ytConnected

    const plan = JSON.parse(localStorage.getItem(`planner_data_${platform}`) || "null")
    const streakArr = JSON.parse(localStorage.getItem(`streak_data_${platform}`) || "[]")
    const contentArr = JSON.parse(localStorage.getItem(`content_data_${platform}`) || "[]")
    const entries = plan?.entries || []
    const active = entries.filter(e => e.active || e.content)
    const done = active.filter(e => e.isCompleted)
    const today = new Date(); today.setHours(0, 0, 0, 0)

    const pastActive = active.filter(e => { if (!e.date) return false; const d = new Date(e.date); d.setHours(0,0,0,0); return d < today })
    const missed = pastActive.filter(e => !e.isCompleted).length
    const rate = pastActive.length ? Math.round((pastActive.filter(e => e.isCompleted).length / pastActive.length) * 100) : 0

    const upcoming = active.filter(e => {
      if (!e.date || e.isCompleted) return false
      const d = new Date(e.date); d.setHours(0,0,0,0)
      const diff = Math.floor((d - today) / 86400000)
      return diff >= 0 && diff <= 7
    }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4)

    const year = today.getFullYear(), month = today.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const realPostDates = new Set()
    ytVideos.forEach(v => {
      if (v.publishedAt) {
        const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        if (d.getFullYear() === year && d.getMonth() === month) realPostDates.add(d.getDate())
      }
    })

    const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const todayPosted = useRealData && ytVideos.some(v => {
      if (!v.publishedAt) return false
      const d = new Date(new Date(v.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
      return d.getDate() === todayIST.getDate() && d.getMonth() === todayIST.getMonth() && d.getFullYear() === todayIST.getFullYear()
    })

    const monthlyActivity = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1); date.setHours(0,0,0,0)
      const v = useRealData
        ? (realPostDates.has(i + 1) ? 1 : 0)
        : (active.find(e => { if (!e.date) return false; const d = new Date(e.date); d.setHours(0,0,0,0); return d.getTime() === date.getTime() })?.isCompleted ? 1 : 0)
      return { day: i + 1, v, isToday: date.getTime() === today.getTime() }
    })

    const weeks = Array.from({ length: 4 }, (_, wi) => {
      if (useRealData) {
        const wv = ytVideos.filter(v => {
          if (!v.publishedAt) return false
          const d = new Date(v.publishedAt); d.setHours(0,0,0,0)
          const diff = Math.floor((today - d) / 86400000)
          return diff >= wi * 7 && diff < (wi + 1) * 7
        })
        return { label: wi === 0 ? "This week" : wi === 1 ? "Last week" : `${wi + 1}w ago`, total: wv.length, done: wv.length }
      }
      const we = active.filter(e => {
        if (!e.date) return false
        const d = new Date(e.date); d.setHours(0,0,0,0)
        const diff = Math.floor((today - d) / 86400000)
        return diff >= wi * 7 && diff < (wi + 1) * 7
      })
      return { label: wi === 0 ? "This week" : wi === 1 ? "Last week" : `${wi + 1}w ago`, total: we.length, done: we.filter(e => e.isCompleted).length }
    }).reverse()

    const consistency = Math.round((weeks.filter(w => w.done > 0).length / 4) * 100)

    return {
      active: active.length, done: done.length, rate, total: streakArr.length, missed,
      upcoming, weeks, consistency, monthlyActivity, todayPosted, useRealData,
      contentTotal: contentArr.length, contentItems: contentArr,
    }
  }, [platform, ytVideos, ytConnected])
}
