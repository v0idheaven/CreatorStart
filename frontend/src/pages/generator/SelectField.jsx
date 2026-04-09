import { useState } from "react"
import { ChevronDown } from "lucide-react"

// Dropdown with optional "Other" free-text input
export default function SelectField({ label, options, value, customValue, onCustomChange, onChange, accentColor }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative" }}>
        <label style={{ fontSize: "12px", fontWeight: "500", color: "var(--muted)", display: "block", marginBottom: "6px" }}>{label}</label>
        <div className="select-trigger" onClick={() => setOpen(p => !p)}
          style={{ border: `1px solid ${open ? accentColor : "var(--border2)"}`, color: value ? "var(--text)" : "var(--dim)" }}>
          <span>{value || `Select ${label}`}</span>
          <ChevronDown size={14} color="var(--muted)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </div>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div className="select-dropdown">
              {options.map(opt => (
                <div key={opt} className={`dropdown-item ${value === opt ? "selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false) }}>{opt}</div>
              ))}
            </div>
          </>
        )}
      </div>
      {value === "Other" && (
        <input autoFocus className="input-sm" placeholder={`Enter custom ${label.toLowerCase()}...`}
          value={customValue} onChange={e => onCustomChange(e.target.value)} style={{ borderColor: accentColor }} />
      )}
    </div>
  )
}
