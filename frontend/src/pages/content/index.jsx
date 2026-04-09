import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import ContentFilters from "./ContentFilters"
import ContentTable from "./ContentTable"
import { ContentFormModal, DeleteModal } from "./ContentModal"
import { COLORS, YT_TYPES, IG_TYPES, BOTH_TYPES, EMPTY_FORM, loadContent, saveContent } from "./contentConfig"

export default function Content() {
  const platform = localStorage.getItem("platform") || "both"
  const accent = COLORS[platform] || COLORS.both
  const types = platform === "youtube" ? YT_TYPES : platform === "instagram" ? IG_TYPES : BOTH_TYPES

  const [items, setItems] = useState(() => loadContent(platform))
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterType, setFilterType] = useState("All")
  const [modal, setModal] = useState(null) // null | "add" | item object
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)

  function openAdd() { setForm({ ...EMPTY_FORM, platform: platform === "both" ? "youtube" : platform }); setModal("add") }
  function openEdit(item) { setForm({ ...item }); setModal(item) }
  function handleChange(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.title.trim()) return
    const updated = modal === "add"
      ? [{ ...form, id: Date.now() }, ...items]
      : items.map(i => i.id === modal.id ? { ...form, id: modal.id } : i)
    setItems(updated); saveContent(platform, updated); setModal(null)
  }

  function handleDelete(id) {
    const updated = items.filter(i => i.id !== id)
    setItems(updated); saveContent(platform, updated); setDeleteId(null)
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

          <ContentFilters types={types} filterStatus={filterStatus} filterType={filterType} accent={accent} onStatus={setFilterStatus} onType={setFilterType} />

          {filtered.length === 0 ? (
            <div className="card empty-state">
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎬</div>
              <p className="empty-title">{items.length === 0 ? "No content yet" : "No results"}</p>
              <p className="empty-sub">{items.length === 0 ? "Track your videos, reels, and posts here." : "Try changing your filters."}</p>
              {items.length === 0 && <button onClick={openAdd} className="btn-primary" style={{ background: accent, marginTop: "4px" }}>Add your first piece</button>}
            </div>
          ) : (
            <ContentTable items={filtered} accent={accent} onEdit={openEdit} onDelete={setDeleteId} />
          )}
        </main>
      </div>

      {modal && <ContentFormModal modal={modal} form={form} types={types} accent={accent} onChange={handleChange} onSave={handleSave} onClose={() => setModal(null)} />}
      {deleteId && <DeleteModal onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} />}
    </div>
  )
}
