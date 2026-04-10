// 30-Day Planner feature showcase with mini calendar preview
export default function PlannerSection() {
  return (
    <section id="planner" className="landing-section">
      <div className="landing-planner-grid">
        <div>
          <p className="landing-section-kicker">30-Day Planner</p>
          <h2 className="landing-planner-title">
            <span style={{ display: "block" }}>Your content.</span>
            <span style={{ display: "block" }}>Your schedule.</span>
            <span style={{ display: "block", color: "#2d8fa3" }}>Your streak.</span>
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
                <div key={i} style={{ aspectRatio: "1", borderRadius: "4px", background: done ? "#2d8fa3" : planned ? "rgba(45,143,163,0.3)" : "rgba(255,255,255,0.05)" }} />
              )
            })}
          </div>
          <div className="landing-planner-legend">
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span className="landing-planner-legend-dot" style={{ background: "rgba(255,255,255,0.08)" }} />Empty</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span className="landing-planner-legend-dot" style={{ background: "rgba(45,143,163,0.35)" }} />Planned</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span className="landing-planner-legend-dot" style={{ background: "#2d8fa3" }} />Done</span>
            <span style={{ marginLeft: "auto", color: "#2d8fa3", fontWeight: "600" }}>5 posted</span>
          </div>
        </div>
      </div>
    </section>
  )
}
