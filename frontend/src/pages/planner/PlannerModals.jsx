import { useState } from "react"
import { Check, X, StickyNote } from "lucide-react"
import { COLORS, PC } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

export function EditModal({ entry, onClose, onSave }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both
  const [editContent, setEditContent] = useState(entry.content)
  const [editNote, setEditNote] = useState(entry.note || "")
  const [editPlatform, setEditPlatform] = useState(entry.platform)
  const [showNote, setShowNote] = useState(!!entry.note)

  return (
    <>
      <div onClick={onClose} className="planner-overlay planner-overlay-soft" />
      <div className="planner-modal planner-modal-md">
        <div className="planner-modal-head">
          <h2 className="planner-modal-title">Edit Day {entry.day}</h2>
          <button onClick={onClose} className="planner-modal-close"><X size={16} /></button>
        </div>
        <div className="planner-modal-body">
          <div>
            <label className="planner-field-label">Content idea</label>
            <textarea className="input-sm planner-textarea" rows={3} value={editContent} onChange={e => setEditContent(e.target.value)} />
          </div>
          <div>
            <button onClick={() => setShowNote(!showNote)} className="planner-note-toggle" style={{ color: showNote ? "#f59e0b" : "var(--dim)" }}>
              <StickyNote size={13} />{showNote ? "Remove note" : "Add a note"}
            </button>
            {showNote && (
              <textarea className="input-sm planner-textarea-note" rows={2} placeholder="Add a note for this day..." value={editNote} onChange={e => setEditNote(e.target.value)} style={{ borderColor: "#f59e0b50" }} />
            )}
          </div>
          {platform === "both" && (
            <div>
              <label className="planner-field-label" style={{ marginBottom: "8px" }}>Platform</label>
              <div className="planner-platform-row">
                {["youtube", "instagram", "both"].map(p => (
                  <button key={p} onClick={() => setEditPlatform(p)}
                    style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `1.5px solid ${editPlatform === p ? PC[p].color : "var(--border2)"}`, background: editPlatform === p ? PC[p].bg : "transparent", color: editPlatform === p ? PC[p].color : "var(--muted)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                    {PC[p].label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="planner-modal-actions planner-modal-actions-top">
          <button onClick={onClose} className="planner-btn-secondary">Cancel</button>
          <button onClick={() => onSave({ content: editContent, note: editNote, platform: editPlatform })} className="planner-btn-fill" style={{ background: accent }}>
            <Check size={13} />Save
          </button>
        </div>
      </div>
    </>
  )
}

export function ConfirmNewModal({ onClose, onConfirm }) {
  return (
    <>
      <div onClick={onClose} className="planner-overlay planner-overlay-strong" />
      <div className="planner-modal planner-modal-danger">
        <div className="planner-danger-icon"><X size={22} color="#f87171" /></div>
        <h2 className="planner-danger-title">You'll lose your data</h2>
        <p className="planner-danger-copy">Creating a new plan will permanently delete your current 30-day plan and all progress. This can't be undone.</p>
        <div className="planner-modal-actions">
          <button onClick={onClose} className="planner-btn-secondary">Keep my plan</button>
          <button onClick={onConfirm} className="planner-btn-fill-danger">Yes, delete it</button>
        </div>
      </div>
    </>
  )
}

export function AddDayModal({ entry, onClose, onAdd }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both
  const [content, setContent] = useState("")

  return (
    <>
      <div onClick={onClose} className="planner-overlay planner-overlay-soft" />
      <div className="planner-modal planner-modal-sm">
        <div className="planner-modal-head planner-modal-head-sm">
          <h2 className="planner-modal-title planner-modal-title-sm">Add to {entry.dayName}, {entry.dateLabel}</h2>
          <button onClick={onClose} className="planner-modal-close"><X size={15} /></button>
        </div>
        <textarea className="input-sm planner-textarea-add" rows={3} placeholder="What will you post on this day?" value={content} onChange={e => setContent(e.target.value)} style={{ borderColor: content ? accent : "var(--border2)" }} />
        <div className="planner-modal-actions">
          <button onClick={onClose} className="planner-btn-secondary">Cancel</button>
          <button onClick={() => { if (content.trim()) onAdd(entry, content.trim()) }} className="planner-btn-fill planner-btn-fill-sm" style={{ background: accent }}>
            <Check size={13} /> Add
          </button>
        </div>
      </div>
    </>
  )
}
