import { useState } from "react"
import { PLATFORM_DATA } from "./landingData"

// Interactive mock dashboard preview in the hero section
export default function MockDashboard() {
  const [active, setActive] = useState("youtube")
  const d = PLATFORM_DATA[active]

  return (
    <div className="mock-dashboard">
      <div className="mock-titlebar">
        <span className="mock-dot" style={{ background: "#ff7a66" }} />
        <span className="mock-dot" style={{ background: "#f4c04d" }} />
        <span className="mock-dot" style={{ background: "#72d56a" }} />
        <div className="mock-url">creatorstart.app/dashboard</div>
      </div>

      <div className="mock-tabs">
        {[["youtube","YT"],["instagram","IG"],["both","Both"]].map(([id, label]) => (
          <button key={id} onClick={() => setActive(id)} className="mock-tab"
            style={{ background: active === id ? "#1a1a1a" : "transparent", color: active === id ? PLATFORM_DATA[id].color : "rgba(255,255,255,0.35)", borderBottom: active === id ? `2px solid ${PLATFORM_DATA[id].color}` : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      <div className="mock-body">
        <div className="mock-kicker">
          <div className="mock-kicker-dot" style={{ background: d.color }} />
          <span className="mock-kicker-label" style={{ color: d.color }}>{d.label}</span>
        </div>
        <div className="mock-stats-grid">
          {d.stats.map(([v, l], i) => (
            <div key={l} className="mock-stat-card">
              <p className="mock-stat-label">{l}</p>
              <p className="mock-stat-value" style={{ color: d.statColors[i] }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="mock-recent">
          {d.recent.map((r, i) => (
            <div key={i} className="mock-recent-row">
              <p className="mock-recent-title">{r.title}</p>
              <span className="mock-recent-type" style={{ color: d.color, background: d.bg }}>{r.type}</span>
              <span className="mock-recent-views">{r.views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
