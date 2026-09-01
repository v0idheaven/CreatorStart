import { useState } from "react"
import { Sparkles, CalendarDays, RotateCcw, Download, History, ChevronDown, FileText, Zap, List, AlignLeft, Hash, RefreshCw, Copy, Check, Star, Wand2, Users } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { API_ENDPOINTS } from "../../constants/api"
import { apiFetch } from "../../utils/api"
import { CONFIG } from "./generatorConfig"
import GeneratorForm from "./GeneratorForm"
import ResultCard from "./ResultCard"
import AddToPlannerModal from "./AddToPlannerModal"
import GenerationHistory from "./GenerationHistory"
import { saveToHistory, loadHistory } from "./historyStorage"

const LABEL_MAP = {
  title: "Video Title", hook: "Hook", script: "Full Script", outline: "Outline",
  description: "Description", tags: "Tags", caption: "Caption", hashtags: "Hashtags",
  cta: "Call to Action", points: "Key Points", tip: "Pro Tip", angle: "Angle", reelIdea: "Reel Concept",
  casual: "Casual Tone", professional: "Professional Tone", funny: "Funny Tone",
}

const OUTPUT_ICONS = {
  "Full Script": FileText, "Key Points": List, "Hook + CTA": Zap,
  "Outline": AlignLeft, "Caption + Hashtags": Hash,
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
  "Fill in Audience for personalized output",
  "Try different tones — Casual vs Professional gives very different results",
  "Use Refine after generating to tweak the result",
  "Regenerate 2-3 times to get the best version",
]

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color }}>{value}/10</span>
      </div>
      <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px" }}>
        <div style={{ height: "100%", width: `${value * 10}%`, background: color, borderRadius: "2px", transition: "width 0.6s ease" }} />
      </div>
    </div>
  )
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
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState(() => loadHistory())

  // New feature states
  const [score, setScore] = useState(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [hooks, setHooks] = useState(null)
  const [hooksLoading, setHooksLoading] = useState(false)
  const [toneVariants, setToneVariants] = useState(null)
  const [toneLoading, setToneLoading] = useState(false)
  const [refineInput, setRefineInput] = useState("")
  const [refineLoading, setRefineLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("result") // result | hooks | tones | score

  // Quick ideas
  const [quickIdeas, setQuickIdeas] = useState([
    { topic: "Morning routine for productivity", format: "Video", niche: "Lifestyle" },
    { topic: "5 AI tools every creator needs", format: "Short", niche: "Tech" },
    { topic: "How I grew to 1K subscribers", format: "Video", niche: "Education" },
    { topic: "Budget meal prep for the week", format: "Reel", niche: "Food" },
  ])
  const [loadingIdeas, setLoadingIdeas] = useState(false)

  async function fetchViralIdeas() {
    setLoadingIdeas(true)
    try {
      const res = await apiFetch(API_ENDPOINTS.contentGenerator, {
        method: "POST",
        body: JSON.stringify({
          platform, format: "Video", niche: "General", goal: "Grow Audience",
          tone: "Casual", topic: "viral trending content ideas", outputType: "hook_only",
          refinement: `Give me 4 viral content topic ideas for ${platform} creators. Return ONLY a JSON array: [{"topic":"...","format":"Video/Short/Reel","niche":"Tech/Lifestyle/etc"},...]`
        })
      })
      const data = await res.json()
      const raw = data?.data?.hook || data?.data?.script || ""
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed) && parsed.length > 0) setQuickIdeas(parsed.slice(0, 4))
      }
    } catch { /* keep defaults */ }
    setLoadingIdeas(false)
  }

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
    const payload = {
      platform, format: fields.format, niche: fields.niche, goal: fields.goal,
      tone: fields.tone, topic: fields.topic, outputType: fields.outputType || "full_script",
      audience: fields.audience, length: fields.length
    }
    setLastPayload(payload); setLastFields(fields)
    setError(""); setLoading(true); setResult(null)
    setScore(null); setHooks(null); setToneVariants(null); setRefineInput(""); setActiveTab("result")
    try { const r = await callAPI(payload); setResult(r); saveToHistory(fields, r); setHistory(loadHistory()) } catch (e) { setError(e.message) }
    setLoading(false)
  }

  async function handleRegenerate() {
    if (!lastPayload) return
    setError(""); setLoading(true); setResult(null)
    setScore(null); setHooks(null); setToneVariants(null)
    try { setResult(await callAPI(lastPayload)) } catch (e) { setError(e.message) }
    setLoading(false)
  }

  async function handleRefine() {
    if (!lastPayload || !refineInput.trim()) return
    setRefineLoading(true); setResult(null)
    try {
      const r = await callAPI({ ...lastPayload, refinement: refineInput.trim() })
      setResult(r); setScore(null); setHooks(null); setToneVariants(null); setActiveTab("result")
    } catch (e) { setError(e.message) }
    setRefineLoading(false); setRefineInput("")
  }

  async function handleScore() {
    if (!result) return
    setScoreLoading(true); setActiveTab("score")
    try {
      const content = Object.values(result).filter(Boolean).join("\n\n").slice(0, 1000)
      const res = await apiFetch(API_ENDPOINTS.contentScore, { method: "POST", body: JSON.stringify({ content, platform }) })
      const data = await res.json()
      if (res.ok && data?.data) setScore(data.data)
    } catch { /* silent */ }
    setScoreLoading(false)
  }

  async function handleHooks() {
    if (!lastPayload) return
    setHooksLoading(true); setActiveTab("hooks")
    try {
      const res = await apiFetch(API_ENDPOINTS.contentHooks, {
        method: "POST",
        body: JSON.stringify({ topic: lastPayload.topic || lastPayload.niche, platform, tone: lastPayload.tone, niche: lastPayload.niche })
      })
      const data = await res.json()
      if (res.ok && data?.data?.hooks) setHooks(data.data.hooks)
    } catch { /* silent */ }
    setHooksLoading(false)
  }

  async function handleToneVariants() {
    if (!result) return
    setToneLoading(true); setActiveTab("tones")
    try {
      const content = result.script || result.caption || result.hook || result.points || Object.values(result).filter(Boolean)[0] || ""
      const res = await apiFetch(API_ENDPOINTS.contentTones, { method: "POST", body: JSON.stringify({ content: content.slice(0, 500), platform }) })
      const data = await res.json()
      if (res.ok && data?.data) setToneVariants(data.data)
    } catch { /* silent */ }
    setToneLoading(false)
  }

  function handleCopyAll() {
    if (!result) return
    const text = Object.entries(result).filter(([, v]) => v).map(([k, v]) => `=== ${LABEL_MAP[k] || k.toUpperCase()} ===\n${v}`).join("\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (!result) return
    const text = Object.entries(result).filter(([, v]) => v).map(([k, v]) => `=== ${LABEL_MAP[k] || k.toUpperCase()} ===\n${v}`).join("\n\n")
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
            {history.length > 0 && (
              <button onClick={() => setShowHistory(p => !p)} className="gen-btn-outline" style={{ color: showHistory ? color : "var(--muted)", borderColor: showHistory ? color + "40" : "var(--border)" }}>
                <History size={12} /> History ({history.length})
              </button>
            )}
            {result && (
              <>
                <button onClick={handleCopyAll} className="gen-btn-outline" style={{ color: copied ? "#4ade80" : "var(--muted)" }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied!" : "Copy All"}
                </button>
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

        {/* History panel */}
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
                <GenerationHistory accentColor={color} onLoad={item => { setResult(item.result); setLastFields(item.fields); setShowHistory(false) }} forceOpen />
              </div>
            </div>
          </>
        )}

        {/* Body */}
        <div className="gen-body">
          {/* Form panel */}
          <div className="gen-form-panel">
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" }}>
              <GeneratorForm formats={formats} goals={goals} tones={tones} color={color} onGenerate={handleGenerate} loading={loading} error={error} />
            </div>
          </div>

          {/* Results panel */}
          <div className="gen-results-panel">

            {/* Empty state */}
            {!result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Quick Start Ideas</p>
                    <button onClick={fetchViralIdeas} disabled={loadingIdeas} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "11px", cursor: "pointer" }}>
                      <RefreshCw size={10} className={loadingIdeas ? "spin" : ""} />
                      {loadingIdeas ? "Loading..." : "Refresh"}
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {quickIdeas.map((idea, i) => (
                      <div key={i} onClick={() => {
                        const cfg_ = CONFIG[platform] || CONFIG.both
                        const format_ = cfg_.formats.includes(idea.format) ? idea.format : cfg_.formats[0]
                        handleGenerate({ format: format_, niche: idea.niche || "Tech", goal: cfg_.goals[0], tone: "Casual", topic: idea.topic, outputType: "full_script", rawFormat: format_, rawNiche: idea.niche || "Tech", rawGoal: cfg_.goals[0], rawTone: "Casual", customFormat: "", customNiche: "", customGoal: "", customTone: "", audience: "", length: "" })
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

            {/* Loading */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: `3px solid ${color}25`, borderTop: `3px solid ${color}`, animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>AI is writing your content...</p>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                {/* Tags */}
                {lastFields && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[lastFields.format, lastFields.niche, lastFields.goal, lastFields.tone].filter(Boolean).map(tag => (
                      <span key={tag} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: color + "12", color, border: `1px solid ${color}25` }}>{tag}</span>
                    ))}
                    {lastFields.topic && <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: "var(--border)", color: "var(--muted)" }}>"{lastFields.topic}"</span>}
                    {lastFields.audience && <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: "var(--border)", color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}><Users size={10} />{lastFields.audience}</span>}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => setActiveTab("result")} style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${activeTab === "result" ? color : "var(--border)"}`, background: activeTab === "result" ? color + "15" : "transparent", color: activeTab === "result" ? color : "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    <FileText size={12} /> Result
                  </button>
                  <button onClick={handleScore} style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${activeTab === "score" ? "#f59e0b" : "var(--border)"}`, background: activeTab === "score" ? "#f59e0b15" : "transparent", color: activeTab === "score" ? "#f59e0b" : "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {scoreLoading ? <div className="spinner spinner-sm" style={{ borderTopColor: "#f59e0b" }} /> : <Star size={12} />} Score
                  </button>
                  <button onClick={handleHooks} style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${activeTab === "hooks" ? "#818cf8" : "var(--border)"}`, background: activeTab === "hooks" ? "#818cf815" : "transparent", color: activeTab === "hooks" ? "#818cf8" : "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {hooksLoading ? <div className="spinner spinner-sm" style={{ borderTopColor: "#818cf8" }} /> : <Zap size={12} />} 5 Hooks
                  </button>
                  <button onClick={handleToneVariants} style={{ padding: "6px 14px", borderRadius: "8px", border: `1px solid ${activeTab === "tones" ? "#4ade80" : "var(--border)"}`, background: activeTab === "tones" ? "#4ade8015" : "transparent", color: activeTab === "tones" ? "#4ade80" : "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {toneLoading ? <div className="spinner spinner-sm" style={{ borderTopColor: "#4ade80" }} /> : <Wand2 size={12} />} Tone Variants
                  </button>
                </div>

                {/* Refine input */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <input value={refineInput} onChange={e => setRefineInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRefine()}
                    placeholder="Refine: make it shorter, add humor, more formal..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "9px", border: `1px solid ${refineInput ? color + "60" : "var(--border2)"}`, background: "var(--bg)", color: "var(--text)", fontSize: "13px", outline: "none" }} />
                  <button onClick={handleRefine} disabled={!refineInput.trim() || refineLoading}
                    style={{ padding: "8px 14px", borderRadius: "9px", border: "none", background: refineInput.trim() ? color : "var(--border)", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: refineInput.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px" }}>
                    {refineLoading ? <div className="spinner spinner-sm" /> : <Wand2 size={12} />} Refine
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === "result" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {resultEntries.map(([key, value]) => (
                      <ResultCard key={key} label={LABEL_MAP[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} content={value} accentColor={color} />
                    ))}
                  </div>
                )}

                {activeTab === "score" && (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                    {scoreLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--dim)", fontSize: "13px" }}>
                        <div className="spinner spinner-md" /> Analyzing your content...
                      </div>
                    ) : score ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: score.overall >= 7 ? "#4ade8020" : "#f59e0b20", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${score.overall >= 7 ? "#4ade80" : "#f59e0b"}` }}>
                            <span style={{ fontSize: "20px", fontWeight: "800", color: score.overall >= 7 ? "#4ade80" : "#f59e0b" }}>{score.overall}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", margin: "0 0 2px" }}>Overall Score</p>
                            <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>{score.overall >= 8 ? "Excellent!" : score.overall >= 6 ? "Good, room to improve" : "Needs work"}</p>
                          </div>
                        </div>
                        <ScoreBar label="Hook Strength" value={score.hookStrength} color="#818cf8" />
                        <ScoreBar label="Clarity" value={score.clarity} color="#60a5fa" />
                        <ScoreBar label="CTA Power" value={score.ctaPower} color="#f59e0b" />
                        <div style={{ marginTop: "16px", padding: "12px", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                          <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>AI Tip</p>
                          <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.5" }}>{score.tip}</p>
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: "13px", color: "var(--dim)", textAlign: "center" }}>Click "Score" to analyze your content</p>
                    )}
                  </div>
                )}

                {activeTab === "hooks" && (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                    {hooksLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--dim)", fontSize: "13px" }}>
                        <div className="spinner spinner-md" /> Generating hooks...
                      </div>
                    ) : hooks ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>5 Hook Variations</p>
                        {hooks.map((hook, i) => (
                          <div key={i} style={{ display: "flex", gap: "10px", padding: "12px", background: "var(--bg)", borderRadius: "9px", border: "1px solid var(--border)" }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#818cf8", background: "#818cf815", padding: "2px 7px", borderRadius: "5px", flexShrink: 0, alignSelf: "flex-start" }}>#{i + 1}</span>
                            <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.5", flex: 1 }}>{hook}</p>
                            <button onClick={() => { navigator.clipboard.writeText(hook) }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", flexShrink: 0, padding: "2px" }}>
                              <Copy size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "13px", color: "var(--dim)", textAlign: "center" }}>Click "5 Hooks" to generate hook variations</p>
                    )}
                  </div>
                )}

                {activeTab === "tones" && (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                    {toneLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--dim)", fontSize: "13px" }}>
                        <div className="spinner spinner-md" /> Generating tone variants...
                      </div>
                    ) : toneVariants ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Same Content, 3 Tones</p>
                        {[
                          { key: "casual", label: "Casual", color: "#60a5fa" },
                          { key: "professional", label: "Professional", color: "#818cf8" },
                          { key: "funny", label: "Funny", color: "#f59e0b" },
                        ].map(({ key, label: lbl, color: c }) => toneVariants[key] && (
                          <div key={key} style={{ padding: "14px", background: "var(--bg)", borderRadius: "9px", border: `1px solid ${c}30` }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", color: c, background: c + "15", padding: "2px 8px", borderRadius: "5px" }}>{lbl}</span>
                              <button onClick={() => navigator.clipboard.writeText(toneVariants[key])} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)" }}>
                                <Copy size={12} />
                              </button>
                            </div>
                            <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.6" }}>{toneVariants[key]}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "13px", color: "var(--dim)", textAlign: "center" }}>Click "Tone Variants" to see 3 different tones</p>
                    )}
                  </div>
                )}

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
          .gen-results-panel { width: 100%; margin-left: 0; }
          .gen-actions { width: 100%; }
          .gen-btn-outline, .gen-btn-fill { flex: 1; justify-content: center; font-size: 11px; padding: 7px 8px; }
        }
      `}</style>
    </div>
  )
}
