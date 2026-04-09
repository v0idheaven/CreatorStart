// Platform-specific config for content generator
export const CONFIG = {
  youtube: {
    color: "#ff4444", label: "YouTube",
    formats: ["Video", "Short", "Live", "Other"],
    goals: ["Grow Subscribers", "Increase Watch Time", "Drive Traffic", "Build Authority", "Entertain", "Other"],
    tones: ["Casual", "Educational", "Entertaining", "Inspirational", "Professional", "Other"],
    resultKeys: ["title", "hook", "outline", "description", "tags"],
    resultLabels: { title: "Video Title", hook: "Hook (First 30s)", outline: "Script Outline", description: "Description", tags: "Tags" },
  },
  instagram: {
    color: "#c13584", label: "Instagram",
    formats: ["Reel", "Carousel", "Post", "Story", "Other"],
    goals: ["Grow Followers", "Increase Engagement", "Drive Sales", "Build Community", "Entertain", "Other"],
    tones: ["Casual", "Aesthetic", "Motivational", "Humorous", "Educational", "Other"],
    resultKeys: ["hook", "caption", "hashtags", "cta", "reelIdea"],
    resultLabels: { hook: "Hook", caption: "Caption", hashtags: "Hashtags", cta: "Call to Action", reelIdea: "Reel Concept" },
  },
  both: {
    color: "#818cf8", label: "All Platforms",
    formats: ["Video", "Short", "Reel", "Carousel", "Post", "Blog Post", "Other"],
    goals: ["Grow Audience", "Increase Engagement", "Drive Sales", "Build Authority", "Entertain", "Other"],
    tones: ["Casual", "Professional", "Humorous", "Inspirational", "Educational", "Other"],
    resultKeys: ["hook", "angle", "outline", "caption", "tip"],
    resultLabels: { hook: "Hook", angle: "Angle", outline: "Outline", caption: "Caption", tip: "Pro Tip" },
  },
}

export const NICHES = ["Tech", "Finance", "Fitness", "Food", "Travel", "Gaming", "Education", "Lifestyle", "Business", "Entertainment", "Other"]

export const SIDEBAR_W = 72
export const PAGE_PAD = 48
export const LEFT_W = 300
export const GAP = 32
export const HEADER_H = 116
