import { useState } from "react"
import { Sparkles, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react"
import { NICHES, OUTPUT_TYPES } from "./generatorConfig"

const AUDIENCES = ["Beginners", "Students", "Young Adults (18-25)", "Professionals", "Entrepreneurs", "Parents", "Fitness Enthusiasts", "Tech Lovers", "General Audience", "Other"]
const LENGTHS = ["Under 1 min (Short/Reel)", "1-5 min", "5-10 min", "10-20 min", "20+ min"]
const STYLES = ["MrBeast (High energy, fast)", "Ali Abdaal (Calm, educational)", "Gary Vee (Motivational, direct)", "Kunal Shah (Insightful, data-driven)", "Ranveer Allahbadia (Deep, thoughtful)", "My own style", "Other"]

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

function StepIndicator({ step, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
      {[1, 2].map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: step >= s ? color : "var(--border2)", color: step >= s ? "#fff" : "var(--dim)", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>{s}</div>
          <span style={{ fontSize: "11px", color: step === s ? "var(--text)" : "var(--dim)", fontWeight: step === s ? "600" : "400" }}>{s === 1 ? "Basics" : "Details"}</span>
          {s < 2 && <div style={{ width: "24px", height: "1px", background: step > 1 ? color : "var(--border2)" }} />}
        </div>
      ))}
    </div>
  )
}

export default function GeneratorForm({ formats, goals, tones, color, onGenerate, loading, error }) {
  const [step, setStep] = useState(1)

  // Step 1
  const [format, setFormat] = useState("")
  const [niche, setNiche] = useState("")
  const [goal, setGoal] = useState("")
  const [tone, setTone] = useState("")
  const [topic, setTopic] = useState("")
  const [outputType, setOutputType] = useState("full_script")
  const [customValues, setCustomValues] = useState({})

  // Step 2
  const [audience, setAudience] = useState("")
  const [length, setLength] = useState("")
  const [keyMessage, setKeyMessage] = useState("")
  const [angle, setAngle] = useState("")
  const [style, setStyle] = useState("")
  const [customAudience, setCustomAudience] = useState("")
  const [customStyle, setCustomStyle] = useState("")

  const setCustom = (key, val) => setCustomValues(p => ({ ...p, [key]: val }))
  const resolve = (val, key) => val === "Other" ? (customValues[key] || "") : val

  const step1Valid = format && niche && goal && tone

  function handleGenerate() {
    onGenerate({
      format: resolve(format, "format"),
      niche: resolve(niche, "niche"),
      goal: resolve(goal, "goal"),
      tone: resolve(tone, "tone"),
      topic: topic.trim(),
      outputType,
      audience: audience === "Other" ? customAudience : audience,
      length,
      keyMessage: keyMessage.trim(),
      angle: angle.trim(),
      style: style === "Other" ? customStyle : style,
      rawFormat: format, rawNiche: niche, rawGoal: goal, rawTone: tone,
      customFormat: customValues.format || "", customNiche: customValues.niche || "",
      customGoal: customValues.goal || "", customTone: customValues.tone || "",
    })
  }

  const selectedOutput = OUTPUT_TYPES.find(o => o.id === outputType)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <StepIndicator step={step} color={color} />

      {step === 1 && (
        <>
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

          <div>
            <Dropdown label="What do you want?" options={OUTPUT_TYPES.map(o => o.label)} value={selectedOutput?.label} onChange={v => setOutputType(OUTPUT_TYPES.find(o => o.label === v)?.id || "full_script")} color={color} placeholder="Select output type" hint={selectedOutput?.desc} />
          </div>

          <button onClick={() => setStep(2)} disabled={!step1Valid}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "9px", border: "none", background: step1Valid ? color : "var(--border)", color: step1Valid ? "#fff" : "var(--dim)", fontSize: "13px", fontWeight: "600", cursor: step1Valid ? "pointer" : "not-allowed", marginTop: "4px" }}>
            Next — Add Details <ArrowRight size={14} />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <Dropdown label="Target Audience" options={AUDIENCES} value={audience} onChange={setAudience} color={color} placeholder="Who is this for?" />
          {audience === "Other" && <input className="input-sm" placeholder="Describe your audience..." value={customAudience} onChange={e => setCustomAudience(e.target.value)} style={{ borderColor: color, marginTop: "-8px" }} />}

          <Dropdown label="Content Length" options={LENGTHS} value={length} onChange={setLength} color={color} placeholder="How long?" />

          <div>
            <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--dim)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Key Message <span style={{ color: "var(--border2)", fontWeight: "400", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <input className="input-sm" placeholder="What's the ONE thing you want viewers to take away?" value={keyMessage} onChange={e => setKeyMessage(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--dim)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Unique Angle <span style={{ color: "var(--border2)", fontWeight: "400", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <input className="input-sm" placeholder="e.g. Personal story, controversial take, data-backed..." value={angle} onChange={e => setAngle(e.target.value)} />
          </div>

          <Dropdown label="Creator Style (optional)" options={STYLES} value={style} onChange={setStyle} color={color} placeholder="Sound like someone?" />
          {style === "Other" && <input className="input-sm" placeholder="Describe the style..." value={customStyle} onChange={e => setCustomStyle(e.target.value)} style={{ borderColor: color, marginTop: "-8px" }} />}

          {error && <p className="error-box">{error}</p>}

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button onClick={() => setStep(1)}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "10px 14px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>
              <ArrowLeft size={13} /> Back
            </button>
            <button onClick={handleGenerate} disabled={loading}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "9px", border: "none", background: color, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? <><div className="spinner spinner-sm" /> Generating...</> : <><Sparkles size={14} /> Generate</>}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
