import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, X, Check, Filter } from "lucide-react"
import Sidebar from "../components/Sidebar"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }
const YT_TYPES = ["Video", "Short", "Live"]
const IG_TYPES = ["Reel", "Carousel", "Post", "Story"]
const BOTH_TYPES = ["Video", "Short", "Reel", "Carousel", "Post", "Story", "Live"]
const STATUSES = ["Idea", "Scripting", "Filming", "Editing", "Published"]
const STATUS_COLORS = { Idea: "#818cf8", Scripting: "#f59e0b", Filming: "#f97316", Editing: "#06b6d4", Published: "#4ade80" }

function getStorageKey(platform) { return `content_data_${platform}` }
function loadContent(platform) { return JSON.parse(localStorage.getItem(getStorageKey(platform)) || "[]") }
function saveContent(platform, data) { localStorage.setItem(getStorageKey(platform), JSON.stringify(data)) }

const empty = { title: "", type: "", status: "Idea", platform: "", views: "", likes: "", comments: "", notes: "", thumbnail: "" }

export default function Content() {
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both
  const types = platform === "youtube" ? YT_TYPES : platform === "instagram" ? IG_TYPES : BOTH_TYPES

  const [items, setItems] = useState(() => loadContent(platform))
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterType, setFilterType] = useState("All")
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [deleteId, setDeleteId] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  function openAdd() {
    setForm({ ...empty, platform: platform === "both" ? "youtube" : platform })
    setModal("add")
  }

  function openEdit(item) {
    setForm({ ...item })
    setModal(item)
  }

  function handleSave() {
    if (!form.title.trim()) return
    const updated = modal === "add"
      ? [{ ...form, id: Date.now() }, ...items]
      : items.map(i => i.id === modal.id ? { ...form, id: modal.id } : i)
    setItems(updated)
    saveContent(platform, updated)
    setModal(null)
  }

  function handleDelete(id) {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    saveContent(platform, updated)
    setDeleteId(null)
  }

  const filtered = useMemo(() => items.filter(i => {
    if (filterStatus !== "All" && i.status !== filterStatus) return false
    if (filterType !== "All" && i.type !== filterType) return false
    return true
  }), [items, filterStatus, filterType])

  return (
    <div className="page-root">
      <Sidebar />
      <div className="page-content">
        <main className="page-main">
          <div className="page-header">
            <div>
              <p className="page-kicker">Library</p>
              <h1 className="page-title">Content</h1>
            </div>
            <button onClick={openAdd} className="btn-primary" style={{ background: accent, display: "flex", alignItems: "center", gap: "6px" }}>
              <Plus size={14} /> Add Content
            </button>
          </div>

          <div className="filter-row">
            <Filter size={13} color="var(--dim)" />
            {["All", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className="filter-chip"
                style={{ border: `1px solid ${filterStatus === s ? accent : "var(--border)"}`, background: filterStatus === s ? accent + "15" : "transparent", color: filterStatus === s ? accent : "var(--muted)" }}>
                {s}
              </button>
            ))}
            <div style={{ width: "1px", background: "var(--border)", margin: "0 4px" }} />
            {["All", ...types].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className="filter-chip"
                style={{ border: `1px solid ${filterType === t ? accent : "var(--border)"}`, background: filterType === t ? accent + "15" : "transparent", color: filterType === t ? accent : "var(--muted)" }}>
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card empty-state">
              <p className="empty-title">No content yet</p>
              <p className="empty-sub">Track your videos, reels, and posts here.</p>
              <button onClick={openAdd} className="btn-primary" style={{ background: accent }}>Add your first piece</button>
            </div>
          ) : (
            <div className="card table-wrap">
              <table className="table-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Title", "Type", "Status", "Views", "Likes", "Comments", ""].map(h => (
                      <th key={h} className="table-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr key={item.id} className="table-row">
                      <td className="table-td" style={{ maxWidth: "220px" }}>
                        <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)", fontWeight: "500" }}>{item.title}</p>
                        {item.notes && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.notes}</p>}
                      </td>
                      <td className="table-td">
                        <span className="badge" style={{ color: accent, background: accent + "15" }}>{item.type || "—"}</span>
                      </td>
                      <td className="table-td">
                        <span className="badge" style={{ color: STATUS_COLORS[item.status] || "var(--dim)", background: (STATUS_COLORS[item.status] || "#888") + "15" }}>{item.status}</span>
                      </td>
                      <td className="table-td">{item.views || "—"}</td>
                      <td className="table-td">{item.likes || "—"}</td>
                      <td className="table-td">{item.comments || "—"}</td>
                      <td className="table-td">
                        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                          <button onClick={() => openEdit(item)} className="icon-btn"
                            onMouseEnter={e => e.currentTarget.style.color = accent}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(item.id)} className="icon-btn"
                            onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {modal && (
        <>
          <div onClick={() => setModal(null)} className="modal-overlay" />
          <div className="modal-box" style={{ width: "100%", maxWidth: "480px" }}>
            <div className="modal-head">
              <h2 className="modal-title">{modal === "add" ? "Add Content" : "Edit Content"}</h2>
              <button onClick={() => setModal(null)} className="modal-close"><X size={16} /></button>
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
              <button onClick={() => setModal(null)} className="btn-cancel">Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1, background: accent, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <Check size={13} />{modal === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      {deleteId && (
        <>
          <div onClick={() => setDeleteId(null)} className="modal-overlay" />
          <div className="modal-box" style={{ padding: "28px", width: "100%", maxWidth: "340px", textAlign: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Trash2 size={20} color="#f87171" />
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Delete this?</h2>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 20px" }}>This content entry will be permanently removed.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} className="btn-cancel">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger">Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
