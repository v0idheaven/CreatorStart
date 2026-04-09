// Toggle this to true to see mock data in analytics
export const MOCK_MODE = true

export const MOCK_YT_STATS = {
  title: "Varun Yadav",
  thumbnail: null,
  subscribers: "12400",
  videos: "48",
  views: "284000",
  channelId: "mock123",
}

export const MOCK_YT_VIDEOS = [
  { id: "1", title: "How I grew my YouTube channel to 10K in 3 months", type: "Video", views: "42300", likes: "2100", comments: "187", publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(), thumbnail: "https://picsum.photos/seed/v1/120/68", url: "#" },
  { id: "2", title: "Morning routine that changed my life", type: "Short", views: "91000", likes: "8400", comments: "432", publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(), thumbnail: "https://picsum.photos/seed/v2/120/68", url: "#" },
  { id: "3", title: "Top 10 AI tools for content creators 2026", type: "Video", views: "28700", likes: "1340", comments: "98", publishedAt: new Date(Date.now() - 9 * 86400000).toISOString(), thumbnail: "https://picsum.photos/seed/v3/120/68", url: "#" },
  { id: "4", title: "My editing workflow (full breakdown)", type: "Video", views: "19200", likes: "870", comments: "64", publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(), thumbnail: "https://picsum.photos/seed/v4/120/68", url: "#" },
  { id: "5", title: "5 mistakes every new creator makes", type: "Short", views: "54000", likes: "3200", comments: "211", publishedAt: new Date(Date.now() - 18 * 86400000).toISOString(), thumbnail: "https://picsum.photos/seed/v5/120/68", url: "#" },
]

export const MOCK_YT_ANALYTICS = {
  overview: {
    views: 48200,
    estimatedMinutesWatched: 142000,
    averageViewDuration: 187,
    subscribersGained: 840,
    subscribersLost: 32,
    likes: 4200,
    comments: 312,
    impressions: 182000,
    impressionClickThroughRate: 0.064,
  },
  daily: Array.from({ length: 28 }, (_, i) => {
    const date = new Date(Date.now() - (27 - i) * 86400000)
    return {
      day: date.toISOString().split("T")[0],
      views: Math.floor(800 + Math.random() * 2400),
      estimatedMinutesWatched: Math.floor(2000 + Math.random() * 6000),
    }
  })
}
