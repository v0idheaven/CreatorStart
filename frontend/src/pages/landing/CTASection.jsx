import { useNavigate } from "react-router-dom"

export default function CTASection({ scrollTo }) {
  const navigate = useNavigate()
  return (
    <section id="about" className="landing-cta-section">
      <div className="landing-cta-box">
        <h2 className="landing-cta-title">
          <span style={{ display: "block" }}>Ready to start creating?</span>
          <span style={{ display: "block", color: "#2d8fa3" }}>Join CreatorStart today.</span>
        </h2>
        <p className="landing-cta-sub">Free to join. AI-powered from day one.</p>
        <div className="landing-cta-actions">
          <button onClick={() => navigate("/auth", { state: { signup: true } })} className="landing-btn-lg" style={{ background: "#fff", border: "none", color: "#0a0a0a" }}>Create free account</button>
          <button onClick={() => scrollTo("features")} className="landing-btn-lg landing-btn-lg-outline">See features</button>
        </div>
        <p className="landing-cta-hint">No credit card. Built to scale with your channel.</p>
      </div>
    </section>
  )
}
