import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, Check, CalendarDays } from "lucide-react"

// Modal to pick a planner day and save the generated content to it
export default function AddToPlannerModal({ result, color, onClose }) {
  const navigate = useNavigate()
  const [plannerSaved, setPlannerSaved] = useState(false)
  const _plat = localStorage.getItem("platform") || "both"
  const saved = JSON.parse(localStorage.getItem(`planner_data_${_plat}`) || "null")

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", width: "100%", maxWidth: "480px", zIndex: 51, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", margin: 0 }}>Add to Planner</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex" }}><X size={16} /></button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--dim)", margin: "0 0 16px" }}>Pick any day — empty days will be filled, filled days will be replaced.</p>

        {!saved ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <p style={{ fontSize: "13px", color: "var(--dim)", margin: "0 0 12px" }}>No planner found. Create a plan first.</p>
            <button onClick={() => { onClose(); navigate("/planner") }}
              style={{ padding: "9px 18px", borderRadius: "9px", border: "none", background: color, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CalendarDays size={14} /> Go to Planner
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", maxHeight: "260px", overflowY: "auto", marginBottom: "14px" }}>
            {saved.entries.map(e => {
              const isEmpty = !e.content
              const dateNum = e.date ? new Date(e.date).getDate() : e.day
              const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
              const todayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
              const entryDate = e.date ? new Date(e.date) : null
              if (entryDate) entryDate.setHours(0, 0, 0, 0)
              const isPast = entryDate ? entryDate < todayIST : false

              return (
                <div key={e.day}
                  onClick={() => {
                    if (isPast) return
                    const title = result.title || result.hook || result.caption || "Content idea"
                    const updated = saved.entries.map(en => en.day === e.day ? { ...en, content: title, active: true } : en)
                    localStorage.setItem(`planner_data_${_plat}`, JSON.stringify({ ...saved, entries: updated }))
                    setPlannerSaved(true)
                    setTimeout(() => { onClose(); }, 1200)
                  }}
                  onMouseEnter={el => { if (!isPast) el.currentTarget.style.borderColor = color }}
                  onMouseLeave={el => el.currentTarget.style.borderColor = isPast ? "var(--border)" : isEmpty ? "var(--border2)" : "var(--border)"}
                  style={{ padding: "8px 6px", borderRadius: "8px", border: `1.5px solid ${isPast ? "var(--border)" : isEmpty ? "var(--border2)" : "var(--border)"}`, background: isPast ? "transparent" : isEmpty ? "var(--bg)" : "var(--card)", cursor: isPast ? "not-allowed" : "pointer", textAlign: "center", transition: "border-color 0.12s", opacity: isPast ? 0.35 : 1 }}>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: isPast ? "var(--dim)" : isEmpty ? "var(--text)" : color, margin: "0 0 2px", lineHeight: 1 }}>{dateNum}</p>
                  <p style={{ fontSize: "9px", color: "var(--dim)", margin: "0 0 3px" }}>{e.dayName || ""}</p>
                  <p style={{ fontSize: "9px", color: "var(--muted)", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {isPast ? "past" : isEmpty ? "empty" : "replace"}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {plannerSaved && (
          <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "#4ade8015", border: "1px solid #4ade8030", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Check size={13} color="#4ade80" />
            <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "600" }}>Added to your planner!</span>
          </div>
        )}
      </div>
    </>
  )
}
