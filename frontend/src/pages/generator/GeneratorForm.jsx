import { useState } from "react"
import { Sparkles } from "lucide-react"
import SelectField from "./SelectField"
import { NICHES } from "./generatorConfig"

const OUTPUT_TYPES = [
  { id: "full_script", label: "Full Script", desc: "Complete word-for-word script" },
  { id: "bullet_points", label: "Key Points", desc: "Main talking points only" },
  { id: "hook_only", label: "Hook + CTA", desc: "Opening hook and call to action" },
  { id: "outline", label: "Outline", desc: "Structured content outline" },
  { id: "caption", label: "Caption + Hashtags", desc: "Ready-to-post caption" },
]

// Left panel: all form fields + output type selector + generate button
export default function GeneratorForm({ formats, goals, tones, color, onGenerate, loading, error }) {
  const [format, setFormat] = useState("")
  const [customFormat, setCustomFormat] = useState("")
  const [niche, setNiche] = useState("")
  const [customNiche, setCustomNiche] = useState("")
  const [goal, setGoal] = useState("")
  const [customGoal, setCustomGoal] = useState("")
  const [tone, setTone] = useState("")
  const [customTone, setCustomTone] = useState("")
  const [topic, setTopic] = useState("")
  const [outputType, setOutputType] = useState("full_script")

  function handleSubmit() {
    onGenerate({
      format: format === "Other" ? customFormat.trim() : format,
      niche: niche === "Other" ? customNiche.trim() : niche,
      goal: goal === "Other" ? customGoal.trim() : goal,
      tone: tone === "Other" ? customTone.trim() : tone,
      topic: topic.trim(),
      outputType,
      rawFormat: format, rawNiche: niche, rawGoal: goal, rawTone: tone,
      customFormat, customNiche, customGoal, customTone,
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SelectField label="Format" options={formats} value={format} customValue={customFormat} onCustomChange={setCustomFormat} onChange={v => { setFormat(v); setCustomFormat("") }} accentColor={color} />
      <SelectField label="Niche" options={NICHES} value={niche} customValue={customNiche} onCustomChange={setCustomNiche} onChange={v => { setNiche(v); setCustomNiche("") }} accentColor={color} />
      <SelectField label="Goal" options={goals} value={goal} customValue={customGoal} onCustomChange={setCustomGoal} onChange={v => { setGoal(v); setCustomGoal("") }} accentColor={color} />
      <SelectField label="Tone" options={tones} value={tone} customValue={customTone} onCustomChange={setCustomTone} onChange={v => { setTone(v); setCustomTone("") }} accentColor={color} />

      {/* Topic */}
      <div>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
          Topic / Keyword <span style={{ color: "var(--dim)" }}>(optional)</span>
        </label>
        <input className="input-sm" placeholder="e.g. Morning routine, AI tools..." value={topic} onChange={e => setTopic(e.target.value)} />
      </div>

      {/* Output type */}
      <div>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "8px" }}>
          What do you want?
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {OUTPUT_TYPES.map(o => (
            <div key={o.id} onClick={() => setOutputType(o.id)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "9px", border: `1.5px solid ${outputType === o.id ? color : "var(--border2)"}`, background: outputType === o.id ? color + "10" : "var(--card)", cursor: "pointer", transition: "all 0.12s" }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `2px solid ${outputType === o.id ? color : "var(--border2)"}`, background: outputType === o.id ? color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {outputType === o.id && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: outputType === o.id ? color : "var(--text)", margin: 0 }}>{o.label}</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="error-box">{error}</p>}
      <button className="btn-generate" onClick={handleSubmit} disabled={loading} style={{ background: color }}>
        {loading ? <><div className="spinner spinner-sm" />Generating...</> : <><Sparkles size={15} />Generate Content</>}
      </button>
    </div>
  )
}
