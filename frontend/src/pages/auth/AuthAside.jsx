import { useNavigate } from "react-router-dom"

// Left panel with branding, feature points, platform chips
export default function AuthAside({ isLogin }) {
  const navigate = useNavigate()

  const points = isLogin
    ? ["Your session stays alive with refresh-token auth.", "Switch between YouTube, Instagram, or both platforms.", "Your 30-day planner and streak are saved across sessions."]
    : ["AI builds your 30-day content plan in seconds.", "Platform-specific dashboards for YT and Instagram.", "Track your posting streak like GitHub contributions."]

  return (
    <div className="auth-aside">
      <div>
        <div className="auth-aside-top">
          <button onClick={() => navigate("/")} className="auth-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
          <img src="/logo.svg" alt="CreatorStart" style={{ width: "170px", height: "36px", objectFit: "contain" }} />
        </div>

        <div className="auth-badge">{isLogin ? "Welcome back" : "Get started"}</div>
        <h2 className="auth-aside-heading">
          {isLogin ? "Sign in and pick up where your last post left off." : "Build your content empire, one day at a time."}
        </h2>
        <p className="auth-aside-sub">
          {isLogin ? "Your planner, streak, and AI tools are waiting." : "AI-powered planning for YouTube and Instagram creators."}
        </p>

        <div className="auth-points">
          {points.map((point, i) => (
            <div key={i} className="auth-point-row">
              <div className="auth-point-dot"><span>+</span></div>
              <p className="auth-point-text">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-platform-row">
        {[{ color: "#ff4444", label: "YT" }, { color: "#c13584", label: "IG" }, { color: "#2d8fa3", label: "Both" }].map(({ color, label }) => (
          <div key={label} className="auth-platform-chip">
            <div className="auth-platform-dot" style={{ background: color }} />
            <p className="auth-platform-label">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
