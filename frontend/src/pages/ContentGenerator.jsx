import { useState } from "react"
import { Sparkles, Copy, Check, ChevronDown } from "lucide-react"
import Sidebar from "../components/Sidebar"

const formats = ["Short Video", "Long Video", "Reel", "Carousel", "Blog Post", "Other"]
const niches = ["Tech", "Finance", "Fitness", "Food", "Travel", "Gaming", "Education", "Lifestyle", "Business", "Entertainment", "Other"]
const goals = ["Grow Audience", "Increase Engagement", "Drive Sales", "Build Authority", "Entertain", "Other"]
const tones = ["Casual", "Professional", "Humorous", "Inspirational", "Educational", "Other"]

const SIDEBAR_W = 72
const PAGE_PAD = 48
const LEFT_W = 300
const GAP = 32
const HEADER_H = 116

const DUMMY_RESULT = {
  hook: "Stop scrolling! This one habit is secretly destroying your productivity every single day.",
  angle: "Expose a common productivity myth that most creators believe, then offer a surprising counter-approach backed by real data.",
  outline: "1. The myth everyone believes about productivity\n2. Why this myth is actually hurting your growth\n3. The real science behind peak performance\n4. Simple 3-step system to implement today\n5. Results you can expect in 30 days",
  caption: "The productivity advice you've been following is WRONG 🚨 Here's what actually works based on neuroscience research. Save this for later! #productivity #contentcreator #growthhacks #creatortips #mindset",
  tip: "Record your content in 90-minute focused blocks — this aligns with your brain's natural ultradian rhythm for peak creative output.",
}

function SelectField({ label, options, value, customValue, onCustomChange, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative" }}>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
          {label}
        </label>
        <div
          className="select-trigger"
          onClick={() => setOpen(p => !p)}
          style={{
            border: `1px solid ${open ? "var(--accent)" : "var(--border2)"}`,
            color: value ? "var(--text)" : "var(--dim)",
          }}
        >
          <span>{value || `Select ${label}`}</span>
          <ChevronDown
            size={14}
            color="var(--muted)"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </div>

        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div className="select-dropdown">
              {options.map(opt => (
                <div
                  key={opt}
                  className={`dropdown-item ${value === opt ? "selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false) }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {value === "Other" && (
        <input
          autoFocus
          className="input-sm"
          placeholder={`Enter custom ${label.toLowerCase()}...`}
          value={customValue}
          onChange={e => onCustomChange(e.target.value)}
          style={{ borderColor: "var(--accent)" }}
        />
      )}
    </div>
  )
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className="btn-copy" onClick={handleCopy}>
      {copied ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

function ResultCard({ label, content }) {
  return (
    <div className="result-card">
      <div className="result-card-header">
        <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {label}
        </span>
        <CopyBtn text={content} />
      </div>
      <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
        {content}
      </p>
    </div>
  )
}

export default function ContentGenerator() {
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

  function handleGenerate() {
    if (!format || !niche || !goal || !tone) {
      setError("Please fill all fields before generating.")
      return
    }
    if (format === "Other" && !customFormat.trim()) { setError("Please enter a custom format."); return }
    if (niche === "Other" && !customNiche.trim()) { setError("Please enter a custom niche."); return }
    if (goal === "Other" && !customGoal.trim()) { setError("Please enter a custom goal."); return }
    if (tone === "Other" && !customTone.trim()) { setError("Please enter a custom tone."); return }

    setError("")
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setResult(DUMMY_RESULT)
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={{ display: "flex", background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div
        className="generator-header"
        style={{ left: `${SIDEBAR_W}px`, height: `${HEADER_H}px`, padding: `24px ${PAGE_PAD}px 0` }}
      >
        <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>
          AI Tools
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Content Generator
        </h1>
        <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>
          Generate hooks, outlines & captions for your content.
        </p>
      </div>

      <main style={{
        marginLeft: `${SIDEBAR_W}px`,
        flex: 1,
        paddingTop: `${HEADER_H + 32}px`,
        paddingBottom: "48px",
        paddingLeft: `${PAGE_PAD}px`,
        paddingRight: `${PAGE_PAD}px`,
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", gap: `${GAP}px`, alignItems: "flex-start" }}>

          <div style={{ width: `${LEFT_W}px`, flexShrink: 0 }} />

          <div
            className="generator-left-panel"
            style={{
              top: `${HEADER_H + 32}px`,
              left: `${SIDEBAR_W + PAGE_PAD}px`,
              width: `${LEFT_W}px`,
              maxHeight: `calc(100vh - ${HEADER_H + 56}px)`,
            }}
          >
            <SelectField
              label="Format"
              options={formats}
              value={format}
              customValue={customFormat}
              onCustomChange={setCustomFormat}
              onChange={v => { setFormat(v); setCustomFormat("") }}
            />
            <SelectField
              label="Niche"
              options={niches}
              value={niche}
              customValue={customNiche}
              onCustomChange={setCustomNiche}
              onChange={v => { setNiche(v); setCustomNiche("") }}
            />
            <SelectField
              label="Goal"
              options={goals}
              value={goal}
              customValue={customGoal}
              onCustomChange={setCustomGoal}
              onChange={v => { setGoal(v); setCustomGoal("") }}
            />
            <SelectField
              label="Tone"
              options={tones}
              value={tone}
              customValue={customTone}
              onCustomChange={setCustomTone}
              onChange={v => { setTone(v); setCustomTone("") }}
            />

            <div>
              <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                Topic / Keyword <span style={{ color: "var(--dim)" }}>(optional)</span>
              </label>
              <input
                className="input-sm"
                placeholder="e.g. Morning routine, AI tools..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            {error && <p className="error-box">{error}</p>}

            <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner spinner-sm" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Generate Content
                </>
              )}
            </button>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {!result && !loading && (
              <div className="generator-empty">
                <Sparkles size={32} color="var(--dim)" style={{ marginBottom: "16px" }} />
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>
                  Ready to generate
                </p>
                <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>
                  Fill in the details and click Generate to get your content ideas.
                </p>
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
                <ResultCard label="Hook" content={result.hook} />
                <ResultCard label="Angle" content={result.angle} />
                <ResultCard label="Outline" content={result.outline} />
                <ResultCard label="Caption" content={result.caption} />
                <ResultCard label="Pro Tip" content={result.tip} />
                <button className="btn-ghost" onClick={handleGenerate}>
                  Regenerate ↻
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
