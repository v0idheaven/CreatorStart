export default function LandingFooter({ scrollTo }) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">

        {/* Top row — logo + nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "16px" }}>
          <span className="landing-footer-logo">Creator<span className="landing-logo-accent">Start</span></span>
          <div className="landing-footer-nav">
            {["features", "planner", "pricing", "about"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="landing-nav-btn">{s}</button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", margin: "20px 0" }} />

        {/* Bottom row — copyright + legal links */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "12px" }}>
          <p className="landing-footer-copy" style={{ margin: 0 }}>© 2026 CreatorStart. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="/privacy" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "#818cf8"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
              Privacy Policy
            </a>
            <a href="/terms" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color = "#818cf8"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
