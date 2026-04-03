import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
  ["Starter", "Free", "Plan content, use AI generator, track your streak.", "Get started"],
  ["Creator", "Free", "Full 30-day planner, AI briefs, multi-platform dashboard.", "Start creating"],
  ["Pro", "Soon", "Analytics integrations, team workspace, and more.", "See roadmap"],
]

const PLATFORM_DATA = {
  youtube: {
    color: "#ff4444", bg: "#ff444415", label: "YouTube Studio",
    stats: [["2.4K","Subscribers"],["48.2K","Total Views"],["18","Videos"],["1.2K hrs","Watch Time"]],
    statColors: ["#ff4444","#60a5fa","#818cf8","#4ade80"],
    streak: [2,4,6,8,10,12,14,16,18,20,22,24,26],
    streakDays: 5,
    recent: [
      { title: "How to grow on YouTube in 2025", type: "Video", views: "12.4K", status: "done" },
      { title: "Morning routine vlog", type: "Short", views: "31K", status: "done" },
      { title: "My editing workflow", type: "Video", views: "—", status: "draft" },
    ]
  },
  instagram: {
    color: "#c13584", bg: "#c1358415", label: "Instagram Analytics",
    stats: [["5.8K","Followers"],["124K","Total Reach"],["34","Posts"],["1.2K","Avg. Likes"]],
    statColors: ["#c13584","#60a5fa","#818cf8","#f472b6"],
    streak: [1,3,5,7,9,11,15,17,19,21,23,25,27],
    streakDays: 3,
    recent: [
      { title: "Behind the scenes reel", type: "Reel", views: "31K", status: "done" },
      { title: "Top 10 finance tips", type: "Carousel", views: "8.2K", status: "done" },
      { title: "Morning routine aesthetic", type: "Post", views: "—", status: "draft" },
    ]
  },
  both: {
    color: "#818cf8", bg: "#818cf815", label: "Both Platforms",
    stats: [["24","Total Posts"],["8","Planned"],["12","Completed"],["4","Drafts"]],
    statColors: ["#818cf8","#60a5fa","#4ade80","#f472b6"],
    streak: [0,2,4,6,8,10,12,14,16,18,20,22,24,26],
    streakDays: 7,
    recent: [
      { title: "How to grow on YouTube in 2025", type: "YT · Video", views: "12.4K", status: "done" },
      { title: "Behind the scenes reel", type: "IG · Reel", views: "31K", status: "done" },
      { title: "AI tools for creators", type: "Both", views: "—", status: "planned" },
    ]
  }
}

