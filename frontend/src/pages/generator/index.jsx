import { useState } from "react"
import { Sparkles, CalendarDays, RotateCcw, Download, Edit3, History, FileText } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { API_ENDPOINTS } from "../../constants/api"
import { CONFIG, SIDEBAR_W, PAGE_PAD, HEADER_H } from "./generatorConfig"
import GeneratorForm from "./GeneratorForm"
import ResultCard from "./ResultCard"
import ScoreCard from "./ScoreCard"
import HookVariations from "./HookVariations"
import ToneTester from "./ToneTester"
import AddToPlannerModal from "./AddToPlannerModal"

const LABEL_MAP = {
  title: "Video Title", hook: "Hook", script: "Full Script", outline: "Outline",
  description: "Description", tags: "Tags", caption: "Caption", hashtags: "Hashtags",
  cta: "Call to Action", points: "Key Points", tip: "Pro Tip", angle: "Angle", reelIdea: "Reel Concept",
}

const MAX_VERSIONS = 3

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

  // Versioning — keep last 3 generations
  const [versions, setVersions] = useState([]) // [{label, result}]
  const [activeVersion, setActiveVersion] = useState(0)

  // Script editor
  const [editedScript, setEditedScript] = useState(null) // null = not editing, string = editing
  const [editKey, setEditKey] = useState(null)

  // Mode: "generate" | "improve"
  const [mode, setMode] = useState("generate")

  async function callAPI(payload) {
    const res = await fetch(API_ENDPOINTS.contentGenerator, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || "Failed to generate")
    if (!data?.data || typeof data.data !== "object") throw new Error("Invalid AI response")
    return data.data
  }

  async function handleGenerate(fields) {
    const { format, niche, goal, tone, rawFormat, rawNiche, rawGoal, rawTone, customFormat, customNiche, customGoal, customTone } = fields
    if (!rawFormat || !rawNiche || !rawGoal || !rawTone) { setError("Please fill all fields."); return }
    if (rawFormat === "Other" && !customFormat) { setError("Enter a custom format."); return }
    if (rawNiche === "Other" && !customNiche) { setError("Enter a custom niche."); return }
    if (rawGoal === "Other" && !customGoal) { setError("Enter a custom goal."); return }
    if (rawTone === "Other" && !customTone) { setError("Enter a custom tone."); return }

    const payload = {
      platform, format, niche, goal, tone,
      topic: fields.topic, outputType: fields.outputType || "full_script",
      audience: fields.audience, length: fields.length,
      keyMessage: fields.keyMessage, angle: fields.angle, style: fields.style,
      draftContent: mode === "improve" ? fields.draftContent : undefined,
    }
    setLastPayload(payload); setLastFields(fields)
    setError(""); setLoading(true); setResult(null); setEditedScript(null); setEditKey(null)

    try {
      const newResult = await callAPI(payload)
      setResult(newResult)
      // Save version
      const vLabel = `V${versions.length + 1} — ${format} · ${niche}`
      setVersions(prev => [...prev.slice(-(MAX_VERSIONS - 1)), { label: vLabel, result: newResult }])
      setActiveVersion(Math.min(versions.length, MAX_VERSIONS - 1))
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  async function handleRegenerate() {
    if (!lastPayload) return
    setError(""); setLoading(true); setResult(null); setEditedScript(null); setEditKey(null)
    try {
      const newResult = await callAPI(lastPayload)
      setResult(newResult)
      const vLabel = `V${versions.length + 1} — Regenerated`
      setVersions(prev => [...prev.slice(-(MAX_VERSIONS - 1)), { label: vLabel, result: newResult }])
      setActiveVersion(Math.min(versions.length, MAX_VERSIONS - 1))
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  function loadVersion(idx) {
    setActiveVersion(idx)
    setResult(versions[idx]?.result || null)
    setEditedScript(null); setEditKey(null)
  }

  function handleDownload() {
    if (!result) return
    const text = Object.entries(result).map(([k, v]) => `=== ${LABEL_MAP[k] || k.toUpperCase()} ===\n${v}`).join("\n\n")
    const blob = new Blob([text], { type: "text/plain" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob)
    a.download = `content-${Date.now()}.txt`; a.click()
  }

  const resultEntries = result ? Object.entries(result).filter(([, v]) => v) : []
  const mainContent = result ? (result.script || result.caption || result.hook || result.points || result.outline || "") : ""

  return (
    <div style={{ display: "flex", background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      {/* Header */}
      <div className="generator-header" style={{ left: `${SIDEBAR_W}px`, height: `${HEADER_H}px`, padding: `18px ${PAGE_PAD}px 0` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
              <p style={{ fontSize: "11px", color, textTransform: "uppercase", letterSpacing: "2px", margin: 0, fontWeight: "600" }}>{label}</p>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>Content Generator</h1>
          </div>

          {result && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {/* Version tabs */}
              {versions.length > 1 && (
                <div style={{ display: "flex", gap: "4px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "3px" }}>
                  {versions.map((v, i) => (
                    <button key={i} onClick={() => loadVersion(i)}
                      style={{ padding: "4px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: activeVersion === i ? "700" : "400", background: activeVersion === i ? color + "20" : "transparent", color: activeVersion === i ? color : "var(--dim)" }}>
                      V{i + 1}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={handleRegenerate} disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: `1px solid ${color}40`, background: "transparent", color, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                <RotateCcw size={12} /> Regenerate
              </button>
              <button onClick={handleDownload}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "12px", cursor: "pointer" }}>
                <Download size={12} /> Save
              </button>
              <button onClick={() => setShowPlannerModal(true)}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "none", background: color, color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                <CalendarDays size={12} /> Add to Planner
              </button>
            </div>
          )}
        </div>
      </div>

      <main style={{ marginLeft: `${SIDEBAR_W}px`, flex: 1, paddingTop: `${HEADER_H + 20}px`, paddingBottom: "48px", paddingLeft: `${PAGE_PAD}px`, paddingRight: `${PAGE_PAD}px`, boxSizing: "border-box", display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* Left form */}
        <div style={{ width: "300px", flexShrink: 0, position: "sticky", top: `${HEADER_H + 20}px`, maxHeight: `calc(100vh - ${HEADER_H + 40}px)`, overflowY: "auto" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            {/* Mode toggle */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
              {[{ id: "generate", icon: Sparkles, label: "Generate" }, { id: "improve", icon: Edit3, label: "Improve Draft" }].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "10px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: mode === m.id ? "700" : "400", background: mode === m.id ? color + "12" : "transparent", color: mode === m.id ? color : "var(--muted)", borderBottom: mode === m.id ? `2px solid ${color}` : "2px solid transparent" }}>
                  <m.icon size={12} /> {m.label}
                </button>
              ))}
            </div>
            <div style={{ padding: "16px" }}>
              <GeneratorForm formats={formats} goals={goals} tones={tones} color={color} onGenerate={handleGenerate} loading={loading} error={error} mode={mode} />
            </div>
          </div>
        </div>

        {/* Right results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!result && !loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: color + "12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={26} color={color} />
              </div>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: 0 }}>Ready to create</p>
              <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0, maxWidth: "260px", lineHeight: "1.6" }}>
                Fill the form → choose what you want → get a script, hooks, caption or outline.
              </p>
              {versions.length > 0 && (
                <div style={{ marginTop: "16px", width: "100%", maxWidth: "360px" }}>
                  <p style={{ fontSize: "11px", color: "var(--dim)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <History size={11} /> Previous generations
                  </p>
                  {versions.map((v, i) => (
                    <div key={i} onClick={() => loadVersion(i)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", marginBottom: "6px" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                      <FileText size={13} color={color} />
                      <span style={{ fontSize: "12px", color: "var(--text)", flex: 1 }}>{v.label}</span>
                      <span style={{ fontSize: "11px", color: color }}>Load →</span>
                    </div>
                  ))}
                </div>
              )}
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
              {/* Tags */}
              {lastFields && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "2px" }}>
                  {[lastFields.format, lastFields.niche, lastFields.goal, lastFields.tone, lastFields.audience].filter(Boolean).map(tag => (
                    <span key={tag} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: color + "12", color, border: `1px solid ${color}25` }}>{tag}</span>
                  ))}
                  {lastFields.topic && <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: "var(--border)", color: "var(--muted)" }}>"{lastFields.topic}"</span>}
                </div>
              )}

              {/* Result cards with inline editor */}
              {resultEntries.map(([key, value]) => (
                <div key={key}>
                  {editKey === key ? (
                    <div className="result-card">
                      <div className="result-card-header">
                        <span style={{ fontSize: "11px", fontWeight: "700", color, textTransform: "uppercase", letterSpacing: "0.6px" }}>{LABEL_MAP[key] || key} — Editing</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => { setResult(r => ({ ...r, [key]: editedScript })); setEditKey(null) }}
                            style={{ padding: "3px 10px", borderRadius: "6px", background: color, color: "#fff", border: "none", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Save</button>
                          <button onClick={() => setEditKey(null)}
                            style={{ padding: "3px 10px", borderRadius: "6px", background: "transparent", color: "var(--dim)", border: "1px solid var(--border)", fontSize: "11px", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                      <textarea value={editedScript} onChange={e => setEditedScript(e.target.value)}
                        style={{ width: "100%", minHeight: "200px", background: "transparent", border: "none", color: "var(--text)", fontSize: "13px", lineHeight: "1.8", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                  ) : (
                    <ResultCard
                      label={LABEL_MAP[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                      content={value}
                      accentColor={color}
                      onEdit={() => { setEditKey(key); setEditedScript(value) }}
                    />
                  )}
                </div>
              ))}

              {/* Action tools */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "4px 0" }}>
                <ScoreCard content={mainContent} platform={platform} accentColor={color} />
                <HookVariations topic={lastFields?.topic || lastFields?.niche} platform={platform} tone={lastFields?.tone} niche={lastFields?.niche} accentColor={color} />
                <ToneTester content={mainContent} platform={platform} accentColor={color} />
              </div>
            </div>
          )}
        </div>
      </main>

      {showPlannerModal && <AddToPlannerModal result={result} color={color} onClose={() => setShowPlannerModal(false)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
