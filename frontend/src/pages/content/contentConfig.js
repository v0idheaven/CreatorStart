export const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
export const YT_TYPES = ["Video", "Short", "Live"]
export const IG_TYPES = ["Reel", "Carousel", "Post", "Story"]
export const BOTH_TYPES = ["Video", "Short", "Reel", "Carousel", "Post", "Story", "Live"]
export const STATUSES = ["Idea", "Scripting", "Filming", "Editing", "Published"]
export const STATUS_COLORS = { Idea: "#818cf8", Scripting: "#f59e0b", Filming: "#f97316", Editing: "#06b6d4", Published: "#4ade80" }
export const EMPTY_FORM = { title: "", type: "", status: "Idea", platform: "", views: "", likes: "", comments: "", notes: "", thumbnail: "" }

export function getStorageKey(platform) { return `content_data_${platform}` }
export function loadContent(platform) { return JSON.parse(localStorage.getItem(getStorageKey(platform)) || "[]") }
export function saveContent(platform, data) { localStorage.setItem(getStorageKey(platform), JSON.stringify(data)) }
