import { Pencil, Trash2 } from "lucide-react"
import { STATUS_COLORS } from "./contentConfig"

// Content items table
export default function ContentTable({ items, accent, onEdit, onDelete }) {
  return (
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
          {items.map(item => (
            <tr key={item.id} className="table-row">
              <td className="table-td" style={{ maxWidth: "220px" }}>
                <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)", fontWeight: "500" }}>{item.title}</p>
                {item.notes && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.notes}</p>}
              </td>
              <td className="table-td"><span className="badge" style={{ color: accent, background: accent + "15" }}>{item.type || "—"}</span></td>
              <td className="table-td"><span className="badge" style={{ color: STATUS_COLORS[item.status] || "var(--dim)", background: (STATUS_COLORS[item.status] || "#888") + "15" }}>{item.status}</span></td>
              <td className="table-td">{item.views || "—"}</td>
              <td className="table-td">{item.likes || "—"}</td>
              <td className="table-td">{item.comments || "—"}</td>
              <td className="table-td">
                <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                  <button onClick={() => onEdit(item)} className="icon-btn" onMouseEnter={e => e.currentTarget.style.color = accent} onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}><Pencil size={13} /></button>
                  <button onClick={() => onDelete(item.id)} className="icon-btn" onMouseEnter={e => e.currentTarget.style.color = "#f87171"} onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}><Trash2 size={13} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
