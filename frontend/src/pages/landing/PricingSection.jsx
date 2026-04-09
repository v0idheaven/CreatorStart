import { useNavigate } from "react-router-dom"
import { plans } from "./landingData"

export default function PricingSection() {
  const navigate = useNavigate()
  return (
    <section id="pricing" className="landing-section">
      <div className="landing-section-center">
        <p className="landing-section-kicker">Simple pricing</p>
        <h2 className="landing-section-title">Start free. Grow on your terms.</h2>
        <p className="landing-section-sub">No paywalls on the core tools. Build your audience first.</p>
      </div>
      <div className="landing-pricing-grid">
        {plans.map(([name, price, desc, cta, featured]) => (
          <article key={name} className="landing-pricing-card"
            style={{ border: `1px solid ${featured ? "#818cf8" : "rgba(255,255,255,0.08)"}`, background: featured ? "linear-gradient(180deg, rgba(129,140,248,0.12), rgba(255,255,255,0.02))" : "#121212" }}>
            <p className="landing-pricing-name">{name}</p>
            <strong className="landing-pricing-price">{price}</strong>
            <p className="landing-pricing-desc">{desc}</p>
            <button onClick={() => navigate("/auth")} className="landing-pricing-btn"
              style={{ border: featured ? "none" : "1px solid rgba(255,255,255,0.12)", background: featured ? "#fff" : "transparent", color: featured ? "#0a0a0a" : "#fff" }}>
              {cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
