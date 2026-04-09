import { features } from "./landingData"

export default function FeaturesSection() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-section-center">
        <p className="landing-section-kicker">Why CreatorStart</p>
        <h2 className="landing-section-title">Everything you need to grow</h2>
        <p className="landing-section-sub">Built for creators who are serious about consistency and growth.</p>
      </div>
      <div className="landing-features-grid">
        {features.map(([tag, title, desc]) => (
          <article key={title} className="landing-feature-card">
            <div className="landing-feature-tag">{tag}</div>
            <h3 className="landing-feature-title">{title}</h3>
            <p className="landing-feature-desc">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
