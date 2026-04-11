export const CONFIG = {
  youtube: {
    color: "#ff4444", label: "YouTube",
    formats: ["Video", "Short", "Live", "Podcast", "Other"],
    goals: ["Grow Subscribers", "Increase Watch Time", "Drive Traffic", "Build Authority", "Entertain", "Educate", "Other"],
    tones: ["Casual", "Educational", "Entertaining", "Inspirational", "Professional", "Humorous", "Storytelling", "Other"],
  },
  instagram: {
    color: "#c13584", label: "Instagram",
    formats: ["Reel", "Carousel", "Post", "Story", "Other"],
    goals: ["Grow Followers", "Increase Engagement", "Drive Sales", "Build Community", "Entertain", "Educate", "Other"],
    tones: ["Casual", "Aesthetic", "Motivational", "Humorous", "Educational", "Storytelling", "Other"],
  },
  both: {
    color: "#818cf8", label: "All Platforms",
    formats: ["Video", "Short", "Reel", "Carousel", "Post", "Blog Post", "Other"],
    goals: ["Grow Audience", "Increase Engagement", "Drive Sales", "Build Authority", "Entertain", "Educate", "Other"],
    tones: ["Casual", "Professional", "Humorous", "Inspirational", "Educational", "Storytelling", "Other"],
  },
}

export const NICHES = [
  "Tech", "Finance", "Fitness", "Food", "Travel", "Gaming",
  "Education", "Lifestyle", "Business", "Entertainment",
  "Health", "Beauty", "Fashion", "Sports", "Motivation", "Other"
]

export const OUTPUT_TYPES = [
  { id: "full_script", label: "Full Script", desc: "Complete word-for-word script" },
  { id: "bullet_points", label: "Key Points", desc: "Main talking points in detail" },
  { id: "hook_only", label: "Hook + CTA", desc: "3 hooks & 3 call-to-actions" },
  { id: "outline", label: "Outline", desc: "Structured outline with timing" },
  { id: "caption", label: "Caption + Hashtags", desc: "Ready-to-post caption" },
]

export const SIDEBAR_W = 72
export const PAGE_PAD = 40
export const HEADER_H = 100
