import { useNavigate } from "react-router-dom"

export default function CTASection({ scrollTo }) {
  const navigate = useNavigate()
  return (
    <section id="about" className="landing-cta-section">
      <div className="landing-cta-box">
        <h2 className="landing-cta-title">
          <span style={{ display: "block" }}>Ready to start creating?</span>
          <span style={{ display: "block", color: "#818cf8" }}>Join CreatorStart today.</span>
        </h2>
        <p className="landing-cta-sub">Free to join. AI-powered from day one.</p>
        <div className="landing-cta-actions">
          <button onClick={() => navigate("/auth", { state: { signup: true } })} className="landing-btn-lg" style={{ background: "#fff", border: "none", color: "#0a0a0a" }}>Create free account</button>
          <button onClick={() => scrollTo("features")} className="landing-btn-lg landing-btn-lg-outline">See features</button>
        </div>
        <p className="landing-cta-hint">No credit card. Built to scale with your channel.</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: "16px 0 0" }}>
          By signing up you agree to our{" "}
          <a href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</a>
          {" "}and{" "}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</a>
        </p>
      </div>
    </section>
  )
}
