import { useState } from "react"
import { Copy, Check, ChevronDown, ChevronUp, Edit } from "lucide-react"

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

export default function ResultCard({ label, content, accentColor, onEdit }) {
  const [collapsed, setCollapsed] = useState(false)
  const isLong = content.length > 300
  const icon = LABEL_ICONS[label.toLowerCase().replace(/ /g, "")] || "✦"

  return (
    <div className="result-card" style={{ overflow: "hidden" }}>
      <div className="result-card-header" onClick={() => isLong && setCollapsed(p => !p)}
        style={{ cursor: isLong ? "pointer" : "default", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "14px" }}>{icon}</span>
          <span style={{ fontSize: "11px", fontWeight: "700", color: accentColor, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {onEdit && (
            <button onClick={e => { e.stopPropagation(); onEdit() }}
              style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "5px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "11px", cursor: "pointer" }}>
              <Edit size={10} /> Edit
            </button>
          )}
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
