export function getMergedYoutubeViews({ ytStats, ytAnalytics, ytVideos }) {
  const analyticsViews = Number(ytAnalytics?.overview?.views || 0)
  const videoSumViews = (ytVideos || []).reduce((s, v) => s + Number(v.views || 0), 0)
  const channelViews = Number(ytStats?.views || 0)
  return Math.max(analyticsViews, videoSumViews, channelViews)
}
