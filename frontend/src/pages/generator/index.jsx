import { useState } from "react"
import { Sparkles, CalendarDays, RotateCcw, Download } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { API_ENDPOINTS } from "../../constants/api"
import { apiFetch } from "../../utils/api"
import { CONFIG } from "./generatorConfig"
import GeneratorForm from "./GeneratorForm"
import ResultCard from "./ResultCard"
import AddToPlannerModal from "./AddToPlannerModal"
import GenerationHistory, { saveToHistory } from "./GenerationHistory"

const LABEL_MAP = {
  title: "Video Title", hook: "Hook", script: "Full Script", outline: "Outline",
  description: "Description", tags: "Tags", caption: "Caption", hashtags: "Hashtags",
  cta: "Call to Action", points: "Key Points", tip: "Pro Tip", angle: "Angle", reelIdea: "Reel Concept",
}

export default function ContentGenerator() {
  const platform = localStorage.getItem("platform") || "both"
  const cfg = CONFIG[platform] || CONFIG.both
  const { color, label, formats, goals, tones } = cfg

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [showPlannerModal, setShowPlannerModal] = useState(false)
  const [lastPayload, setLastPayload] = useState(null)
  const [lastFields, setLastFields] = useState(null)

  async function callAPI(payload) {
    const res = await apiFetch(API_ENDPOINTS.contentGenerator, { method: "POST", body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || "Failed to generate")
    if (!data?.data || typeof data.data !== "object") throw new Error("Invalid AI response")
    return data.data
  }

  async function handleGenerate(fields) {
    const { rawFormat, rawNiche, rawGoal, rawTone, customFormat, customNiche, customGoal, customTone } = fields
    if (!rawFormat || !rawNiche || !rawGoal || !rawTone) { setError("Please fill all fields."); return }
    if (rawFormat === "Other" && !customFormat) { setError("Enter a custom format."); return }
    if (rawNiche === "Other" && !customNiche) { setError("Enter a custom niche."); return }
    if (rawGoal === "Other" && !customGoal) { setError("Enter a custom goal."); return }
    if (rawTone === "Other" && !customTone) { setError("Enter a custom tone."); return }
    const payload = { platform, format: fields.format, niche: fields.niche, goal: fields.goal, tone: fields.tone, topic: fields.topic, outputType: fields.outputType || "full_script" }
    setLastPayload(payload); setLastFields(fields)
    setError(""); setLoading(true); setResult(null)
    try { const r = await callAPI(payload); setResult(r); saveToHistory(fields, r) } catch (e) { setError(e.message) }
    setLoading(false)
  }

  async function handleRegenerate() {
    if (!lastPayload) return
    setError(""); setLoading(true); setResult(null)
    try { setResult(await callAPI(lastPayload)) } catch (e) { setError(e.message) }
    setLoading(false)
  }

  function handleDownload() {
    if (!result) return
    const text = Object.entries(result).map(([k, v]) => `=== ${LABEL_MAP[k] || k.toUpperCase()} ===\n${v}`).join("\n\n")
    const blob = new Blob([text], { type: "text/plain" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `content-${Date.now()}.txt`; a.click()
  }

  const resultEntries = result ? Object.entries(result).filter(([, v]) => v) : []

  return (
    <div className="gen-root">
      <Sidebar />
      <div className="gen-wrap">

        {/* Header */}
        <div className="gen-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
              <p style={{ fontSize: "11px", color, textTransform: "uppercase", letterSpacing: "2px", margin: 0, fontWeight: "600" }}>{label}</p>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>Content Generator</h1>
          </div>
          {result && (
            <div className="gen-actions">
              <button onClick={handleRegenerate} disabled={loading} className="gen-btn-outline" style={{ color, borderColor: color + "40" }}>
                <RotateCcw size={12} /> Regenerate
              </button>
              <button onClick={handleDownload} className="gen-btn-outline">
                <Download size={12} /> Save
              </button>
              <button onClick={() => setShowPlannerModal(true)} className="gen-btn-fill" style={{ background: color }}>
                <CalendarDays size={12} /> Add to Planner
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="gen-body">
          {/* Form panel */}
          <div className="gen-form-panel">
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" }}>
              <GeneratorForm formats={formats} goals={goals} tones={tones} color={color} onGenerate={handleGenerate} loading={loading} error={error} />
            </div>
            <GenerationHistory accentColor={color} onLoad={item => { setResult(item.result); setLastFields(item.fields) }} />
          </div>

          {/* Results panel */}
          <div className="gen-results-panel">
            {!result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px", textAlign: "center" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: color + "12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={26} color={color} />
                </div>
                <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: 0 }}>Ready to create</p>
                <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0, maxWidth: "260px", lineHeight: "1.6" }}>Fill the form and click Generate.</p>
              </div>
            )}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `3px solid ${color}25`, borderTop: `3px solid ${color}`, animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>AI is writing your content...</p>
              </div>
            )}
            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {lastFields && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "2px" }}>
                    {[lastFields.format, lastFields.niche, lastFields.goal, lastFields.tone].filter(Boolean).map(tag => (
                      <span key={tag} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: color + "12", color, border: `1px solid ${color}25` }}>{tag}</span>
                    ))}
                    {lastFields.topic && <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: "var(--border)", color: "var(--muted)" }}>"{lastFields.topic}"</span>}
                  </div>
                )}
                {resultEntries.map(([key, value]) => (
                  <ResultCard key={key} label={LABEL_MAP[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} content={value} accentColor={color} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPlannerModal && <AddToPlannerModal result={result} color={color} onClose={() => setShowPlannerModal(false)} />}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .gen-root { display: flex; background: var(--bg); min-height: 100vh; }
        .gen-wrap { margin-left: 72px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
        .gen-header { padding: 20px 40px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .gen-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .gen-btn-outline { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; cursor: pointer; }
        .gen-btn-fill { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; border: none; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
        .gen-body { display: flex; gap: 24px; padding: 24px 40px 48px; align-items: flex-start; flex: 1; }
        .gen-form-panel { width: 300px; flex-shrink: 0; position: sticky; top: 24px; max-height: calc(100vh - 80px); overflow-y: auto; }
        .gen-results-panel { flex: 1; min-width: 0; }

        @media (max-width: 768px) {
          .gen-wrap { margin-left: 0; }
          .gen-header { padding: 16px; }
          .gen-body { flex-direction: column; padding: 16px 16px 80px; gap: 16px; }
          .gen-form-panel { width: 100%; position: static; max-height: none; }
          .gen-results-panel { width: 100%; }
          .gen-actions { width: 100%; }
          .gen-btn-outline, .gen-btn-fill { flex: 1; justify-content: center; font-size: 11px; padding: 7px 8px; }
        }
      `}</style>
    </div>
  )
}
