// Content library table (from Content page data)
const STATUS_COLORS = { Idea: "#818cf8", Scripting: "#f59e0b", Filming: "#f97316", Editing: "#06b6d4", Published: "#4ade80" }

export default function ContentTable({ contentItems, contentTotal, accent }) {
  if (!contentTotal) return null
  return (
    <div className="chart-card content-table-card">
      <div className="content-table-header">
        <p className="content-table-title">Your content</p>
        <span className="content-table-count">{contentTotal} pieces</span>
      </div>
      <table className="table-full">
        <thead>
          <tr className="table-row">
            {["", "Title", "Type", "Status", "Views", "Likes", "Comments"].map((h, i) => (
              <th key={i} className="table-th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contentItems.map(item => (
            <tr key={item.id} className="table-row"
              onMouseEnter={e => e.currentTarget.style.background = "var(--sb)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td className="table-td content-thumb-cell">
                {item.thumbnail
                  ? <img src={item.thumbnail} alt="" className="content-thumb" />
                  : <div className="content-thumb-placeholder"><span className="content-thumb-none">No img</span></div>
                }
              </td>
              <td className="table-td content-title-cell"><p className="content-title-text">{item.title}</p></td>
              <td className="table-td"><span className="badge" style={{ color: accent, background: accent + "15" }}>{item.type || "—"}</span></td>
              <td className="table-td"><span className="content-status" style={{ color: STATUS_COLORS[item.status] || "var(--dim)" }}>{item.status}</span></td>
              <td className="table-td">{item.views ? Number(item.views).toLocaleString() : "—"}</td>
              <td className="table-td">{item.likes ? Number(item.likes).toLocaleString() : "—"}</td>
              <td className="table-td">{item.comments ? Number(item.comments).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
