import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Landing.css"

const features = [
  ["01", "AI Content Generator", "Generate hooks, scripts, captions and CTAs tailored to your platform and niche."],
  ["02", "30-Day Planner", "AI builds your full month content calendar. Edit any day, track your streak."],
  ["03", "Platform Dashboard", "YouTube Studio-style analytics for YT creators. Instagram-style for IG creators."],
  ["04", "Posting Streak", "GitHub-style contribution grid tracks your consistency day by day."],
  ["05", "Multi-Platform", "Manage YouTube, Instagram, or both from one unified workspace."],
  ["06", "Secure & Private", "JWT auth, refresh tokens, and protected routes keep your data safe."],
]

const stats = [
  ["30", "Days planned"],
  ["3x", "Faster content"],
  ["100%", "Free to start"],
  ["2", "Platforms"],
]

const plans = [
  ["Starter", "Free", "Plan content, use AI generator, track your streak.", "Get started", false],
  ["Creator", "Free", "Full 30-day planner, AI briefs, multi-platform dashboard.", "Start creating", true],
  ["Pro", "Soon", "Analytics integrations, team workspace, and more.", "See roadmap", false],
]

const PLATFORM_DATA = {
  youtube: {
    color: "#ff4444", bg: "#ff444415", label: "YouTube Studio",
    stats: [["2.4K","Subscribers"],["48.2K","Total Views"],["18","Videos"],["1.2K hrs","Watch Time"]],
    statColors: ["#ff4444","#60a5fa","#818cf8","#4ade80"],
    recent: [
      { title: "How to grow on YouTube in 2025", type: "Video", views: "12.4K" },
      { title: "Morning routine vlog", type: "Short", views: "31K" },
      { title: "My editing workflow", type: "Video", views: "—" },
    ]
  },
  instagram: {
    color: "#c13584", bg: "#c1358415", label: "Instagram Analytics",
    stats: [["5.8K","Followers"],["124K","Total Reach"],["34","Posts"],["1.2K","Avg. Likes"]],
    statColors: ["#c13584","#60a5fa","#818cf8","#f472b6"],
    recent: [
      { title: "Behind the scenes reel", type: "Reel", views: "31K" },
      { title: "Top 10 finance tips", type: "Carousel", views: "8.2K" },
      { title: "Morning routine aesthetic", type: "Post", views: "—" },
    ]
  },
  both: {
    color: "#818cf8", bg: "#818cf815", label: "Both Platforms",
    stats: [["24","Total Posts"],["8","Planned"],["12","Completed"],["4","Drafts"]],
    statColors: ["#818cf8","#60a5fa","#4ade80","#f472b6"],
    recent: [
      { title: "How to grow on YouTube in 2025", type: "YT · Video", views: "12.4K" },
      { title: "Behind the scenes reel", type: "IG · Reel", views: "31K" },
      { title: "AI tools for creators", type: "Both", views: "—" },
    ]
  }
}

function MockDashboard() {
  const [active, setActive] = useState("youtube")
  const d = PLATFORM_DATA[active]

  return (
    <div className="mock-dashboard">
      <div className="mock-titlebar">
        <span className="mock-dot" style={{ background: "#ff7a66" }} />
        <span className="mock-dot" style={{ background: "#f4c04d" }} />
        <span className="mock-dot" style={{ background: "#72d56a" }} />
        <div className="mock-url">creatorstart.app/dashboard</div>
      </div>

      <div className="mock-tabs">
        {[["youtube","YT"],["instagram","IG"],["both","Both"]].map(([id, label]) => (
          <button key={id} onClick={() => setActive(id)} className="mock-tab"
            style={{ background: active === id ? "#1a1a1a" : "transparent", color: active === id ? PLATFORM_DATA[id].color : "rgba(255,255,255,0.35)", borderBottom: active === id ? `2px solid ${PLATFORM_DATA[id].color}` : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      <div className="mock-body">
        <div className="mock-kicker">
          <div className="mock-kicker-dot" style={{ background: d.color }} />
          <span className="mock-kicker-label" style={{ color: d.color }}>{d.label}</span>
        </div>

        <div className="mock-stats-grid">
          {d.stats.map(([v, l], i) => (
            <div key={l} className="mock-stat-card">
              <p className="mock-stat-label">{l}</p>
              <p className="mock-stat-value" style={{ color: d.statColors[i] }}>{v}</p>
            </div>
          ))}
        </div>

        <div className="mock-recent">
          {d.recent.map((r, i) => (
            <div key={i} className="mock-recent-row">
              <p className="mock-recent-title">{r.title}</p>
              <span className="mock-recent-type" style={{ color: d.color, background: d.bg }}>{r.type}</span>
              <span className="mock-recent-views">{r.views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <div className="landing">
      <div className="landing-wrap">

        <header className="landing-header">
          <div className="landing-header-inner">
            <div className="landing-logo">
              <div className="landing-logo-icon">CS</div>
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

        <main>
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

          <section id="planner" className="landing-section">
            <div className="landing-planner-grid">
              <div>
                <p className="landing-section-kicker">30-Day Planner</p>
                <h2 className="landing-planner-title">
                  <span style={{ display: "block" }}>Your content.</span>
                  <span style={{ display: "block" }}>Your schedule.</span>
                  <span style={{ display: "block", color: "#818cf8" }}>Your streak.</span>
                </h2>
                <p className="landing-planner-sub">AI generates a full month of content ideas based on your goal, niche, and posting frequency. Edit any day, add multiple posts, track your streak like GitHub contributions.</p>
                <div className="landing-planner-points">
                  {["AI generates 30 days of content ideas", "Edit, replace, or add multiple posts per day", "Mark done only for today or past days", "Streak counter tracks your consistency"].map(item => (
                    <div key={item} className="landing-planner-point">
                      <div className="landing-planner-point-dot">+</div>
                      <p className="landing-planner-point-text">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="landing-planner-preview">
                <p className="landing-planner-month">April 2026</p>
                <div className="landing-planner-grid-days">
                  {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} className="landing-planner-day-label">{d}</div>)}
                  {Array.from({ length: 2 }, (_, i) => <div key={`b${i}`} />)}
                  {Array.from({ length: 30 }, (_, i) => {
                    const done = [0,2,4,6,8].includes(i)
                    const planned = [10,12,14,16,18,20,22,24,26,28].includes(i)
                    return (
                      <div key={i} style={{ aspectRatio: "1", borderRadius: "4px", background: done ? "#818cf8" : planned ? "rgba(129,140,248,0.3)" : "rgba(255,255,255,0.05)", position: "relative" }}>
                        {i === 1 && <div style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "3px", height: "3px", borderRadius: "50%", background: "#fff" }} />}
                      </div>
                    )
                  })}
                </div>
                <div className="landing-planner-legend">
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span className="landing-planner-legend-dot" style={{ background: "rgba(255,255,255,0.08)" }} />Empty</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span className="landing-planner-legend-dot" style={{ background: "rgba(129,140,248,0.35)" }} />Planned</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span className="landing-planner-legend-dot" style={{ background: "#818cf8" }} />Done</span>
                  <span style={{ marginLeft: "auto", color: "#818cf8", fontWeight: "600" }}>5 posted</span>
                </div>
              </div>
            </div>
          </section>

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
            </div>
          </section>
        </main>

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

      </div>
    </div>
  )
}
