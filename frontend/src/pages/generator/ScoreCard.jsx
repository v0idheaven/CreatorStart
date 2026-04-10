import { useState } from "react"
import { Zap, Eye, MousePointerClick, Star, Loader } from "lucide-react"
import { API_ENDPOINTS } from "../../constants/api"

function ScoreBadge({ score }) {
  const color = score >= 8 ? "#4ade80" : score >= 6 ? "#f59e0b" : "#f87171"
  return (
    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: color + "20", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "12px", fontWeight: "800", color }}>{score}</span>
    </div>
  )
}

function ScoreRow({ icon: Icon, label, score, feedback, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={13} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>{label}</p>
        <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>{feedback}</p>
      </div>
      <ScoreBadge score={score} />
    </div>
  )
}

export default function ScoreCard({ content, platform, accentColor }) {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.contentScore, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platform })
      })
      const data = await res.json()
      if (res.ok && data?.data) setScore(data.data)
    } catch (e) { console.warn(e) }
    setLoading(false)
  }

  if (!score && !loading) {
    return (
      <button onClick={analyze}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: `1px solid ${accentColor}40`, background: accentColor + "10", color: accentColor, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
        <Star size={13} /> Score this content
      </button>
    )
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", color: "var(--dim)", fontSize: "12px" }}>
        <Loader size={13} style={{ animation: "spin 0.8s linear infinite" }} /> Analyzing...
      </div>
    )
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", marginTop: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Content Score</p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "var(--dim)" }}>Overall</span>
          <ScoreBadge score={score.overall} />
        </div>
      </div>
      <ScoreRow icon={Zap} label="Hook Strength" score={score.hookStrength} feedback={score.hookFeedback} color="#f59e0b" />
      <ScoreRow icon={Eye} label="Clarity" score={score.clarity} feedback={score.clarityFeedback} color="#818cf8" />
      <ScoreRow icon={MousePointerClick} label="CTA Power" score={score.ctaPower} feedback={score.ctaFeedback} color="#4ade80" />
      {score.tip && (
        <div style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "8px", background: accentColor + "10", border: `1px solid ${accentColor}20` }}>
          <p style={{ fontSize: "11px", color: accentColor, margin: 0, fontWeight: "600" }}>💡 {score.tip}</p>
        </div>
      )}
      <button onClick={() => setScore(null)} style={{ marginTop: "8px", fontSize: "11px", color: "var(--dim)", background: "transparent", border: "none", cursor: "pointer" }}>Re-analyze</button>
    </div>
  )
}
