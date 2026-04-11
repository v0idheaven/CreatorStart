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
  const analyticsViews = Number(ytAnalytics?.overview?.views || 0)
  const videoSumViews = (ytVideos || []).reduce((s, v) => s + Number(v.views || 0), 0)
  const channelViews = Number(ytStats?.views || 0)
  // Use max — never double count
  return Math.max(analyticsViews, videoSumViews, channelViews)
}
