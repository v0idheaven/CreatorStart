import { useState } from "react"
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react"

const LABEL_ICONS = {
  title: "🎯", hook: "⚡", script: "📝", outline: "📋",
  description: "📄", tags: "🏷️", caption: "✍️", hashtags: "#",
  cta: "👆", points: "•", tip: "💡", angle: "🔍", reelIdea: "🎬",
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button className="btn-copy" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
      {copied ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

export default function ResultCard({ label, content, accentColor }) {
  const [collapsed, setCollapsed] = useState(false)
  const isLong = content.length > 300
  const iconKey = label.toLowerCase().replace(/ /g, "")
  const icon = LABEL_ICONS[iconKey] || "✦"

  return (
    <div className="result-card" style={{ overflow: "hidden" }}>
      <div className="result-card-header" onClick={() => isLong && setCollapsed(p => !p)}
        style={{ cursor: isLong ? "pointer" : "default", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "14px" }}>{icon}</span>
          <span style={{ fontSize: "11px", fontWeight: "700", color: accentColor, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CopyBtn text={content} />
          {isLong && (collapsed ? <ChevronDown size={13} color="var(--dim)" /> : <ChevronUp size={13} color="var(--dim)" />)}
        </div>
      </div>
      {!collapsed && (
        <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{content}</p>
      )}
    </div>
  )
}
