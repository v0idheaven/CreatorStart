import { useNavigate } from "react-router-dom"

export default function LandingHeader({ scrollTo }) {
  const navigate = useNavigate()
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <div className="landing-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.svg" alt="CreatorStart" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "16px", color: "#f0f0f2", letterSpacing: "-0.3px" }}>
            Creator<span style={{ color: "#818cf8" }}>Start</span>
          </span>
        </div>
        <nav className="landing-nav">
          {["features", "planner", "pricing", "about"].map(s => (
            <button key={s} onClick={() => scrollTo(s)} className="landing-nav-btn">{s}</button>
          ))}
        </nav>
        <div className="landing-header-actions">
          <button onClick={() => navigate("/auth")} className="landing-btn-ghost">Sign in</button>
          <button onClick={() => navigate("/auth", { state: { signup: true } })} className="landing-btn-primary">Get started</button>
        </div>
      </div>
    </header>
  )
}
