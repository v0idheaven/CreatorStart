import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Youtube, Instagram, LayoutGrid, ArrowRight } from "lucide-react"

export default function PlatformSelect() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>

      <div style={{ marginBottom: "24px" }}>
        <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--text)" }}>
          Creator<span style={{ color: "var(--accent)" }}>Start</span>
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: "400px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px 28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text)", margin: "0 0 4px" }}>
          Where do you create?
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 24px" }}>
          Choose your platform. You can change this later.
        </p>

        <div className="platform-cards-row">
          <div
            className="platform-card"
            onClick={() => setSelected("youtube")}
            style={{
              border: `2px solid ${selected === "youtube" ? "#ff4444" : "var(--border2)"}`,
              background: selected === "youtube" ? "#ff000012" : "var(--bg)",
            }}
          >
            <Youtube size={22} color={selected === "youtube" ? "#ff0000" : "var(--muted)"} strokeWidth={1.8} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: selected === "youtube" ? "var(--text)" : "var(--muted)" }}>
              YouTube
            </span>
            <span style={{ fontSize: "11px", color: "var(--dim)", textAlign: "center", lineHeight: "1.4" }}>
              Plan & grow your channel
            </span>
          </div>

          <div
            className="platform-card"
            onClick={() => setSelected("instagram")}
            style={{
              border: `2px solid ${selected === "instagram" ? "#e1306c" : "var(--border2)"}`,
              background: selected === "instagram" ? "#c1358412" : "var(--bg)",
            }}
          >
            <Instagram size={22} color={selected === "instagram" ? "#c13584" : "var(--muted)"} strokeWidth={1.8} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: selected === "instagram" ? "var(--text)" : "var(--muted)" }}>
              Instagram
            </span>
            <span style={{ fontSize: "11px", color: "var(--dim)", textAlign: "center", lineHeight: "1.4" }}>
              Reels, posts & growth
            </span>
          </div>
        </div>

        <div
          className="platform-card-both"
          onClick={() => setSelected("both")}
          style={{
            border: `2px solid ${selected === "both" ? "#818cf8" : "var(--border2)"}`,
            background: selected === "both" ? "#818cf812" : "var(--bg)",
          }}
        >
          <LayoutGrid size={20} color={selected === "both" ? "var(--accent)" : "var(--muted)"} strokeWidth={1.8} />
          <div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: selected === "both" ? "var(--text)" : "var(--muted)", margin: "0 0 2px" }}>
              Both platforms
            </p>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>
              One dashboard for everything
            </p>
          </div>
        </div>

        <button
          onClick={() => selected && navigate("/dashboard")}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "10px",
            border: "none",
            background: selected ? "var(--accent)" : "var(--border)",
            color: selected ? "#fff" : "var(--dim)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: selected ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          Continue {selected && <ArrowRight size={14} />}
        </button>
      </div>

      <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--dim)" }}>
        You can change your platform anytime in settings.
      </p>
    </div>
  )
}
