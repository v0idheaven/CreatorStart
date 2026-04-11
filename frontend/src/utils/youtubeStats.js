export function toISTDayKey(dateInput) {
  const d = new Date(dateInput)
  if (Number.isNaN(d.getTime())) return ""
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d)
}

export function getRecentVideoViews(ytVideos = [], days = 3) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffKey = toISTDayKey(cutoff)
  return ytVideos.reduce((sum, video) => {
    if (!video?.publishedAt) return sum
    const dayKey = toISTDayKey(video.publishedAt)
    if (!dayKey || dayKey < cutoffKey) return sum
    return sum + Number(video.views || 0)
  }, 0)
}

export function getMergedYoutubeViews({ ytStats, ytAnalytics, ytVideos }) {
  const analyticsViews = Number(ytAnalytics?.overview?.views || ytAnalytics?.overview?.viewsAdjusted || 0)
  const recentVideoViews = getRecentVideoViews(ytVideos)
  const channelViews = Number(ytStats?.views || 0)
  return Math.max(analyticsViews + recentVideoViews, channelViews, analyticsViews, recentVideoViews)
}
