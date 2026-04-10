import { useState } from "react"
import { Palette, Copy, Check, Loader } from "lucide-react"
import { API_ENDPOINTS } from "../../constants/api"

const TONE_COLORS = { casual: "#818cf8", professional: "#06b6d4", funny: "#f59e0b" }

export default function ToneTester({ content, platform, accentColor }) {
  const [variants, setVariants] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("casual")
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.contentTones, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platform })
      })
      const data = await res.json()
      if (res.ok && data?.data) setVariants(data.data)
    } catch (e) { console.warn(e) }
    setLoading(false)
  }

  function copy() {
    if (!variants?.[activeTab]) return
    navigator.clipboard.writeText(variants[activeTab])
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (!variants && !loading) {
    return (
      <button onClick={generate}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: `1px solid ${accentColor}40`, background: accentColor + "10", color: accentColor, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
        <Palette size={13} /> Test in 3 tones
      </button>
    )
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", color: "var(--dim)", fontSize: "12px" }}>
        <Loader size={13} style={{ animation: "spin 0.8s linear infinite" }} /> Rewriting in 3 tones...
      </div>
    )
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", marginTop: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Tone Tester</p>
        <button onClick={() => setVariants(null)} style={{ fontSize: "11px", color: "var(--dim)", background: "transparent", border: "none", cursor: "pointer" }}>Regenerate</button>
      </div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {["casual", "professional", "funny"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: "5px 14px", borderRadius: "7px", border: `1px solid ${activeTab === t ? TONE_COLORS[t] : "var(--border)"}`, background: activeTab === t ? TONE_COLORS[t] + "15" : "transparent", color: activeTab === t ? TONE_COLORS[t] : "var(--muted)", fontSize: "12px", fontWeight: activeTab === t ? "600" : "400", cursor: "pointer", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap", padding: "12px", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)" }}>
          {variants?.[activeTab]}
        </p>
        <button onClick={copy} style={{ position: "absolute", top: "8px", right: "8px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: copied ? "#4ade80" : "var(--dim)" }}>
          {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  )
}
