import { useNavigate } from "react-router-dom"

export default function LandingHeader({ scrollTo }) {
  const navigate = useNavigate()
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <div className="landing-logo">
          <img src="/favicon.svg" alt="CreatorStart" style={{ width: "36px", height: "36px", borderRadius: "9px" }} />
          <span className="landing-logo-text">Creator<span className="landing-logo-accent">Start</span></span>
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
