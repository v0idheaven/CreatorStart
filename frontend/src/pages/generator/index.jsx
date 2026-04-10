import { useState } from "react"
import { Sparkles, CalendarDays } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { API_ENDPOINTS } from "../../constants/api"
import { CONFIG, SIDEBAR_W, PAGE_PAD, LEFT_W, GAP, HEADER_H } from "./generatorConfig"
import GeneratorForm from "./GeneratorForm"
import ResultCard from "./ResultCard"
import AddToPlannerModal from "./AddToPlannerModal"

export default function ContentGenerator() {
  const platform = localStorage.getItem("platform") || "both"
  const cfg = CONFIG[platform] || CONFIG.both
  const { color, label, formats, goals, tones, resultKeys, resultLabels } = cfg

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [showPlannerModal, setShowPlannerModal] = useState(false)
  const [lastPayload, setLastPayload] = useState(null)

  async function handleGenerate(fields) {
    const { format, niche, goal, tone, topic, rawFormat, rawNiche, rawGoal, rawTone, customFormat, customNiche, customGoal, customTone } = fields

    if (!rawFormat || !rawNiche || !rawGoal || !rawTone) { setError("Please fill all fields before generating."); return }
    if (rawFormat === "Other" && !customFormat) { setError("Please enter a custom format."); return }
    if (rawNiche === "Other" && !customNiche) { setError("Please enter a custom niche."); return }
    if (rawGoal === "Other" && !customGoal) { setError("Please enter a custom goal."); return }
    if (rawTone === "Other" && !customTone) { setError("Please enter a custom tone."); return }

    const payload = { platform, format, niche, goal, tone, topic, outputType: fields.outputType || "full_script" }
    setLastPayload(payload)
    setError(""); setLoading(true); setResult(null)

    try {
      const res = await fetch(API_ENDPOINTS.contentGenerator, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to generate content")
      if (!data?.data || typeof data.data !== "object") throw new Error("Invalid response from AI")
      setResult(data.data)
    } catch (err) {
      setError(err.message || "Failed to generate content")
    }
    setLoading(false)
  }

  async function handleRegenerate() {
    if (!lastPayload) return
    setError(""); setLoading(true); setResult(null)
    try {
      const res = await fetch(API_ENDPOINTS.contentGenerator, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastPayload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed")
      setResult(data.data)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="generator-header" style={{ left: `${SIDEBAR_W}px`, height: `${HEADER_H}px`, padding: `24px ${PAGE_PAD}px 0` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
          <p style={{ fontSize: "11px", color, textTransform: "uppercase", letterSpacing: "2px", margin: 0, fontWeight: "600" }}>{label}</p>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Content Generator</h1>
        <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>
          {platform === "youtube" && "Generate titles, hooks, scripts & descriptions for your videos."}
          {platform === "instagram" && "Generate captions, hooks, hashtags & reel concepts."}
          {platform === "both" && "Generate hooks, outlines & captions for your content."}
        </p>
      </div>

      <main style={{ marginLeft: `${SIDEBAR_W}px`, flex: 1, paddingTop: `${HEADER_H + 32}px`, paddingBottom: "48px", paddingLeft: `${PAGE_PAD}px`, paddingRight: `${PAGE_PAD}px`, boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: `${GAP}px`, alignItems: "flex-start" }}>
          <div style={{ width: `${LEFT_W}px`, flexShrink: 0 }} />

          <div className="generator-left-panel" style={{ top: `${HEADER_H + 32}px`, left: `${SIDEBAR_W + PAGE_PAD}px`, width: `${LEFT_W}px`, maxHeight: `calc(100vh - ${HEADER_H + 56}px)` }}>
            <GeneratorForm formats={formats} goals={goals} tones={tones} color={color} onGenerate={handleGenerate} loading={loading} error={error} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {!result && !loading && (
              <div className="generator-empty">
                <Sparkles size={32} color="var(--dim)" style={{ marginBottom: "16px" }} />
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>Ready to generate</p>
                <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Fill in the details and click Generate.</p>
              </div>
            )}
            {loading && (
              <div className="generator-empty">
                <div className="spinner spinner-md" />
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>Generating your content ideas...</p>
              </div>
            )}
            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.entries(result).map(([key, value]) => value && (
                  <ResultCard key={key} label={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} content={value} accentColor={color} />
                ))}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-ghost" onClick={handleRegenerate} style={{ borderColor: color + "50" }}>Regenerate ↻</button>
                  <button onClick={() => setShowPlannerModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "9px", border: `1px solid ${color}50`, background: color + "12", color, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    <CalendarDays size={14} /> Add to Planner
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showPlannerModal && <AddToPlannerModal result={result} color={color} onClose={() => setShowPlannerModal(false)} />}
    </div>
  )
}
