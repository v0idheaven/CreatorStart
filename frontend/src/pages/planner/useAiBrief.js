import { useState } from "react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

// Handles AI content brief generation for a planner entry
export default function useAiBrief() {
  const [aiDetail, setAiDetail] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  async function generateBrief(entry) {
    if (!entry.content) return
    setAiDetail(null); setAiError(""); setAiLoading(true)
    const plat = entry.platform === "youtube" ? "YouTube" : entry.platform === "instagram" ? "Instagram" : "YouTube/Instagram"
    // Include content type for more specific brief (e.g. "YouTube Short" vs "YouTube Video")
    const typeMap = { video: "Video", short: "Short", live: "Live", reel: "Reel", post: "Post", carousel: "Carousel", story: "Story" }
    const typeLabel = entry.contentType ? typeMap[entry.contentType] : ""
    const platformLabel = typeLabel ? `${plat} ${typeLabel}` : plat
    try {
      const res = await apiFetch(API_ENDPOINTS.plannerAiDetail, {
        method: "POST",
        body: JSON.stringify({ content: entry.content, platformLabel })
      })
      const data = await res.json()
      if (!res.ok) { setAiError(data.message || "API error"); setAiLoading(false); return }
      if (!data?.data) { setAiError("Empty response."); setAiLoading(false); return }
      setAiDetail(data.data)
    } catch (e) { setAiError("Network error: " + e.message) }
    setAiLoading(false)
  }

  function clearBrief() { setAiDetail(null); setAiError("") }

  return { aiDetail, aiLoading, aiError, generateBrief, clearBrief }
}
