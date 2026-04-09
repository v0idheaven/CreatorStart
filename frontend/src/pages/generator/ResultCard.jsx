import { useState } from "react"
import { Copy, Check } from "lucide-react"

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button className="btn-copy" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
      {copied ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

// Single AI result section with label + copy button
export default function ResultCard({ label, content, accentColor }) {
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
