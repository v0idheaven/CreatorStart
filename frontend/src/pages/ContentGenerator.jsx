import { useState } from "react"
import { Sparkles, Copy, Check, ChevronDown, CalendarDays, X } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { API_ENDPOINTS } from "../constants/api"

const SIDEBAR_W = 72
const PAGE_PAD = 48
const LEFT_W = 300
const GAP = 32
const HEADER_H = 116

const CONFIG = {
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

const niches = ["Tech", "Finance", "Fitness", "Food", "Travel", "Gaming", "Education", "Lifestyle", "Business", "Entertainment", "Other"]

function SelectField({ label, options, value, customValue, onCustomChange, onChange, accentColor }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative" }}>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>{label}</label>
        <div className="select-trigger" onClick={() => setOpen(p => !p)}
          style={{ border: `1px solid ${open ? accentColor : "var(--border2)"}`, color: value ? "var(--text)" : "var(--dim)" }}>
          <span>{value || `Select ${label}`}</span>
          <ChevronDown size={14} color="var(--muted)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </div>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div className="select-dropdown">
              {options.map(opt => (
                <div key={opt} className={`dropdown-item ${value === opt ? "selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false) }}>{opt}</div>
              ))}
            </div>
          </>
        )}
      </div>
      {value === "Other" && (
        <input autoFocus className="input-sm" placeholder={`Enter custom ${label.toLowerCase()}...`}
          value={customValue} onChange={e => onCustomChange(e.target.value)} style={{ borderColor: accentColor }} />
      )}
    </div>
  )
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button className="btn-copy" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
      {copied ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

function ResultCard({ label, content, accentColor }) {
  return (
    <div className="result-card">
      <div className="result-card-header">
        <span style={{ fontSize: "11px", fontWeight: "600", color: accentColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
        <CopyBtn text={content} />
      </div>
      <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{content}</p>
    </div>
  )
}

export default function ContentGenerator() {
  const platform = localStorage.getItem("platform") || "both"
  const cfg = CONFIG[platform] || CONFIG.both
  const { color, label, formats, goals, tones, resultKeys, resultLabels } = cfg

  const [format, setFormat] = useState("")
  const [customFormat, setCustomFormat] = useState("")
  const [niche, setNiche] = useState("")
  const [customNiche, setCustomNiche] = useState("")
  const [goal, setGoal] = useState("")
  const [customGoal, setCustomGoal] = useState("")
  const [tone, setTone] = useState("")
  const [customTone, setCustomTone] = useState("")
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [showPlannerModal, setShowPlannerModal] = useState(false)
  const [plannerSaved, setPlannerSaved] = useState(false)

  async function handleGenerate() {
    if (!format || !niche || !goal || !tone) { setError("Please fill all fields before generating."); return }
    if (format === "Other" && !customFormat.trim()) { setError("Please enter a custom format."); return }
    if (niche === "Other" && !customNiche.trim()) { setError("Please enter a custom niche."); return }
    if (goal === "Other" && !customGoal.trim()) { setError("Please enter a custom goal."); return }
    if (tone === "Other" && !customTone.trim()) { setError("Please enter a custom tone."); return }

    const payload = {
      platform,
      format: format === "Other" ? customFormat.trim() : format,
      niche: niche === "Other" ? customNiche.trim() : niche,
      goal: goal === "Other" ? customGoal.trim() : goal,
      tone: tone === "Other" ? customTone.trim() : tone,
      topic: topic?.trim() || "",
    }

    setError("")
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(API_ENDPOINTS.contentGenerator, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to generate content")
      }

      if (!data?.data || typeof data.data !== "object") {
        throw new Error("Invalid response from AI")
      }

      setResult(data.data)
    } catch (err) {
      setError(err.message || "Failed to generate content")
    } finally {
      setLoading(false)
    }
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
            <SelectField label="Format" options={formats} value={format} customValue={customFormat} onCustomChange={setCustomFormat} onChange={v => { setFormat(v); setCustomFormat("") }} accentColor={color} />
            <SelectField label="Niche" options={niches} value={niche} customValue={customNiche} onCustomChange={setCustomNiche} onChange={v => { setNiche(v); setCustomNiche("") }} accentColor={color} />
            <SelectField label="Goal" options={goals} value={goal} customValue={customGoal} onCustomChange={setCustomGoal} onChange={v => { setGoal(v); setCustomGoal("") }} accentColor={color} />
            <SelectField label="Tone" options={tones} value={tone} customValue={customTone} onCustomChange={setCustomTone} onChange={v => { setTone(v); setCustomTone("") }} accentColor={color} />
            <div>
              <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Topic / Keyword <span style={{ color: "var(--dim)" }}>(optional)</span>
              </label>
              <input className="input-sm" placeholder="e.g. Morning routine, AI tools..." value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            {error && <p className="error-box">{error}</p>}
            <button className="btn-generate" onClick={handleGenerate} disabled={loading} style={{ background: color }}>
              {loading ? <><div className="spinner spinner-sm" />Generating...</> : <><Sparkles size={15} />Generate Content</>}
            </button>
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
                {resultKeys.map(key => result[key] && (
                  <ResultCard key={key} label={resultLabels[key]} content={result[key]} accentColor={color} />
                ))}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-ghost" onClick={handleGenerate} style={{ borderColor: color + "50" }}>Regenerate ↻</button>
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

      {showPlannerModal && (
        <>
          <div onClick={() => setShowPlannerModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", width: "100%", maxWidth: "480px", zIndex: 51, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", margin: 0 }}>Add to Planner</h2>
              <button onClick={() => setShowPlannerModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex" }}><X size={16} /></button>
            </div>
            <p style={{ fontSize: "12px", color: "var(--dim)", margin: "0 0 16px" }}>Pick any day — empty days will be filled, filled days will be replaced.</p>

            {(() => {
              const _plat = localStorage.getItem("platform") || "both"
              const saved = JSON.parse(localStorage.getItem(`planner_data_${_plat}`) || "null")
              if (!saved) return (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <p style={{ fontSize: "13px", color: "var(--dim)", margin: "0 0 12px" }}>No planner found. Create a plan first.</p>
                  <button onClick={() => { setShowPlannerModal(false); window.location.href = "/planner" }}
                    style={{ padding: "9px 18px", borderRadius: "9px", border: "none", background: color, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <CalendarDays size={14} /> Go to Planner
                  </button>
                </div>
              )

              const allDays = saved.entries

              return (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", maxHeight: "260px", overflowY: "auto", marginBottom: "14px" }}>
                    {allDays.map(e => {
                      const isEmpty = !e.content
                      const dateNum = e.date ? new Date(e.date).getDate() : e.day

                      const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                      const todayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
                      const entryDate = e.date ? new Date(e.date) : null
                      if (entryDate) entryDate.setHours(0, 0, 0, 0)
                      const isPast = entryDate ? entryDate < todayIST : false

                      return (
                        <div key={e.day}
                          onClick={() => {
                            if (isPast) return
                            const title = result.title || result.hook || result.caption || "Content idea"
                            const updated = saved.entries.map(en => en.day === e.day ? { ...en, content: title, active: true } : en)
                            localStorage.setItem(`planner_data_${_plat}`, JSON.stringify({ ...saved, entries: updated }))
                            setPlannerSaved(true)
                            setTimeout(() => { setShowPlannerModal(false); setPlannerSaved(false) }, 1200)
                          }}
                          onMouseEnter={el => { if (!isPast) el.currentTarget.style.borderColor = color }}
                          onMouseLeave={el => el.currentTarget.style.borderColor = isPast ? "var(--border)" : isEmpty ? "var(--border2)" : "var(--border)"}
                          style={{
                            padding: "8px 6px", borderRadius: "8px",
                            border: `1.5px solid ${isPast ? "var(--border)" : isEmpty ? "var(--border2)" : "var(--border)"}`,
                            background: isPast ? "transparent" : isEmpty ? "var(--bg)" : "var(--card)",
                            cursor: isPast ? "not-allowed" : "pointer",
                            textAlign: "center", transition: "border-color 0.12s",
                            opacity: isPast ? 0.35 : 1,
                          }}
                        >
                          <p style={{ fontSize: "15px", fontWeight: "700", color: isPast ? "var(--dim)" : isEmpty ? "var(--text)" : color, margin: "0 0 2px", lineHeight: 1 }}>{dateNum}</p>
                          <p style={{ fontSize: "9px", color: "var(--dim)", margin: "0 0 3px" }}>{e.dayName || ""}</p>
                          {isPast
                            ? <p style={{ fontSize: "9px", color: "var(--dim)", margin: 0 }}>past</p>
                            : isEmpty
                            ? <p style={{ fontSize: "9px", color: "var(--dim)", margin: 0 }}>empty</p>
                            : <p style={{ fontSize: "9px", color: "var(--muted)", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>replace</p>
                          }
                        </div>
                      )
                    })}
                  </div>
                </>
              )
            })()}

            {plannerSaved && (
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "#4ade8015", border: "1px solid #4ade8030", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Check size={13} color="#4ade80" />
                <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "600" }}>Added to your planner!</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
