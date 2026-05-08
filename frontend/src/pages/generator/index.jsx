import { useState, useEffect, useRef } from "react"
import { Sparkles, CalendarDays, RotateCcw, Download, History, ChevronDown, FileText, Zap, List, AlignLeft, Hash, RefreshCw } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { API_ENDPOINTS } from "../../constants/api"
import { apiFetch } from "../../utils/api"
import { CONFIG } from "./generatorConfig"
import GeneratorForm from "./GeneratorForm"
import ResultCard from "./ResultCard"
import AddToPlannerModal from "./AddToPlannerModal"
import GenerationHistory from "./GenerationHistory"
import { saveToHistory, loadHistory, writeHistory, clearHistory } from "./historyStorage"

const LABEL_MAP = {
  title: "Video Title", hook: "Hook", script: "Full Script", outline: "Outline",
  description: "Description", tags: "Tags", caption: "Caption", hashtags: "Hashtags",
  cta: "Call to Action", points: "Key Points", tip: "Pro Tip", angle: "Angle", reelIdea: "Reel Concept",
}

const OUTPUT_ICONS = {
  "Full Script": FileText,
  "Key Points": List,
  "Hook + CTA": Zap,
  "Outline": AlignLeft,
  "Caption + Hashtags": Hash,
}

const OUTPUT_TYPES_INFO = [
  { label: "Full Script", desc: "Complete word-for-word script ready to record" },
  { label: "Key Points", desc: "6-8 detailed talking points to speak from" },
  { label: "Hook + CTA", desc: "3 opening hooks and 3 call-to-actions" },
  { label: "Outline", desc: "Structured outline with sections and timing" },
  { label: "Caption + Hashtags", desc: "Ready-to-post caption with 30 hashtags" },
]

