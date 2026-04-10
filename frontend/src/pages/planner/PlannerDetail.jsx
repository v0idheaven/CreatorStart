import { Check, Pencil, X, Trash2, Sparkles, Plus } from "lucide-react"
import { COLORS, PC } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

export default function PlannerDetail({ activeEntry, entries, planInfo, aiDetail, aiLoading, aiError, activeExtraIdx, setActiveExtraIdx, onClose, onEdit, onToggleDone, onDelete, onAddDay, onGenerateBrief, onGenerateExtraBrief, onRemoveExtraPost }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both

  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
  today.setHours(0, 0, 0, 0)
  const entryDate = activeEntry.date ? new Date(activeEntry.date) : null
  if (entryDate) entryDate.setHours(0, 0, 0, 0)
  const isFuture = entryDate && entryDate > today
  const isPast = entryDate && entryDate < today

  return (
    <div className="planner-detail-wrap" style={{ borderTop: `2px solid ${accent}` }}>
      <div className="planner-detail-head">
        <div className="planner-detail-head-left">
          <span className="planner-detail-date">{activeEntry.dayName}, {activeEntry.dateLabel}</span>
          {activeEntry.isToday && <span className="planner-detail-today-tag">Today</span>}
          <span className="planner-detail-tag" style={{ color: PC[activeEntry.platform].color, background: PC[activeEntry.platform].bg }}>{PC[activeEntry.platform].label}</span>
          {activeEntry.isCompleted && <span className="planner-detail-done-tag">✓ Done</span>}
        </div>
        <div className="planner-detail-head-right">
          {isFuture && <span className="planner-detail-unavailable">Available on {activeEntry.dateLabel}</span>}
          {isPast && <span className="planner-detail-unavailable">{activeEntry.isCompleted ? "✓ Completed" : "Missed"}</span>}
          {!isFuture && !isPast && (
            <button onClick={() => onToggleDone(activeEntry.id)} className="planner-detail-status-btn">
              <Check size={11} />{activeEntry.isCompleted ? "Undo" : "Mark done"}
            </button>
          )}
          <button onClick={() => onEdit(activeEntry)} className="planner-detail-edit-btn" style={{ border: `1px solid ${accent}30`, color: accent }}>
            <Pencil size={11} />Edit
          </button>
          {!isPast && (
            <button onClick={() => onDelete(activeEntry)} className="planner-detail-delete-btn">
              <Trash2 size={11} />Delete
            </button>
          )}
          <button onClick={onClose} className="planner-detail-close-btn">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="planner-detail-body">
        <div>
          <p className="planner-detail-content">{activeEntry.content}</p>
          {activeEntry.extraPosts?.length > 0 && (
            <div className="planner-extra-posts">
              {activeEntry.extraPosts.map((post, i) => (
                <div key={i} className="planner-extra-post" style={{ borderColor: activeExtraIdx === i ? accent + "60" : "var(--border)" }}>
                  <span className="planner-extra-num" style={{ color: accent, background: accent + "15" }}>#{i + 2}</span>
                  <p className="planner-extra-text">{post}</p>
                  <button onClick={() => { setActiveExtraIdx(i); onGenerateExtraBrief({ ...activeEntry, content: post }) }}
                    className="planner-extra-brief-btn" style={{ border: `1px solid ${accent}30`, color: accent }}>
                    <Sparkles size={10} /> Brief
                  </button>
                  <button onClick={() => onRemoveExtraPost(activeEntry.id, i)} className="planner-extra-remove-btn">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {!isPast && (
            <button onClick={() => onAddDay(activeEntry)} className="planner-add-post-btn" style={{ border: `1px solid ${accent}30`, color: accent }}>
              <Plus size={12} /> Add another post for this day
            </button>
          )}
        </div>

        {aiLoading && (
          <div className="planner-loading-row">
            <div className="spinner spinner-sm" style={{ borderTopColor: accent }} />
            Generating content brief...
          </div>
        )}
        {aiError && <p style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{aiError}</p>}
        {aiDetail && (
          <div className="planner-ai-grid">
            {[{ key: "hook", label: "Hook" }, { key: "cta", label: "Call to Action" }, { key: "whatToSay", label: "What to Say" }, { key: "tip", label: "Pro Tip" }].map(({ key, label }) => aiDetail[key] && (
              <div key={key} className="planner-ai-card">
                <p className="planner-ai-card-label" style={{ color: accent }}>{label}</p>
                <p className="planner-ai-card-text">{aiDetail[key]}</p>
              </div>
            ))}
            {aiDetail.script && (
              <div className="planner-ai-card" style={{ gridColumn: "1 / -1" }}>
                <p className="planner-ai-card-label" style={{ color: accent }}>Script Outline</p>
                <p className="planner-ai-card-text">{aiDetail.script}</p>
              </div>
            )}
          </div>
        )}
        {!aiLoading && !aiDetail && !aiError && (
          <button onClick={() => onGenerateBrief(activeEntry)} className="planner-brief-btn"
            style={{ border: `1px solid ${accent}40`, background: accent + "12", color: accent }}>
            <Sparkles size={13} /> Generate content brief
          </button>
        )}
      </div>
    </div>
  )
}
