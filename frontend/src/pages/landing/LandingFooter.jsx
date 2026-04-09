export default function LandingFooter({ scrollTo }) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <span className="landing-footer-logo">Creator<span className="landing-logo-accent">Start</span></span>
        <div className="landing-footer-nav">
          {["features", "planner", "pricing", "about"].map(s => (
            <button key={s} onClick={() => scrollTo(s)} className="landing-nav-btn">{s}</button>
          ))}
        </div>
        <p className="landing-footer-copy">© 2026 CreatorStart. All rights reserved.</p>
      </div>
    </footer>
  )
}
