import { useState } from "react"
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
    try {
      const res = await fetch(API_ENDPOINTS.plannerAiDetail, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: entry.content, platformLabel: plat })
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
