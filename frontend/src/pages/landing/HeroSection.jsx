import { useNavigate } from "react-router-dom"
import MockDashboard from "./MockDashboard"
import { stats } from "./landingData"

export default function HeroSection({ scrollTo }) {
  const navigate = useNavigate()
  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero-grid">
          <div>
            <div className="landing-badge">
              <span className="landing-badge-dot" />
              AI-powered content planning
            </div>
            <h1 className="landing-hero-title">
              <span className="landing-hero-title-line">Plan.</span>
              <span className="landing-hero-title-line">Create.</span>
              <span className="landing-hero-title-accent">Grow.</span>
              <span className="landing-hero-title-line">Repeat.</span>
            </h1>
            <p className="landing-hero-sub">
              CreatorStart is your AI-powered content workspace for YouTube and Instagram creators. Plan smarter, post consistently, grow faster.
            </p>
            <div className="landing-hero-actions">
              <button onClick={() => navigate("/auth", { state: { signup: true } })} className="landing-btn-lg landing-btn-lg-primary">Start for free</button>
              <button onClick={() => scrollTo("features")} className="landing-btn-lg landing-btn-lg-outline">See features</button>
            </div>
            <p className="landing-hero-hint">Free forever. No credit card required.</p>
          </div>
          <MockDashboard />
        </div>
      </section>

      <section className="landing-stats">
        <div className="landing-stats-grid">
          {stats.map(([value, label]) => (
            <div key={label} className="landing-stat-item">
              <div className="landing-stat-value">{value}</div>
              <p className="landing-stat-label">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
