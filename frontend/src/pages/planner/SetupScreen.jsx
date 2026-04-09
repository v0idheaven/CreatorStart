import { useState } from "react"
import { Sparkles, Check, Users, Flame, Zap, Target, DollarSign, Heart, Youtube, Instagram, Scale, Calendar } from "lucide-react"
import { COLORS, GOALS, TOPICS, FREQUENCIES, STEP_TITLES, FOCUS_OPTIONS } from "../../constants/plannerConstants"
import { STORAGE_KEYS } from "../../constants/storageKeys"

const GOAL_ICONS = { followers: Users, engagement: Flame, viral: Zap, authority: Target, sales: DollarSign, community: Heart }
const FREQUENCY_ICONS = { daily: Flame, alt: Zap, weekdays: Calendar }
const FOCUS_ICONS = { youtube: Youtube, instagram: Instagram, both: Scale }

export default function SetupScreen({ onGenerate }) {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both
  const [goal, setGoal] = useState("")
  const [topic, setTopic] = useState("")
  const [freq, setFreq] = useState("daily")
  const [focus, setFocus] = useState("both")
  const [step, setStep] = useState(1)

  const totalSteps = platform === "both" ? 4 : 3
  function canNext() {
    if (step === 1) return !!goal
    if (step === 2) return !!topic
    return true
  }

  return (
    <div className="planner-setup">
      <div className="planner-steps">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
          <div key={s} className="planner-step-item">
            <div className="planner-step-circle" style={{ background: step >= s ? accent : "var(--border2)", color: step >= s ? "#fff" : "var(--dim)" }}>
              {step > s ? <Check size={12} strokeWidth={3} /> : s}
            </div>
            {s < totalSteps && <div className="planner-step-line" style={{ background: step > s ? accent : "var(--border2)" }} />}
          </div>
        ))}
        <span className="planner-step-count">Step {step} of {totalSteps}</span>
      </div>

      <h2 className="planner-setup-title">{STEP_TITLES[step - 1].title}</h2>
      <p className="planner-setup-subtitle">{STEP_TITLES[step - 1].sub}</p>

      {step === 1 && (
        <div className="planner-grid-two">
          {GOALS.map(g => {
            const GoalIcon = GOAL_ICONS[g.id]
            return (
              <div key={g.id} onClick={() => setGoal(g.id)} className="planner-choice-card"
                style={{ padding: "12px 14px", border: `1.5px solid ${goal === g.id ? accent : "var(--border2)"}`, background: goal === g.id ? accent + "12" : "var(--card)" }}>
                <div className="planner-choice-icon" style={{ width: "28px", height: "28px", borderRadius: "7px", background: goal === g.id ? accent + "25" : "var(--border)", marginBottom: "8px" }}>
                  <GoalIcon size={14} color={goal === g.id ? accent : "var(--muted)"} strokeWidth={2} />
                </div>
                <p className="planner-choice-title" style={{ fontSize: "13px", fontWeight: "600", color: goal === g.id ? accent : "var(--text)" }}>{g.label}</p>
                <p className="planner-choice-desc" style={{ fontSize: "11px", lineHeight: "1.3" }}>{g.desc}</p>
              </div>
            )
          })}
        </div>
      )}

      {step === 2 && (
        <div className="planner-grid-two">
          {TOPICS.map(t => (
            <div key={t.id} onClick={() => setTopic(t.id)} className="planner-choice-card"
              style={{ padding: "11px 14px", border: `1.5px solid ${topic === t.id ? accent : "var(--border2)"}`, background: topic === t.id ? accent + "12" : "var(--card)" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: topic === t.id ? accent : "var(--text)", margin: 0 }}>{t.label}</p>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="planner-list">
          {FREQUENCIES.map(f => {
            const FrequencyIcon = FREQUENCY_ICONS[f.id]
            return (
              <div key={f.id} onClick={() => setFreq(f.id)} className="planner-choice-card"
                style={{ padding: "12px 16px", border: `1.5px solid ${freq === f.id ? accent : "var(--border2)"}`, background: freq === f.id ? accent + "12" : "var(--card)", display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="planner-choice-icon" style={{ width: "32px", height: "32px", borderRadius: "8px", background: freq === f.id ? accent + "25" : "var(--border)" }}>
                  <FrequencyIcon size={15} color={freq === f.id ? accent : "var(--muted)"} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: freq === f.id ? accent : "var(--text)", margin: "0 0 2px" }}>{f.label}</p>
                  <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>{f.desc}</p>
                </div>
                {freq === f.id && <Check size={16} color={accent} style={{ marginLeft: "auto" }} />}
              </div>
            )
          })}
        </div>
      )}

      {step === 4 && platform === "both" && (
        <div className="planner-list">
          {FOCUS_OPTIONS.map(f => {
            const FocusIcon = FOCUS_ICONS[f.id]
            return (
              <div key={f.id} onClick={() => setFocus(f.id)} className="planner-choice-card"
                style={{ padding: "12px 16px", border: `1.5px solid ${focus === f.id ? f.color : "var(--border2)"}`, background: focus === f.id ? f.color + "12" : "var(--card)", display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="planner-choice-icon" style={{ width: "32px", height: "32px", borderRadius: "8px", background: focus === f.id ? f.color + "25" : "var(--border)" }}>
                  <FocusIcon size={15} color={focus === f.id ? f.color : "var(--muted)"} strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: focus === f.id ? f.color : "var(--text)", margin: "0 0 2px" }}>{f.label}</p>
                  <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0 }}>{f.desc}</p>
                </div>
                {focus === f.id && <Check size={16} color={f.color} style={{ marginLeft: "auto" }} />}
              </div>
            )
          })}
        </div>
      )}

      <div className="planner-actions-row">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="planner-setup-btn planner-btn-secondary">Back</button>
        )}
        {step < totalSteps ? (
          <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="planner-setup-btn"
            style={{ border: "none", background: canNext() ? accent : "var(--border)", color: canNext() ? "#fff" : "var(--dim)", fontWeight: "600", cursor: canNext() ? "pointer" : "not-allowed" }}>
            Next →
          </button>
        ) : (
          <button onClick={() => onGenerate(goal, topic, freq, focus)} className="planner-setup-btn planner-btn-fill" style={{ background: accent }}>
            <Sparkles size={14} /> Generate My Plan
          </button>
        )}
      </div>
    </div>
  )
}
