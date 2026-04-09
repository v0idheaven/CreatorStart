import { useState } from "react"
import { Sparkles } from "lucide-react"
import SelectField from "./SelectField"
import { NICHES } from "./generatorConfig"

// Left panel: all form fields + generate button
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

  function handleSubmit() {
    onGenerate({
      format: format === "Other" ? customFormat.trim() : format,
      niche: niche === "Other" ? customNiche.trim() : niche,
      goal: goal === "Other" ? customGoal.trim() : goal,
      tone: tone === "Other" ? customTone.trim() : tone,
      topic: topic.trim(),
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
      <div>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
          Topic / Keyword <span style={{ color: "var(--dim)" }}>(optional)</span>
        </label>
        <input className="input-sm" placeholder="e.g. Morning routine, AI tools..." value={topic} onChange={e => setTopic(e.target.value)} />
      </div>
      {error && <p className="error-box">{error}</p>}
      <button className="btn-generate" onClick={handleSubmit} disabled={loading} style={{ background: color }}>
        {loading ? <><div className="spinner spinner-sm" />Generating...</> : <><Sparkles size={15} />Generate Content</>}
      </button>
    </div>
  )
}
