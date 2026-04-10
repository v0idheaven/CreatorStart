import { Loader } from "lucide-react"

// One-click refinement chips shown after generation
const CHIPS = [
  { id: "hook_stronger", label: "⚡ Stronger hook" },
  { id: "add_ending", label: "🎯 Add strong ending" },
  { id: "make_shorter", label: "✂️ Make shorter" },
  { id: "make_longer", label: "📝 Make longer" },
  { id: "more_engaging", label: "🔥 More engaging" },
  { id: "add_cta", label: "👆 Better CTA" },
  { id: "thumbnail_ideas", label: "🖼️ Thumbnail ideas" },
  { id: "add_story", label: "💬 Add personal story" },
]

export default function RefinementChips({ onRefine, loading, color }) {
  return (
    <div style={{ padding: "14px 16px", background: "var(--bg)", borderRadius: "12px", border: "1px solid var(--border)" }}>
      <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--dim)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Refine this content
      </p>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
        {CHIPS.map(chip => (
          <button key={chip.id} onClick={() => onRefine(chip.id, chip.label)} disabled={loading}
            style={{ padding: "6px 12px", borderRadius: "20px", border: `1px solid var(--border)`, background: "var(--card)", color: "var(--muted)", fontSize: "12px", fontWeight: "500", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.12s", opacity: loading ? 0.5 : 1, display: "flex", alignItems: "center", gap: "4px" }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.background = color + "10" } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--card)" }}>
            {loading ? <Loader size={10} style={{ animation: "spin 0.8s linear infinite" }} /> : null}
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
