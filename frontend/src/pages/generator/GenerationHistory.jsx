import { useState } from "react"
import { History, ChevronDown, ChevronUp, Copy, Check, Trash2 } from "lucide-react"
import { loadHistory, clearHistory, writeHistory } from "./historyStorage"

function HistoryItem({ item, accentColor, onLoad, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const date = new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
  const mainContent = item.result?.script || item.result?.caption || item.result?.hook || item.result?.points || ""

  function copyAll() {
    const text = Object.entries(item.result).map(([k, v]) => `${k.toUpperCase()}\n${v}`).join("\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: "pointer", background: "var(--card)" }}
        onClick={() => setExpanded(p => !p)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "3px" }}>
            {[item.fields.format, item.fields.niche, item.fields.tone].filter(Boolean).map(t => (
              <span key={t} style={{ padding: "1px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: "600", background: accentColor + "15", color: accentColor }}>{t}</span>
            ))}
            {item.fields.topic && <span style={{ padding: "1px 7px", borderRadius: "10px", fontSize: "10px", background: "var(--border)", color: "var(--dim)" }}>"{item.fields.topic}"</span>}
          </div>
          <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{date}</p>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button onClick={e => { e.stopPropagation(); onLoad(item) }}
            style={{ padding: "4px 10px", borderRadius: "6px", border: `1px solid ${accentColor}40`, background: accentColor + "10", color: accentColor, fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
            Load
          </button>
          <button onClick={e => { e.stopPropagation(); copyAll() }}
            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", color: copied ? "#4ade80" : "var(--dim)", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
            {copied ? <Check size={10} /> : <Copy size={10} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(item.id) }}
            style={{ padding: "4px 8px", borderRadius: "6px", border: "none", background: "transparent", color: "var(--dim)", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Trash2 size={11} />
          </button>
          {expanded ? <ChevronUp size={13} color="var(--dim)" /> : <ChevronDown size={13} color="var(--dim)" />}
        </div>
      </div>
      {expanded && mainContent && (
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
            {mainContent.slice(0, 400)}{mainContent.length > 400 ? "..." : ""}
          </p>
        </div>
      )}
    </div>
  )
}

export default function GenerationHistory({ accentColor, onLoad }) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState(() => loadHistory())

  function handleDelete(id) {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
    writeHistory(updated)
  }

  function clearAll() {
    setHistory([])
    clearHistory()
  }

  if (history.length === 0) return null

  return (
    <div style={{ marginTop: "8px" }}>
      <button onClick={() => setOpen(p => !p)}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer", width: "100%" }}>
        <History size={13} color={accentColor} />
        <span style={{ flex: 1, textAlign: "left" }}>History ({history.length})</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            <button onClick={clearAll} style={{ fontSize: "11px", color: "#f87171", background: "transparent", border: "none", cursor: "pointer" }}>Clear all</button>
          </div>
          {history.map(item => (
            <HistoryItem key={item.id} item={item} accentColor={accentColor} onLoad={onLoad} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