function MockDashboard() {
  const [active, setActive] = useState("youtube")
  const d = PLATFORM_DATA[active]

  return (
    <div style={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", background: "#121212", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px" }}>
        <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ff7a66" }} />
        <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#f4c04d" }} />
        <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#72d56a" }} />
        <div style={{ marginLeft: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", padding: "3px 10px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>creatorstart.app/dashboard</div>
      </div>

      <div style={{ display: "flex", gap: "4px", padding: "12px 16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[["youtube","YT"],["instagram","IG"],["both","Both"]].map(([id, label]) => (
          <button key={id} onClick={() => setActive(id)}
            style={{ padding: "5px 14px", borderRadius: "8px 8px 0 0", border: "none", background: active === id ? "#1a1a1a" : "transparent", color: active === id ? PLATFORM_DATA[id].color : "rgba(255,255,255,0.35)", fontSize: "12px", fontWeight: "600", cursor: "pointer", borderBottom: active === id ? `2px solid ${PLATFORM_DATA[id].color}` : "2px solid transparent", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: d.color }} />
          <span style={{ fontSize: "10px", color: d.color, textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600" }}>{d.label}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
          {d.stats.map(([v, l], i) => (
            <div key={l} style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", background: "#1a1a1a", padding: "10px" }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: "0 0 4px" }}>{l}</p>
              <p style={{ fontSize: "18px", fontWeight: "700", color: d.statColors[i], margin: 0, letterSpacing: "-0.04em" }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", background: "#1a1a1a", overflow: "hidden" }}>
          {d.recent.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderBottom: i < d.recent.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
              <span style={{ fontSize: "9px", color: d.color, background: d.bg, padding: "1px 6px", borderRadius: "4px", flexShrink: 0 }}>{r.type}</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{r.views}</span>
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
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: "1520px", margin: "0 auto", borderLeft: "1px solid rgba(255,255,255,0.08)", borderRight: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0a" }}>

        {/* Header */}
        <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #818cf8, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#fff" }}>CS</div>
              <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.04em" }}>Creator<span style={{ color: "#818cf8" }}>Start</span></span>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
              {["features", "planner", "pricing", "about"].map(s => (
                <button key={s} onClick={() => scrollTo(s)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "14px", textTransform: "capitalize" }}>{s}</button>
              ))}
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => navigate("/auth")} style={{ padding: "8px 18px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Sign in</button>
              <button onClick={() => navigate("/auth", { state: { signup: true } })} style={{ padding: "8px 18px", borderRadius: "20px", background: "#818cf8", border: "none", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Get started</button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "40px 40px 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "20px", border: "1px solid rgba(129,140,248,0.25)", background: "rgba(129,140,248,0.1)", padding: "6px 14px", fontSize: "13px", fontWeight: "500", color: "#818cf8", marginBottom: "32px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8" }} />
                  AI-powered content planning
                </div>
                <h1 style={{ fontSize: "clamp(3rem,8vw,5.5rem)", fontWeight: "800", lineHeight: "0.9", letterSpacing: "-0.07em", margin: "0 0 32px" }}>
                  <span style={{ display: "block" }}>Plan.</span>
                  <span style={{ display: "block" }}>Create.</span>
                  <span style={{ display: "block", color: "#818cf8" }}>Grow.</span>
                  <span style={{ display: "block" }}>Repeat.</span>
                </h1>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "rgba(255,255,255,0.5)", maxWidth: "420px", margin: "0 0 36px" }}>
                  CreatorStart is your AI-powered content workspace for YouTube and Instagram creators. Plan smarter, post consistently, grow faster.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button onClick={() => navigate("/auth", { state: { signup: true } })} style={{ padding: "14px 28px", borderRadius: "20px", background: "#818cf8", border: "none", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Start for free</button>
                  <button onClick={() => scrollTo("features")} style={{ padding: "14px 28px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>See features</button>
                </div>
                <p style={{ marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>Free forever. No credit card required.</p>
              </div>

              {/* Mock dashboard preview */}
              <MockDashboard />
            </div>
          </section>

          {/* Stats */}
          <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "28px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
              {stats.map(([value, label], i) => (
                <div key={label} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", paddingRight: "16px" }}>
                  <div style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-0.06em" }}>{value}</div>
                  <p style={{ marginTop: "6px", fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="features" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "80px 40px" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto 56px", textAlign: "center" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3em", color: "#818cf8", marginBottom: "16px" }}>Why CreatorStart</p>
              <h2 style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: "800", letterSpacing: "-0.06em", lineHeight: "1", margin: "0 0 16px" }}>Everything you need to grow</h2>
              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>Built for creators who are serious about consistency and growth.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {features.map(([tag, title, desc]) => (
                <article key={title} style={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", background: "#121212", padding: "24px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                  <div style={{ display: "inline-flex", borderRadius: "10px", background: "rgba(129,140,248,0.1)", padding: "8px 14px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.25em", color: "#818cf8", marginBottom: "20px" }}>{tag}</div>
                  <h3 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.04em", margin: "0 0 12px", lineHeight: "1.2" }}>{title}</h3>
                  <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.4)", margin: 0 }}>{desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Planner section */}
          <section id="planner" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "80px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3em", color: "#818cf8", marginBottom: "20px" }}>30-Day Planner</p>
                <h2 style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: "800", letterSpacing: "-0.07em", lineHeight: "0.95", margin: "0 0 28px" }}>
                  <span style={{ display: "block" }}>Your content.</span>
                  <span style={{ display: "block" }}>Your schedule.</span>
                  <span style={{ display: "block", color: "#818cf8" }}>Your streak.</span>
                </h2>
                <p style={{ fontSize: "17px", lineHeight: "1.8", color: "rgba(255,255,255,0.45)", marginBottom: "28px" }}>AI generates a full month of content ideas based on your goal, niche, and posting frequency. Edit any day, add multiple posts, track your streak like GitHub contributions.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {["AI generates 30 days of content ideas", "Edit, replace, or add multiple posts per day", "Mark done only for today or past days", "Streak counter tracks your consistency"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(129,140,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", fontSize: "14px", flexShrink: 0 }}>+</div>
                      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", margin: 0 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", background: "#121212", padding: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>April 2026</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "16px" }}>
                  {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} style={{ textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>{d}</div>)}
                  {Array.from({ length: 2 }, (_, i) => <div key={`b${i}`} />)}
                  {Array.from({ length: 30 }, (_, i) => {
                    const done = [0,2,4,6,8].includes(i)
                    const planned = [10,12,14,16,18,20,22,24,26,28].includes(i)
                    return <div key={i} style={{ aspectRatio: "1", borderRadius: "4px", background: done ? "#818cf8" : planned ? "rgba(129,140,248,0.3)" : "rgba(255,255,255,0.05)", position: "relative" }}>
                      {i === 1 && <div style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "3px", height: "3px", borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", display: "inline-block" }} />Empty</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(129,140,248,0.35)", display: "inline-block" }} />Planned</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#818cf8", display: "inline-block" }} />Done</span>
                  <span style={{ marginLeft: "auto", color: "#818cf8", fontWeight: "600" }}>5 posted</span>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "80px 40px" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto 56px", textAlign: "center" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3em", color: "#818cf8", marginBottom: "16px" }}>Simple pricing</p>
              <h2 style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: "800", letterSpacing: "-0.06em", lineHeight: "1", margin: "0 0 16px" }}>Start free. Grow on your terms.</h2>
              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)" }}>No paywalls on the core tools. Build your audience first.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {plans.map(([name, price, desc, cta], i) => (
                <article key={name} style={{ borderRadius: "24px", border: `1px solid ${i === 1 ? "#818cf8" : "rgba(255,255,255,0.08)"}`, background: i === 1 ? "linear-gradient(180deg, rgba(129,140,248,0.12), rgba(255,255,255,0.02))" : "#121212", padding: "24px" }}>
                  <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", margin: "0 0 12px" }}>{name}</p>
                  <strong style={{ display: "block", fontSize: "48px", fontWeight: "800", letterSpacing: "-0.06em", margin: "0 0 20px" }}>{price}</strong>
                  <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>{desc}</p>
                  <button onClick={() => navigate("/auth")} style={{ padding: "10px 20px", borderRadius: "16px", border: i === 1 ? "none" : "1px solid rgba(255,255,255,0.12)", background: i === 1 ? "#fff" : "transparent", color: i === 1 ? "#0a0a0a" : "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>{cta}</button>
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section id="about" style={{ padding: "80px 40px" }}>
            <div style={{ borderRadius: "28px", border: "1px solid rgba(129,140,248,0.2)", background: "radial-gradient(circle at top, rgba(129,140,248,0.15), transparent 40%), linear-gradient(180deg, #0d0d1a, #0a0a0a)", padding: "80px 40px", textAlign: "center" }}>
              <h2 style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: "800", letterSpacing: "-0.07em", lineHeight: "0.95", margin: "0 0 20px" }}>
                <span style={{ display: "block" }}>Ready to start creating?</span>
                <span style={{ display: "block", color: "#818cf8" }}>Join CreatorStart today.</span>
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", margin: "0 0 36px", lineHeight: "1.7" }}>Free to join. AI-powered from day one.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/auth", { state: { signup: true } })} style={{ padding: "14px 28px", borderRadius: "20px", background: "#fff", border: "none", color: "#0a0a0a", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Create free account</button>
                <button onClick={() => scrollTo("features")} style={{ padding: "14px 28px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>See features</button>
              </div>
              <p style={{ marginTop: "24px", fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>No credit card. Built to scale with your channel.</p>
            </div>
          </section>
        </main>

        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "28px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.04em" }}>Creator<span style={{ color: "#818cf8" }}>Start</span></span>
            <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              {["features", "planner", "pricing", "about"].map(s => (
                <button key={s} onClick={() => scrollTo(s)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "13px", textTransform: "capitalize" }}>{s}</button>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>© 2026 CreatorStart. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </div>
  )
}
