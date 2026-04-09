export const features = [
  ["01", "AI Content Generator", "Generate hooks, scripts, captions and CTAs tailored to your platform and niche."],
  ["02", "30-Day Planner", "AI builds your full month content calendar. Edit any day, track your streak."],
  ["03", "Platform Dashboard", "YouTube Studio-style analytics for YT creators. Instagram-style for IG creators."],
  ["04", "Posting Streak", "GitHub-style contribution grid tracks your consistency day by day."],
  ["05", "Multi-Platform", "Manage YouTube, Instagram, or both from one unified workspace."],
  ["06", "Secure & Private", "JWT auth, refresh tokens, and protected routes keep your data safe."],
]

export const stats = [
  ["30", "Days planned"],
  ["3x", "Faster content"],
  ["100%", "Free to start"],
  ["2", "Platforms"],
]

export const plans = [
  ["Starter", "Free", "Plan content, use AI generator, track your streak.", "Get started", false],
  ["Creator", "Free", "Full 30-day planner, AI briefs, multi-platform dashboard.", "Start creating", true],
  ["Pro", "Soon", "Analytics integrations, team workspace, and more.", "See roadmap", false],
]

export const PLATFORM_DATA = {
  youtube: {
    color: "#ff4444", bg: "#ff444415", label: "YouTube Studio",
    stats: [["2.4K","Subscribers"],["48.2K","Total Views"],["18","Videos"],["1.2K hrs","Watch Time"]],
    statColors: ["#ff4444","#60a5fa","#818cf8","#4ade80"],
    recent: [
      { title: "How to grow on YouTube in 2025", type: "Video", views: "12.4K" },
      { title: "Morning routine vlog", type: "Short", views: "31K" },
      { title: "My editing workflow", type: "Video", views: "—" },
    ]
  },
  instagram: {
    color: "#c13584", bg: "#c1358415", label: "Instagram Analytics",
    stats: [["5.8K","Followers"],["124K","Total Reach"],["34","Posts"],["1.2K","Avg. Likes"]],
    statColors: ["#c13584","#60a5fa","#818cf8","#f472b6"],
    recent: [
      { title: "Behind the scenes reel", type: "Reel", views: "31K" },
      { title: "Top 10 finance tips", type: "Carousel", views: "8.2K" },
      { title: "Morning routine aesthetic", type: "Post", views: "—" },
    ]
  },
  both: {
    color: "#818cf8", bg: "#818cf815", label: "Both Platforms",
    stats: [["24","Total Posts"],["8","Planned"],["12","Completed"],["4","Drafts"]],
    statColors: ["#818cf8","#60a5fa","#4ade80","#f472b6"],
    recent: [
      { title: "How to grow on YouTube in 2025", type: "YT · Video", views: "12.4K" },
      { title: "Behind the scenes reel", type: "IG · Reel", views: "31K" },
      { title: "AI tools for creators", type: "Both", views: "—" },
    ]
  }
}
