import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, X, Check, Filter } from "lucide-react"
import Sidebar from "../components/Sidebar"

const COLORS = { youtube: "#ff4444", instagram: "#c13584", both: "#818cf8" }

const YT_TYPES = ["Video", "Short", "Live"]
const IG_TYPES = ["Reel", "Carousel", "Post", "Story"]
const BOTH_TYPES = ["Video", "Short", "Reel", "Carousel", "Post", "Story", "Live"]
const STATUSES = ["Idea", "Scripting", "Filming", "Editing", "Published"]

function getStorageKey(platform) {
  return `content_data_${platform}`
}

function loadContent(platform) {
  return JSON.parse(localStorage.getItem(getStorageKey(platform)) || "[]")
}

function saveContent(platform, data) {
  localStorage.setItem(getStorageKey(platform), JSON.stringify(data))
}

const empty = { title: "", type: "", status: "Idea", platform: "", views: "", likes: "", comments: "", notes: "", thumbnail: "" }

export default function Content() {
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both
  const types = platform === "youtube" ? YT_TYPES : platform === "instagram" ? IG_TYPES : BOTH_TYPES

  const [items, setItems] = useState(() => loadContent(platform))
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterType, setFilterType] = useState("All")
  const [modal, setModal] = useState(null) // null | "add" | item (edit)
  const [form, setForm] = useState(empty)
  const [deleteId, setDeleteId] = useState(null)

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })) }

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
    let updated
    if (modal === "add") {
      updated = [{ ...form, id: Date.now() }, ...items]
    } else {
      updated = items.map(i => i.id === modal.id ? { ...form, id: modal.id } : i)
    }
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

  const statusColor = { Idea: "#818cf8", Scripting: "#f59e0b", Filming: "#f97316", Editing: "#06b6d4", Published: "#4ade80" }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ marginLeft: "72px", flex: 1 }}>
        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 48px" }}>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>Library</p>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: 0 }}>Content</h1>
            </div>
            <button onClick={openAdd}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "9px", border: "none", background: accent, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <Plus size={14} /> Add Content
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "4px" }}>
              <Filter size={13} color="var(--dim)" />
            </div>
            {["All", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "4px 12px", borderRadius: "20px", border: `1px solid ${filterStatus === s ? accent : "var(--border)"}`, background: filterStatus === s ? accent + "15" : "transparent", color: filterStatus === s ? accent : "var(--muted)", fontSize: "12px", cursor: "pointer" }}>
                {s}
              </button>
            ))}
            <div style={{ width: "1px", background: "var(--border)", margin: "0 4px" }} />
            {["All", ...types].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                style={{ padding: "4px 12px", borderRadius: "20px", border: `1px solid ${filterType === t ? accent : "var(--border)"}`, background: filterType === t ? accent + "15" : "transparent", color: filterType === t ? accent : "var(--muted)", fontSize: "12px", cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>No content yet</p>
              <p style={{ fontSize: "13px", color: "var(--dim)", margin: "0 0 20px" }}>Track your videos, reels, and posts here.</p>
              <button onClick={openAdd}
                style={{ padding: "8px 20px", borderRadius: "9px", border: "none", background: accent, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Add your first piece
              </button>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Title", "Type", "Status", "Views", "Likes", "Comments", ""].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "11px 14px", fontSize: "13px", color: "var(--text)", fontWeight: "500", maxWidth: "220px" }}>
                        <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                        {item.notes && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.notes}</p>}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: accent, background: accent + "15", padding: "2px 8px", borderRadius: "4px" }}>{item.type || "—"}</span>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: statusColor[item.status] || "var(--dim)", background: (statusColor[item.status] || "#888") + "15", padding: "2px 8px", borderRadius: "4px" }}>{item.status}</span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", color: "var(--muted)" }}>{item.views || "—"}</td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", color: "var(--muted)" }}>{item.likes || "—"}</td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", color: "var(--muted)" }}>{item.comments || "—"}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                          <button onClick={() => openEdit(item)}
                            style={{ padding: "5px", borderRadius: "6px", border: "none", background: "transparent", color: "var(--dim)", cursor: "pointer", display: "flex" }}
                            onMouseEnter={e => e.currentTarget.style.color = accent}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(item.id)}
                            style={{ padding: "5px", borderRadius: "6px", border: "none", background: "transparent", color: "var(--dim)", cursor: "pointer", display: "flex" }}
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

      {/* Add/Edit modal */}
      {modal && (
        <>
          <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", width: "100%", maxWidth: "480px", zIndex: 101, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", margin: 0 }}>{modal === "add" ? "Add Content" : "Edit Content"}</h2>
              <button onClick={() => setModal(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex" }}><X size={16} /></button>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Title</label>
                <input className="input-sm" value={form.title} onChange={set("title")} placeholder="Content title..." style={{ width: "100%", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Thumbnail URL <span style={{ color: "var(--dim)", fontWeight: "400" }}>(optional)</span></label>
                <input className="input-sm" value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://..." style={{ width: "100%", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Type</label>
                  <select className="input-sm" value={form.type} onChange={set("type")} style={{ width: "100%" }}>
                    <option value="">Select type</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Status</label>
                  <select className="input-sm" value={form.status} onChange={set("status")} style={{ width: "100%" }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Views</label>
                  <input className="input-sm" value={form.views} onChange={set("views")} placeholder="0" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Likes</label>
                  <input className="input-sm" value={form.likes} onChange={set("likes")} placeholder="0" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Comments</label>
                  <input className="input-sm" value={form.comments} onChange={set("comments")} placeholder="0" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "5px" }}>Notes</label>
                <textarea className="input-sm" value={form.notes} onChange={set("notes")} placeholder="Any notes..." rows={2} style={{ width: "100%", boxSizing: "border-box", resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: accent, color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <Check size={13} />{modal === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <>
          <div onClick={() => setDeleteId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "340px", zIndex: 101, textAlign: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f8717115", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Trash2 size={20} color="#f87171" />
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: "0 0 8px" }}>Delete this?</h2>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 20px" }}>This content entry will be permanently removed.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: "#f87171", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
