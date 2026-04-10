export const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#2d8fa3" }

export const PC = {
  youtube: { color: "#ff4444", bg: "#ff444418", label: "YT" },
  instagram: { color: "#c13584", bg: "#c1358418", label: "IG" },
  both: { color: "#2d8fa3", bg: "#2d8fa318", label: "Both" },
}

// Content types per platform with colors
export const CONTENT_TYPES = {
  youtube: [
    { id: "video", label: "Video", color: "#ff4444", bg: "#ff444418" },
    { id: "short", label: "Short", color: "#06b6d4", bg: "#06b6d418" },
    { id: "live", label: "Live", color: "#f59e0b", bg: "#f59e0b18" },
  ],
  instagram: [
    { id: "reel", label: "Reel", color: "#c13584", bg: "#c1358418" },
    { id: "post", label: "Post", color: "#2d8fa3", bg: "#2d8fa318" },
    { id: "carousel", label: "Carousel", color: "#4ade80", bg: "#4ade8018" },
    { id: "story", label: "Story", color: "#f97316", bg: "#f9731618" },
  ],
  both: [
    { id: "video", label: "Video", color: "#ff4444", bg: "#ff444418" },
    { id: "short", label: "Short", color: "#06b6d4", bg: "#06b6d418" },
    { id: "reel", label: "Reel", color: "#c13584", bg: "#c1358418" },
    { id: "post", label: "Post", color: "#2d8fa3", bg: "#2d8fa318" },
    { id: "carousel", label: "Carousel", color: "#4ade80", bg: "#4ade8018" },
  ],
}

export function getContentType(platform, typeId) {
  const types = CONTENT_TYPES[platform] || CONTENT_TYPES.both
  return types.find(t => t.id === typeId) || types[0]
}

export const GOALS = [
  { id: "followers", label: "Grow followers fast", desc: "Content designed to attract new people" },
  { id: "engagement", label: "Boost engagement", desc: "Get more likes, comments & shares" },
  { id: "viral", label: "Go viral", desc: "Trending, shareable content ideas" },
  { id: "authority", label: "Build authority", desc: "Become the go-to expert in your space" },
  { id: "sales", label: "Drive sales / leads", desc: "Content that converts viewers to customers" },
  { id: "community", label: "Build a community", desc: "Create loyal fans who keep coming back" },
]

export const TOPICS = [
  { id: "tech", label: "Tech & AI" },
  { id: "finance", label: "Finance & Money" },
  { id: "fitness", label: "Fitness & Health" },
  { id: "food", label: "Food & Cooking" },
  { id: "travel", label: "Travel & Lifestyle" },
  { id: "business", label: "Business & Startup" },
  { id: "education", label: "Education & Skills" },
  { id: "entertainment", label: "Entertainment" },
  { id: "gaming", label: "Gaming" },
  { id: "fashion", label: "Fashion & Beauty" },
]

export const FREQUENCIES = [
  { id: "daily", label: "Every day", desc: "Maximum growth mode" },
  { id: "alt", label: "Every 2 days", desc: "Balanced & sustainable" },
  { id: "weekdays", label: "Weekdays only", desc: "Work-life balance" },
]

export const STEP_TITLES = [
  { title: "What's your main goal?", sub: "This shapes the entire content strategy for your plan." },
  { title: "What do you create content about?", sub: "Pick the topic that best describes your channel or profile." },
  { title: "How often can you post?", sub: "Be realistic - consistency beats frequency." },
  { title: "Where do you want to focus more?", sub: "We'll assign more content days to your priority platform." },
]

export const FOCUS_OPTIONS = [
  { id: "youtube", label: "More YouTube", desc: "70% YouTube content, 30% Instagram", color: "#ff4444" },
  { id: "instagram", label: "More Instagram", desc: "70% Instagram content, 30% YouTube", color: "#c13584" },
  { id: "both", label: "Equal split", desc: "Balanced content across both platforms", color: "#2d8fa3" },
]
