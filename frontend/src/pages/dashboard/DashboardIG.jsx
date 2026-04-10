import Sidebar from "../../components/Sidebar"
import "./Dashboard.css"

export default function DashboardIG() {
  return (
    <div className="dash-root">
      <Sidebar />
      <div className="dash-content">
        <main className="dash-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "10px", textAlign: "center" }}>
          <p style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", margin: 0 }}>Coming Soon</p>
          <p style={{ fontSize: "14px", color: "var(--dim)", margin: 0 }}>Instagram analytics are on the way.</p>
        </main>
      </div>
    </div>
  )
}
