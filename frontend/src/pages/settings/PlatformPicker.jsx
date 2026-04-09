import { Check, Youtube, Instagram, Layers } from "lucide-react"

const PLATFORMS = [
  { id: "youtube", label: "YouTube", desc: "Videos, Shorts & channel growth", color: "#ff4444", Icon: Youtube },
  { id: "instagram", label: "Instagram", desc: "Reels, posts & profile growth", color: "#c13584", Icon: Instagram },
  { id: "both", label: "Both Platforms", desc: "One dashboard for everything", color: "#818cf8", Icon: Layers },
]

// Platform selection cards (YouTube / Instagram / Both)
export default function PlatformPicker({ selected, onChange }) {
  return (
    <div className="settings-section">
      <p className="settings-section-label">Active Platform</p>
      <div className="settings-platform-grid">
        {PLATFORMS.map(p => (
          <div key={p.id} onClick={() => onChange(p.id)} className="settings-platform-card"
            style={{ border: `1.5px solid ${selected === p.id ? p.color : "var(--border)"}`, background: selected === p.id ? p.color + "10" : "var(--card)" }}>
            <div className="settings-platform-icon" style={{ background: p.color + "20" }}>
              <p.Icon size={14} color={p.color} strokeWidth={1.8} />
            </div>
            <p className="settings-platform-label" style={{ color: selected === p.id ? "var(--text)" : "var(--muted)" }}>{p.label}</p>
            <p className="settings-platform-desc">{p.desc}</p>
            {selected === p.id && (
              <div className="settings-platform-check" style={{ background: p.color }}>
                <Check size={9} color="#fff" strokeWidth={3} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
