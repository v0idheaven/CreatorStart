import { useState } from "react"
import { Zap, Copy, Check, Loader } from "lucide-react"
import { API_ENDPOINTS } from "../../constants/api"

export default function HookVariations({ topic, platform, tone, niche, accentColor }) {
  const [hooks, setHooks] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.contentHooks, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, niche })
      })
      const data = await res.json()
      if (res.ok && data?.data?.hooks) setHooks(data.data.hooks)
    } catch (e) { console.warn(e) }
    setLoading(false)
  }

  function copy(text, i) {
    navigator.clipboard.writeText(text)
    setCopied(i); setTimeout(() => setCopied(null), 2000)
  }

  if (!hooks && !loading) {
    return (
      <button onClick={generate}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: `1px solid ${accentColor}40`, background: accentColor + "10", color: accentColor, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
        <Zap size={13} /> Generate 5 hook variations
      </button>
    )
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", color: "var(--dim)", fontSize: "12px" }}>
        <Loader size={13} style={{ animation: "spin 0.8s linear infinite" }} /> Writing hooks...
      </div>
    )
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", marginTop: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>5 Hook Variations</p>
        <button onClick={() => setHooks(null)} style={{ fontSize: "11px", color: "var(--dim)", background: "transparent", border: "none", cursor: "pointer" }}>Regenerate</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {hooks.map((hook, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", borderRadius: "9px", background: "var(--bg)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: accentColor, background: accentColor + "15", padding: "2px 7px", borderRadius: "5px", flexShrink: 0, marginTop: "1px" }}>#{i + 1}</span>
            <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, flex: 1, lineHeight: "1.5" }}>{hook}</p>
            <button onClick={() => copy(hook, i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: copied === i ? "#4ade80" : "var(--dim)", flexShrink: 0 }}>
              {copied === i ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