const TIPS = [
  "Add a specific topic for more targeted content",
  "Choose your actual audience for personalized output",
  "Use 'Key Message' to make your main point clear",
  "Try different tones — Casual vs Professional gives very different results",
  "Regenerate 2-3 times to get the best version",
]

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
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState(() => loadHistory())

  // Quick ideas state
  const [quickIdeas, setQuickIdeas] = useState([
    { topic: "Morning routine for productivity", format: "Video", niche: "Lifestyle" },
    { topic: "5 AI tools every creator needs", format: "Short", niche: "Tech" },
    { topic: "How I grew to 1K subscribers", format: "Video", niche: "Education" },
    { topic: "Budget meal prep for the week", format: "Reel", niche: "Food" },
  ])
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const formRef = useRef(null)

  async function fetchViralIdeas() {
    setLoadingIdeas(true)
    try {
      const res = await apiFetch(API_ENDPOINTS.contentGenerator, {
        method: "POST",
        body: JSON.stringify({
          platform, format: "Video", niche: "General", goal: "Grow Audience",
          tone: "Casual", topic: "viral trending content ideas",
          outputType: "hook_only",
          refinement: `Give me 4 viral content topic ideas for ${platform} creators. Return ONLY a JSON array: [{"topic":"...","format":"Video/Short/Reel","niche":"Tech/Lifestyle/etc"},...]`
        })
      })
      const data = await res.json()
      // Try to parse ideas from response
      const raw = data?.data?.hook || data?.data?.script || ""
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed) && parsed.length > 0) setQuickIdeas(parsed.slice(0, 4))
      }
    } catch { /* keep defaults */ }
    setLoadingIdeas(false)
  }

  // Ref to trigger form fill from outside
  const fillFormRef = useRef(null)

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
    try { const r = await callAPI(payload); setResult(r); saveToHistory(fields, r); setHistory(loadHistory()) } catch (e) { setError(e.message) }
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
          <div className="gen-actions">
            {/* History button in header */}
            {history.length > 0 && (
              <button onClick={() => setShowHistory(p => !p)} className="gen-btn-outline" style={{ color: showHistory ? color : "var(--muted)", borderColor: showHistory ? color + "40" : "var(--border)" }}>
                <History size={12} /> History ({history.length})
              </button>
            )}
            {result && (
              <>
                <button onClick={handleRegenerate} disabled={loading} className="gen-btn-outline" style={{ color, borderColor: color + "40" }}>
                  <RotateCcw size={12} /> Regenerate
                </button>
                <button onClick={handleDownload} className="gen-btn-outline">
                  <Download size={12} /> Save
                </button>
                <button onClick={() => setShowPlannerModal(true)} className="gen-btn-fill" style={{ background: color }}>
                  <CalendarDays size={12} /> Add to Planner
                </button>
              </>
            )}
          </div>
        </div>

        {/* History slide-in panel from right */}
        {showHistory && (
          <>
            <div onClick={() => setShowHistory(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 60 }} />
            <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 90vw)", background: "var(--card)", borderLeft: "1px solid var(--border)", zIndex: 61, display: "flex", flexDirection: "column", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--card)", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <History size={15} color={color} />
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)" }}>Generation History</span>
                  <span style={{ fontSize: "11px", color: "var(--dim)", background: "var(--border)", padding: "1px 7px", borderRadius: "10px" }}>{history.length}</span>
                </div>
                <button onClick={() => setShowHistory(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex", padding: "4px" }}>
                  <ChevronDown size={18} style={{ transform: "rotate(-90deg)" }} />
                </button>
              </div>
              <div style={{ padding: "16px", flex: 1 }}>
                {history.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "var(--dim)", textAlign: "center", marginTop: "40px" }}>No history yet. Generate some content first.</p>
                ) : (
                  <GenerationHistory
                    accentColor={color}
                    onLoad={item => { setResult(item.result); setLastFields(item.fields); setShowHistory(false) }}
                    forceOpen
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Body */}
        <div className="gen-body">
          {/* Form panel */}
          <div className="gen-form-panel">
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" }}>
              <GeneratorForm
                ref={fillFormRef}
                formats={formats} goals={goals} tones={tones} color={color}
                onGenerate={handleGenerate} loading={loading} error={error}
              />
            </div>
          </div>

          {/* Results panel */}
          <div className="gen-results-panel">
            {!result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Quick start ideas */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Quick Start Ideas</p>
                    <button onClick={fetchViralIdeas} disabled={loadingIdeas}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "11px", cursor: "pointer" }}>
                      <RefreshCw size={10} className={loadingIdeas ? "spin" : ""} />
                      {loadingIdeas ? "Loading..." : "Refresh"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {quickIdeas.map((idea, i) => (
                      <div key={i}
                        onClick={() => {
                          // Directly generate content from this idea
                          const platform_ = localStorage.getItem("platform") || "both"
                          const cfg_ = CONFIG[platform_] || CONFIG.both
                          const format_ = cfg_.formats.includes(idea.format) ? idea.format : cfg_.formats[0]
                          const niche_ = idea.niche || "Tech"
                          const goal_ = cfg_.goals[0]
                          const tone_ = "Casual"
                          const fields = {
                            format: format_, niche: niche_, goal: goal_, tone: tone_,
                            topic: idea.topic, outputType: "full_script",
                            rawFormat: format_, rawNiche: niche_, rawGoal: goal_, rawTone: tone_,
                            customFormat: "", customNiche: "", customGoal: "", customTone: "",
                          }
                          handleGenerate(fields)
                          // Also fill the form
                          window.dispatchEvent(new CustomEvent("fillGeneratorTopic", { detail: idea }))
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = color + "60"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                        <Sparkles size={13} color={color} style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "13px", color: "var(--text)", margin: "0 0 2px", fontWeight: "500" }}>{idea.topic}</p>
                          <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{idea.format} · {idea.niche}</p>
                        </div>
                        <span style={{ fontSize: "10px", color, background: color + "15", padding: "2px 8px", borderRadius: "10px", fontWeight: "600", flexShrink: 0 }}>Generate</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output types */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 14px" }}>What you can generate</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {OUTPUT_TYPES_INFO.map(({ label: lbl, desc }) => {
                      const Icon = OUTPUT_ICONS[lbl] || FileText
                      return (
                        <div key={lbl} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={13} color={color} />
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>{lbl}</p>
                            <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0, lineHeight: "1.4" }}>{desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 14px" }}>Tips for better results</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {TIPS.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, marginTop: "6px", flexShrink: 0 }} />
                        <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

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
        .gen-header { padding: 20px 40px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; position: sticky; top: 0; background: var(--bg); z-index: 10; }
        .gen-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .gen-btn-outline { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; cursor: pointer; }
        .gen-btn-fill { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; border: none; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
        .gen-body { display: flex; gap: 24px; padding: 24px 40px 48px; align-items: flex-start; flex: 1; }
        .gen-form-panel { width: 300px; flex-shrink: 0; position: fixed; top: 110px; left: calc(72px + 40px); bottom: 0; overflow-y: auto; padding-bottom: 24px; }
        .gen-results-panel { flex: 1; min-width: 0; margin-left: 324px; }
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
