import { useState, useEffect } from "react"
import { Sparkles, ChevronDown, BookmarkCheck } from "lucide-react"
import { NICHES, OUTPUT_TYPES } from "./generatorConfig"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

function Dropdown({ label, options, value, onChange, color, placeholder, hint }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: "relative" }}>
      {label && <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--dim)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>}
      <div onClick={() => setOpen(p => !p)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: "9px", border: `1px solid ${value ? color + "60" : "var(--border2)"}`, background: value ? color + "08" : "var(--card)", cursor: "pointer", userSelect: "none" }}>
        <span style={{ fontSize: "13px", color: value ? "var(--text)" : "var(--dim)", fontWeight: value ? "500" : "400" }}>{value || placeholder}</span>
        <ChevronDown size={13} color="var(--dim)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }} />
      </div>
      {hint && <p style={{ fontSize: "11px", color: "var(--dim)", margin: "4px 0 0 2px" }}>{hint}</p>}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", zIndex: 50, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", maxHeight: "200px", overflowY: "auto" }}>
            {options.map(opt => (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                style={{ padding: "9px 14px", fontSize: "13px", cursor: "pointer", color: value === opt ? color : "var(--text)", background: value === opt ? color + "12" : "transparent", fontWeight: value === opt ? "600" : "400" }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = "var(--border)" }}
                onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = "transparent" }}>
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function GeneratorForm({ formats, goals, tones, color, onGenerate, loading, error }) {
  const [format, setFormat] = useState("")
  const [niche, setNiche] = useState("")
  const [goal, setGoal] = useState("")
  const [tone, setTone] = useState("")
  const [topic, setTopic] = useState("")
  const [outputType, setOutputType] = useState("full_script")
  const [customValues, setCustomValues] = useState({})
  const [profileSaved, setProfileSaved] = useState(false)

  // Auto-fill from saved creator profile on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const p = user.creatorProfile
    if (!p) return
    if (p.format && formats.includes(p.format)) setFormat(p.format)
    if (p.niche && NICHES.includes(p.niche)) setNiche(p.niche)
    if (p.goal && goals.includes(p.goal)) setGoal(p.goal)
    if (p.tone && tones.includes(p.tone)) setTone(p.tone)
    if (p.topic) setTopic(p.topic)
  }, [])

  const setCustom = (key, val) => setCustomValues(p => ({ ...p, [key]: val }))
  const resolve = (val, key) => val === "Other" ? (customValues[key] || "") : val
  const selectedOutput = OUTPUT_TYPES.find(o => o.id === outputType)

  async function saveProfile() {
    const profile = {
      format: resolve(format, "format"),
      niche: resolve(niche, "niche"),
      goal: resolve(goal, "goal"),
      tone: resolve(tone, "tone"),
      topic: topic.trim(),
    }
    try {
      const res = await apiFetch(API_ENDPOINTS.updateCreatorProfile, {
        method: "PATCH",
        body: JSON.stringify(profile)
      })
      const data = await res.json()
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (res.ok && data?.data?.user?.creatorProfile) {
        localStorage.setItem("user", JSON.stringify({ ...user, creatorProfile: data.data.user.creatorProfile }))
      } else {
        // Fallback: save locally even if backend fails
        localStorage.setItem("user", JSON.stringify({ ...user, creatorProfile: profile }))
      }
    } catch {
      // Offline fallback
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({ ...user, creatorProfile: profile }))
    }
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  async function clearProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    delete user.creatorProfile
    localStorage.setItem("user", JSON.stringify(user))
    // Also clear from backend
    try {
      await apiFetch(API_ENDPOINTS.updateCreatorProfile, {
        method: "PATCH",
        body: JSON.stringify({ format: "", niche: "", goal: "", tone: "", topic: "" })
      })
    } catch { /* silent */ }
    setFormat(""); setNiche(""); setGoal(""); setTone(""); setTopic("")
  }
    onGenerate({
      format: resolve(format, "format"), niche: resolve(niche, "niche"),
      goal: resolve(goal, "goal"), tone: resolve(tone, "tone"),
      topic: topic.trim(), outputType,
      rawFormat: format, rawNiche: niche, rawGoal: goal, rawTone: tone,
      customFormat: customValues.format || "", customNiche: customValues.niche || "",
      customGoal: customValues.goal || "", customTone: customValues.tone || "",
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      <Dropdown label="Format" options={formats} value={format} onChange={setFormat} color={color} placeholder="Select format" />
      {format === "Other" && <input className="input-sm" placeholder="Enter custom format..." value={customValues.format || ""} onChange={e => setCustom("format", e.target.value)} style={{ borderColor: color, marginTop: "-8px" }} />}

      <Dropdown label="Niche" options={NICHES} value={niche} onChange={setNiche} color={color} placeholder="Select your niche" />
      {niche === "Other" && <input className="input-sm" placeholder="Enter your niche..." value={customValues.niche || ""} onChange={e => setCustom("niche", e.target.value)} style={{ borderColor: color, marginTop: "-8px" }} />}

      <Dropdown label="Goal" options={goals} value={goal} onChange={setGoal} color={color} placeholder="What's your goal?" />
      {goal === "Other" && <input className="input-sm" placeholder="Enter your goal..." value={customValues.goal || ""} onChange={e => setCustom("goal", e.target.value)} style={{ borderColor: color, marginTop: "-8px" }} />}

      <Dropdown label="Tone" options={tones} value={tone} onChange={setTone} color={color} placeholder="Choose a tone" />
      {tone === "Other" && <input className="input-sm" placeholder="Enter tone..." value={customValues.tone || ""} onChange={e => setCustom("tone", e.target.value)} style={{ borderColor: color, marginTop: "-8px" }} />}

      <div>
        <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--dim)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Topic <span style={{ color: "var(--border2)", fontWeight: "400", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
        </label>
        <input className="input-sm" placeholder="e.g. Morning routine, AI tools..." value={topic} onChange={e => setTopic(e.target.value)} />
      </div>

      <Dropdown label="What do you want?" options={OUTPUT_TYPES.map(o => o.label)} value={selectedOutput?.label} onChange={v => setOutputType(OUTPUT_TYPES.find(o => o.label === v)?.id || "full_script")} color={color} placeholder="Select output type" hint={selectedOutput?.desc} />

      {/* Save / Clear profile buttons */}
      {(format || niche || goal || tone) && (
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={saveProfile} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "7px", borderRadius: "8px", border: `1px solid ${profileSaved ? "#4ade8060" : "var(--border)"}`, background: profileSaved ? "#4ade8010" : "transparent", color: profileSaved ? "#4ade80" : "var(--dim)", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}>
            <BookmarkCheck size={12} />
            {profileSaved ? "Saved!" : "Save as default"}
          </button>
          {(() => {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            return user.creatorProfile ? (
              <button onClick={clearProfile} style={{ padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "12px", cursor: "pointer" }}
                title="Clear saved default">
                ✕
              </button>
            ) : null
          })()}
        </div>
      )}

      {error && <p className="error-box">{error}</p>}

      <button className="btn-generate" onClick={handleSubmit} disabled={loading} style={{ background: color }}>
        {loading ? <><div className="spinner spinner-sm" /> Generating...</> : <><Sparkles size={14} /> Generate</>}
      </button>
    </div>
  )
}
