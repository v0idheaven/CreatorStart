import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Youtube, Instagram, LayoutGrid, ArrowRight } from "lucide-react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

export default function PlatformSelect() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  async function handleContinue() {
    if (!selected) return
    localStorage.setItem("platform", selected)
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem("user", JSON.stringify({ ...user, platform: selected }))
    try {
      await apiFetch(API_ENDPOINTS.updateProfile, { method: "PATCH", body: JSON.stringify({ platform: selected }) })
    } catch {
      // silent — local state already updated
    }
    navigate("/dashboard")
  }

  return (
    <div className="platform-select-page">
      <div className="platform-select-logo">
        Creator<span style={{ color: "var(--accent)" }}>Start</span>
      </div>

      <div className="card platform-select-card">
        <h1 className="platform-select-title">Where do you create?</h1>
        <p className="platform-select-sub">Choose your platform. You can change this later.</p>

        <div className="platform-cards-row">
          <div className="platform-card"
            onClick={() => setSelected("youtube")}
            style={{ border: `2px solid ${selected === "youtube" ? "#ff4444" : "var(--border2)"}`, background: selected === "youtube" ? "#ff000012" : "var(--bg)" }}>
            <Youtube size={22} color={selected === "youtube" ? "#ff0000" : "var(--muted)"} strokeWidth={1.8} />
            <span className="platform-card-label" style={{ color: selected === "youtube" ? "var(--text)" : "var(--muted)" }}>YouTube</span>
            <span className="platform-card-desc">Plan & grow your channel</span>
          </div>

          <div className="platform-card"
            onClick={() => setSelected("instagram")}
            style={{ border: `2px solid ${selected === "instagram" ? "#e1306c" : "var(--border2)"}`, background: selected === "instagram" ? "#c1358412" : "var(--bg)" }}>
            <Instagram size={22} color={selected === "instagram" ? "#c13584" : "var(--muted)"} strokeWidth={1.8} />
            <span className="platform-card-label" style={{ color: selected === "instagram" ? "var(--text)" : "var(--muted)" }}>Instagram</span>
            <span className="platform-card-desc">Reels, posts & growth</span>
          </div>
        </div>

        <div className="platform-card-both"
          onClick={() => setSelected("both")}
          style={{ border: `2px solid ${selected === "both" ? "#2d8fa3" : "var(--border2)"}`, background: selected === "both" ? "#2d8fa312" : "var(--bg)" }}>
          <LayoutGrid size={20} color={selected === "both" ? "var(--accent)" : "var(--muted)"} strokeWidth={1.8} />
          <div>
            <p className="platform-card-label" style={{ color: selected === "both" ? "var(--text)" : "var(--muted)", margin: "0 0 2px" }}>Both platforms</p>
            <p className="platform-card-desc" style={{ margin: 0 }}>One dashboard for everything</p>
          </div>
        </div>

        <button onClick={handleContinue} disabled={!selected} className="platform-select-btn"
          style={{ background: selected ? "var(--accent)" : "var(--border)", color: selected ? "#fff" : "var(--dim)", cursor: selected ? "pointer" : "not-allowed" }}>
          Continue {selected && <ArrowRight size={14} />}
        </button>
      </div>

      <p className="platform-select-hint">You can change your platform anytime in settings.</p>
    </div>
  )
}
