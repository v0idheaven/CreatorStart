import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", textAlign: "center", padding: "24px" }}>
      <p style={{ fontSize: "80px", fontWeight: "900", color: "rgba(255,255,255,0.06)", margin: 0, lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: "-16px 0 0" }}>Page not found</h1>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>The page you're looking for doesn't exist.</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer" }}>
          <ArrowLeft size={14} /> Go back
        </button>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "9px", border: "none", background: "#818cf8", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          <Home size={14} /> Home
        </button>
      </div>
    </div>
  )
}
