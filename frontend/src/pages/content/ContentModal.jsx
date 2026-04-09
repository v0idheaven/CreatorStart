import { X, Check, Trash2 } from "lucide-react"
import { STATUSES } from "./contentConfig"

// Add/Edit content modal
export function ContentFormModal({ modal, form, types, accent, onChange, onSave, onClose }) {
  const set = (k) => (e) => onChange(k, e.target.value)
  return (
    <>
      <div onClick={onClose} className="modal-overlay" />
      <div className="modal-box" style={{ width: "100%", maxWidth: "480px" }}>
        <div className="modal-head">
          <h2 className="modal-title">{modal === "add" ? "Add Content" : "Edit Content"}</h2>
          <button onClick={onClose} className="modal-close"><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div>
            <label className="field-label">Title</label>
            <input className="input-sm" value={form.title} onChange={set("title")} placeholder="Content title..." style={{ width: "100%" }} />
          </div>
          <div>
            <label className="field-label">Thumbnail URL <span style={{ color: "var(--dim)", fontWeight: "400" }}>(optional)</span></label>
            <input className="input-sm" value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://..." style={{ width: "100%" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="field-label">Type</label>
              <select className="input-sm" value={form.type} onChange={set("type")} style={{ width: "100%" }}>
                <option value="">Select type</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="input-sm" value={form.status} onChange={set("status")} style={{ width: "100%" }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {["views", "likes", "comments"].map(k => (
              <div key={k}>
                <label className="field-label" style={{ textTransform: "capitalize" }}>{k}</label>
                <input className="input-sm" value={form[k]} onChange={set(k)} placeholder="0" style={{ width: "100%" }} />
              </div>
            ))}
          </div>
          <div>
            <label className="field-label">Notes</label>
            <textarea className="input-sm" value={form.notes} onChange={set("notes")} placeholder="Any notes..." rows={2} style={{ width: "100%", resize: "vertical" }} />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onSave} className="btn-primary" style={{ flex: 1, background: accent, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
            <Check size={13} />{modal === "add" ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </>
  )
}

// Delete confirmation modal
export function DeleteModal({ onClose, onConfirm }) {
  return (
    <>
      <div onClick={onClose} className="modal-overlay" />
      <div className="modal-box" style={{ padding: "28px", width: "100%", maxWidth: "340px", textAlign: "center" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Trash2 size={20} color="#f87171" />
        </div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Delete this?</h2>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 20px" }}>This content entry will be permanently removed.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Delete</button>
        </div>
      </div>
    </>
  )
}
