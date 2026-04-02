import { useState } from "react"
import { Sparkles, Check, Pencil, X, RefreshCw, Download, StickyNote, Users, Flame, Zap, Target, DollarSign, Heart, Youtube, Instagram, Scale, Calendar, Clock, FileText, CalendarDays, Plus } from "lucide-react"
import Sidebar from "../components/Sidebar"
import "./Planner.css"
import {
  COLORS,
  PC,
  GOALS,
  TOPICS,
  FREQUENCIES,
  STEP_TITLES,
  FOCUS_OPTIONS,
} from "../constants/plannerConstants"
import { STORAGE_KEYS } from "../constants/storageKeys"
import { API_ENDPOINTS } from "../constants/api"

const GOAL_ICONS = {
  followers: Users,
  engagement: Flame,
  viral: Zap,
  authority: Target,
  sales: DollarSign,
  community: Heart,
}

const FREQUENCY_ICONS = {
  daily: Flame,
  alt: Zap,
  weekdays: Calendar,
}

const FOCUS_ICONS = {
  youtube: Youtube,
  instagram: Instagram,
  both: Scale,
}

function buildFallbackContent(goalLabel, topicLabel, platformLabel, dayNum) {
  const angles = [
    "quick tip",
    "common mistake",
    "step-by-step guide",
    "myth vs reality",
    "behind-the-scenes",
    "beginner checklist",
  ]

  const formats = ["Short video", "Carousel", "Story", "Post", "Live topic"]
  const angle = angles[(dayNum - 1) % angles.length]
  const format = formats[(dayNum - 1) % formats.length]

  return `${format}: ${goalLabel} for ${topicLabel} on ${platformLabel} - ${angle}.`
}

function generatePlan(goal, topic, freq, focus, platform) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = lastDay.getDate() - today.getDate() + 1

  const allDays = Array.from({ length: daysLeft }, (_, i) => i + 1)
  let activeDays
  if (freq === "daily") activeDays = allDays
  else if (freq === "alt") activeDays = allDays.filter((_, i) => i % 2 === 0)
  else if (freq === "weekdays") {
    activeDays = []
    for (let i = 0; i < daysLeft; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dow = d.getDay()
      if (dow !== 0 && dow !== 6) activeDays.push(i + 1)
    }
  } else activeDays = allDays

  const goalLabel = GOALS.find(g => g.id === goal)?.label || goal
  const topicLabel = TOPICS.find(t => t.id === topic)?.label || topic

  const focusPlatform = focus || platform

  return Array.from({ length: daysLeft }, (_, i) => {
    const dayNum = i + 1
    const isActive = activeDays.includes(dayNum)

    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const isToday = i === 0

    let p
    if (platform !== "both") {
      p = platform
    } else if (focusPlatform === "youtube") {
      p = i % 10 < 7 ? "youtube" : "instagram"
    } else if (focusPlatform === "instagram") {
      p = i % 10 < 7 ? "instagram" : "youtube"
    } else {
      p = i % 3 === 0 ? "youtube" : i % 3 === 1 ? "instagram" : "both"
    }

    return {
      id: dayNum,
      day: dayNum,
      date,
      dateLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday,
      content: isActive ? buildFallbackContent(goalLabel, topicLabel, p === "both" ? "YouTube + Instagram" : p === "youtube" ? "YouTube" : "Instagram", dayNum) : "",
      platform: p,
      isCompleted: false,
      note: "",
      active: isActive,
    }
  })
}

function SetupScreen({ onGenerate }) {
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
          {GOALS.map(g => (
            (() => {
              const GoalIcon = GOAL_ICONS[g.id]
              return (
            <div key={g.id} onClick={() => setGoal(g.id)}
              className="planner-choice-card"
              style={{ padding: "12px 14px", border: `1.5px solid ${goal === g.id ? accent : "var(--border2)"}`, background: goal === g.id ? accent + "12" : "var(--card)" }}>
              <div className="planner-choice-icon" style={{ width: "28px", height: "28px", borderRadius: "7px", background: goal === g.id ? accent + "25" : "var(--border)", marginBottom: "8px" }}>
                <GoalIcon size={14} color={goal === g.id ? accent : "var(--muted)"} strokeWidth={2} />
              </div>
              <p className="planner-choice-title" style={{ fontSize: "13px", fontWeight: "600", color: goal === g.id ? accent : "var(--text)" }}>{g.label}</p>
              <p className="planner-choice-desc" style={{ fontSize: "11px", lineHeight: "1.3" }}>{g.desc}</p>
            </div>
              )
            })()
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="planner-grid-two">
          {TOPICS.map(t => (
            <div key={t.id} onClick={() => setTopic(t.id)}
              className="planner-choice-card"
              style={{ padding: "11px 14px", border: `1.5px solid ${topic === t.id ? accent : "var(--border2)"}`, background: topic === t.id ? accent + "12" : "var(--card)" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: topic === t.id ? accent : "var(--text)", margin: 0 }}>{t.label}</p>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="planner-list">
          {FREQUENCIES.map(f => (
            (() => {
              const FrequencyIcon = FREQUENCY_ICONS[f.id]
              return (
            <div key={f.id} onClick={() => setFreq(f.id)}
              className="planner-choice-card"
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
            })()
          ))}
        </div>
      )}

      {step === 4 && platform === "both" && (
        <div className="planner-list">
          {FOCUS_OPTIONS.map(f => (
            (() => {
              const FocusIcon = FOCUS_ICONS[f.id]
              return (
            <div key={f.id} onClick={() => setFocus(f.id)}
              className="planner-choice-card"
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
            })()
          ))}
        </div>
      )}

      <div className="planner-actions-row">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}
            className="planner-setup-btn planner-btn-secondary">
            Back
          </button>
        )}
        {step < totalSteps ? (
          <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}
            className="planner-setup-btn"
            style={{ border: "none", background: canNext() ? accent : "var(--border)", color: canNext() ? "#fff" : "var(--dim)", fontWeight: "600", cursor: canNext() ? "pointer" : "not-allowed" }}>
            Next →
          </button>
        ) : (
          <button onClick={() => onGenerate(goal, topic, freq, focus)}
            className="planner-setup-btn planner-btn-fill"
            style={{ background: accent }}>
            <Sparkles size={14} /> Generate My Plan
          </button>
        )}
      </div>
    </div>
  )
}

export default function Planner() {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"
  const accent = COLORS[platform] || COLORS.both
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANNER_DATA) || "null")

  const [screen, setScreen] = useState(saved ? "plan" : "setup")
  const [generating, setGenerating] = useState(false)
  const [entries, setEntries] = useState(saved?.entries || [])
  const [planInfo, setPlanInfo] = useState(saved?.planInfo || null)
  const [activeDay, setActiveDay] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [editContent, setEditContent] = useState("")
  const [editNote, setEditNote] = useState("")
  const [editPlatform, setEditPlatform] = useState("")
  const [filter, setFilter] = useState("all")
  const [showNote, setShowNote] = useState(false)
  const [confirmNew, setConfirmNew] = useState(false)
  const [addDayModal, setAddDayModal] = useState(null)
  const [addDayContent, setAddDayContent] = useState("")

  const [aiDetail, setAiDetail] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  async function generateDayDetail(entry) {
    if (!entry.content) return
    setAiDetail(null)
    setAiError("")
    setAiLoading(true)
    const plat = entry.platform === "youtube" ? "YouTube" : entry.platform === "instagram" ? "Instagram" : "YouTube/Instagram"
    try {
      const res = await fetch(API_ENDPOINTS.plannerAiDetail, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: entry.content,
          platformLabel: plat,
        })
      })
      const data = await res.json()
      if (!res.ok) { setAiError(data.message || "API error"); setAiLoading(false); return }
      if (!data?.data) { setAiError("Empty response."); setAiLoading(false); return }
      setAiDetail(data.data)
    } catch (e) {
      setAiError("Network error: " + e.message)
    }
    setAiLoading(false)
  }
  const active = entries.filter(e => e.active)
  const completed = entries.filter(e => e.isCompleted).length
  const activeEntry = entries.find(e => e.day === activeDay)

  function handleDayClick(day) {
    if (activeDay === day) {
      setActiveDay(null)
      setAiDetail(null)
    } else {
      setActiveDay(day)
      const entry = entries.find(e => e.day === day)
      if (entry?.content) generateDayDetail(entry)
    }
  }

  function savePlan(newEntries, newPlanInfo) {
    localStorage.setItem(STORAGE_KEYS.PLANNER_DATA, JSON.stringify({ entries: newEntries, planInfo: newPlanInfo }))
  }

  async function callGroqForPlan(goal, topic, freq, focus) {
    const goalLabel = GOALS.find(g => g.id === goal)?.label || goal
    const topicLabel = TOPICS.find(t => t.id === topic)?.label || topic
    const freqLabel = FREQUENCIES.find(f => f.id === freq)?.label || freq
    const plat = platform === "both" ? (focus === "youtube" ? "YouTube (70%) + Instagram (30%)" : focus === "instagram" ? "Instagram (70%) + YouTube (30%)" : "YouTube + Instagram equally") : platform === "youtube" ? "YouTube" : "Instagram"

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const daysLeft = lastDay.getDate() - today.getDate() + 1

    const res = await fetch(API_ENDPOINTS.plannerAiPlan, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goalLabel,
        topicLabel,
        freqLabel,
        platformLabel: plat,
        daysLeft,
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "AI API error")
    if (!Array.isArray(data?.data)) throw new Error("Could not parse plan from AI")
    return data.data
  }

  async function handleGenerate(goal, topic, freq, focus) {
    setGenerating(true)
    const newInfo = { goal, topic, freq, focus }
    setPlanInfo(newInfo)
    try {
      const aiPlan = await callGroqForPlan(goal, topic, freq, focus)
      const base = generatePlan(goal, topic, freq, focus, platform)
      const newEntries = base.map((entry) => {
        const aiDay = aiPlan.find(d => d.day === entry.day)
        return { ...entry, content: aiDay?.content || entry.content }
      })
      setEntries(newEntries)
      savePlan(newEntries, newInfo)
      setScreen("plan")
    } catch {
      const newEntries = generatePlan(goal, topic, freq, focus, platform)
      setEntries(newEntries)
      savePlan(newEntries, newInfo)
      setScreen("plan")
    }
    setGenerating(false)
  }

  async function handleRegenerate() {
    if (!planInfo) return
    setGenerating(true)
    try {
      const aiPlan = await callGroqForPlan(planInfo.goal, planInfo.topic, planInfo.freq, planInfo.focus)
      const base = generatePlan(planInfo.goal, planInfo.topic, planInfo.freq, planInfo.focus, platform)
      const newEntries = base.map(entry => {
        const aiDay = aiPlan.find(d => d.day === entry.day)
        return { ...entry, content: aiDay?.content || entry.content }
      })
      setEntries(newEntries)
      savePlan(newEntries, planInfo)
    } catch {
      const newEntries = generatePlan(planInfo.goal, planInfo.topic, planInfo.freq, planInfo.focus, platform)
      setEntries(newEntries)
      savePlan(newEntries, planInfo)
    }
    setGenerating(false)
  }

  function openEdit(entry) {
    setEditingEntry(entry)
    setEditContent(entry.content)
    setEditNote(entry.note || "")
    setEditPlatform(entry.platform)
    setShowNote(!!entry.note)
  }

  function saveEdit() {
    const updated = entries.map(e => e.id === editingEntry.id ? { ...e, content: editContent, note: editNote, platform: editPlatform } : e)
    setEntries(updated)
    savePlan(updated, planInfo)
    setEditingEntry(null)
  }

  function toggleDone(id) {
    const updated = entries.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e)
    setEntries(updated)
    savePlan(updated, planInfo)
  }

  function exportPlan() {
    const lines = entries.filter(e => e.active && e.content).map(e => `Day ${e.day}: ${e.content}${e.note ? ` [Note: ${e.note}]` : ""}`)
    const text = `30-Day Content Plan\nGoal: ${GOALS.find(g => g.id === planInfo?.goal)?.label} | Topic: ${TOPICS.find(t => t.id === planInfo?.topic)?.label}\n\n${lines.join("\n")}`
    const blob = new Blob([text], { type: "text/plain" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "30-day-plan.txt"
    a.click()
  }

  if (generating) {
    return (
      <div className="planner-generating-root">
        <Sidebar />
        <main className="planner-generating-main">
          <div className="planner-generating-icon" style={{ background: accent + "18" }}>
            <Sparkles size={24} color={accent} />
          </div>
          <div className="planner-generating-copy">
            <p className="planner-generating-title">Building your plan...</p>
            <p className="planner-generating-subtitle">AI is creating 30 days of content ideas for you</p>
          </div>
          <div className="planner-progress-track">
            <div className="planner-progress-fill" style={{ background: accent }} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="planner-root">
      <Sidebar />
      <main className="planner-main">

        <div className="planner-header">
          <div>
            <p className="planner-header-kicker">Content</p>
            <h1 className="planner-header-title">30-Day Planner</h1>
            {planInfo && (
              <p className="planner-header-subtitle">
                {GOALS.find(g => g.id === planInfo.goal)?.label} · {TOPICS.find(t => t.id === planInfo.topic)?.label} · {FREQUENCIES.find(f => f.id === planInfo.freq)?.label}
              </p>
            )}
          </div>

          {screen === "plan" && (
            <div className="planner-top-actions">
              <button onClick={exportPlan}
                className="planner-btn-inline planner-btn-ghost">
                <Download size={13} /> Export
              </button>
              <button onClick={handleRegenerate}
                className="planner-btn-inline"
                style={{ border: `1px solid ${accent}40`, background: accent + "12", color: accent, fontWeight: "600" }}>
                <RefreshCw size={13} /> Regenerate
              </button>
              <button onClick={() => setConfirmNew(true)}
                className="planner-btn-inline planner-btn-ghost">
                New Plan
              </button>
            </div>
          )}
        </div>

        {screen === "setup" && <SetupScreen onGenerate={handleGenerate} />}

        {screen === "plan" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "all", label: "All" },
                  { id: "pending", label: "Pending" },
                  { id: "done", label: "Done" },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    style={{ padding: "5px 14px", borderRadius: "20px", border: `1px solid ${filter === f.id ? accent : "var(--border)"}`, background: filter === f.id ? accent : "transparent", color: filter === f.id ? "#fff" : "var(--muted)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "var(--dim)" }}>{completed} of {active.length} done</span>
                <div style={{ width: "80px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${active.length ? (completed / active.length) * 100 : 0}%`, background: "#4ade80", borderRadius: "2px", transition: "width 0.4s" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#4ade80" }}>{active.length ? Math.round((completed / active.length) * 100) : 0}%</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "6px" }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: "600", color: "var(--dim)", padding: "4px 0", letterSpacing: "0.5px" }}>{d}</div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", marginBottom: "20px" }}>
              {(() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const startDow = today.getDay()
                const mondayOffset = startDow === 0 ? 6 : startDow - 1
                const blanks = Array.from({ length: mondayOffset }, (_, i) => (
                  <div key={`b${i}`} style={{ minHeight: "76px" }} />
                ))

                const allEntries = filter === "all"
                  ? entries
                  : filter === "done"
                  ? entries.map(e => e.active && !e.isCompleted ? { ...e, content: "" } : e)
                  : entries.map(e => e.active && e.isCompleted ? { ...e, content: "" } : e)

                const cards = allEntries.map(entry => {
                  const pc = PC[entry.platform]
                  const isSelected = activeDay === entry.day
                  const dateNum = entry.date ? new Date(entry.date).getDate() : entry.day
                  const isEmpty = !entry.active || !entry.content

                  return (
                    <div key={entry.id}
                      onClick={() => {
                        if (!isEmpty) handleDayClick(entry.day)
                      }}
                      style={{
                        borderRadius: "8px",
                        border: `1.5px solid ${isSelected ? accent : entry.isCompleted ? "#4ade8040" : entry.isToday ? accent + "70" : isEmpty ? "var(--border)" : "var(--border)"}`,
                        background: isSelected ? accent + "12" : entry.isCompleted ? "#4ade8008" : entry.isToday && !isEmpty ? accent + "08" : "var(--card)",
                        padding: "8px 7px",
                        cursor: isEmpty ? "default" : "pointer",
                        transition: "border-color 0.12s, background 0.12s",
                        minHeight: "76px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        position: "relative",
                        opacity: isEmpty ? 0.4 : 1,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700", lineHeight: 1, color: entry.isToday ? accent : entry.isCompleted ? "#4ade80" : "var(--text)" }}>
                            {dateNum}
                          </span>
                          {entry.isToday && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: accent, marginTop: "2px" }} />}
                        </div>
                        {!isEmpty && <span style={{ fontSize: "8px", fontWeight: "700", color: pc.color, background: pc.bg, padding: "1px 4px", borderRadius: "3px" }}>{pc.label}</span>}
                      </div>
                      {!isEmpty && entry.content && (
                        <p style={{ fontSize: "10px", color: entry.isCompleted ? "var(--dim)" : "var(--muted)", margin: 0, lineHeight: "1.3", textDecoration: entry.isCompleted ? "line-through" : "none", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", flex: 1 }}>
                          {entry.content}
                        </p>
                      )}
                      {entry.isCompleted && (
                        <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "12px", height: "12px", borderRadius: "50%", background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={7} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                      {entry.note && !entry.isCompleted && (
                        <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "5px", height: "5px", borderRadius: "50%", background: "#f59e0b" }} />
                      )}
                      {isEmpty && planInfo?.freq !== "daily" && (
                        <button
                          onClick={e => { e.stopPropagation(); setAddDayModal(entry); setAddDayContent("") }}
                          style={{ position: "absolute", bottom: "6px", right: "6px", width: "22px", height: "22px", borderRadius: "50%", border: `1.5px solid ${accent}`, background: accent + "30", color: accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  )
                })
                return [...blanks, ...cards]
              })()}
            </div>

          </>
        )}

      </main>

      {activeEntry && (
        <div className="planner-detail-wrap" style={{ borderTop: `2px solid ${accent}` }}>
          <div className="planner-detail-head">
            <div className="planner-detail-head-left">
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)" }}>{activeEntry.dayName}, {activeEntry.dateLabel}</span>
              {activeEntry.isToday && <span style={{ fontSize: "10px", background: accent, color: "#fff", padding: "1px 8px", borderRadius: "10px", fontWeight: "700" }}>Today</span>}
              <span style={{ fontSize: "11px", color: PC[activeEntry.platform].color, background: PC[activeEntry.platform].bg, padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>{PC[activeEntry.platform].label}</span>
              {activeEntry.isCompleted && <span style={{ fontSize: "11px", color: "#4ade80", background: "#4ade8015", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>✓ Done</span>}
            </div>
            <div className="planner-detail-head-right">
              <button onClick={() => toggleDone(activeEntry.id)}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", border: `1px solid ${activeEntry.isCompleted ? "#4ade8040" : "#4ade8030"}`, background: "transparent", color: "#4ade80", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                <Check size={11} />{activeEntry.isCompleted ? "Undo" : "Mark done"}
              </button>
              <button onClick={() => openEdit(activeEntry)}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", border: `1px solid ${accent}30`, background: "transparent", color: accent, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                <Pencil size={11} />Edit
              </button>
              <button onClick={() => { setActiveDay(null); setAiDetail(null) }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex", padding: "6px" }}>
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="planner-detail-body">
            <p className="planner-detail-content">{activeEntry.content}</p>
            {aiLoading && (
              <div className="planner-loading-row">
                <div className="spinner spinner-sm" style={{ borderTopColor: accent }} />
                Generating content brief...
              </div>
            )}
            {aiError && <p style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{aiError}</p>}
            {aiDetail && (
              <div className="planner-ai-grid">
                {[
                  { key: "hook", label: "Hook" },
                  { key: "cta", label: "Call to Action" },
                  { key: "whatToSay", label: "What to Say" },
                  { key: "tip", label: "Pro Tip" },
                  { key: "script", label: "Script Outline" },
                ].map(({ key, label }) => aiDetail[key] && (
                  <div key={key} className="planner-ai-card">
                    <p className="planner-ai-card-label" style={{ color: accent }}>{label}</p>
                    <p className="planner-ai-card-text">{aiDetail[key]}</p>
                  </div>
                ))}
              </div>
            )}
            {!aiLoading && !aiDetail && !aiError && (
              <button onClick={() => generateDayDetail(activeEntry)}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: `1px solid ${accent}40`, background: accent + "12", color: accent, fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                <Sparkles size={13} /> Generate content brief
              </button>
            )}
          </div>
        </div>
      )}

      {editingEntry && (
        <>
          <div onClick={() => setEditingEntry(null)} className="planner-overlay planner-overlay-soft" />
          <div className="planner-modal planner-modal-md">
            <div className="planner-modal-head">
              <h2 className="planner-modal-title">Edit Day {editingEntry.day}</h2>
              <button onClick={() => setEditingEntry(null)} className="planner-modal-close"><X size={16} /></button>
            </div>
            <div className="planner-modal-body">
              <div>
                <label className="planner-field-label">Content idea</label>
                <textarea className="input-sm planner-textarea" rows={3} value={editContent} onChange={e => setEditContent(e.target.value)} />
              </div>
              <div>
                <button onClick={() => setShowNote(!showNote)}
                  className="planner-note-toggle"
                  style={{ color: showNote ? "#f59e0b" : "var(--dim)" }}>
                  <StickyNote size={13} />{showNote ? "Remove note" : "Add a note"}
                </button>
                {showNote && (
                  <textarea className="input-sm planner-textarea-note" rows={2} placeholder="Add a note for this day..." value={editNote} onChange={e => setEditNote(e.target.value)} style={{ borderColor: "#f59e0b50" }} />
                )}
              </div>
              {platform === "both" && (
                <div>
                  <label className="planner-field-label" style={{ marginBottom: "8px" }}>Platform</label>
                  <div className="planner-platform-row">
                    {["youtube", "instagram", "both"].map(p => (
                      <button key={p} onClick={() => setEditPlatform(p)}
                        style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `1.5px solid ${editPlatform === p ? PC[p].color : "var(--border2)"}`, background: editPlatform === p ? PC[p].bg : "transparent", color: editPlatform === p ? PC[p].color : "var(--muted)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        {PC[p].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="planner-modal-actions planner-modal-actions-top">
              <button onClick={() => setEditingEntry(null)} className="planner-btn-secondary">Cancel</button>
              <button onClick={saveEdit} className="planner-btn-fill" style={{ background: accent }}>
                <Check size={13} />Save
              </button>
            </div>
          </div>
        </>
      )}

      {confirmNew && (
        <>
          <div onClick={() => setConfirmNew(false)} className="planner-overlay planner-overlay-strong" />
          <div className="planner-modal planner-modal-danger">
            <div className="planner-danger-icon">
              <X size={22} color="#f87171" />
            </div>
            <h2 className="planner-danger-title">You'll lose your data</h2>
            <p className="planner-danger-copy">
              Creating a new plan will permanently delete your current 30-day plan and all progress. This can't be undone.
            </p>
            <div className="planner-modal-actions">
              <button onClick={() => setConfirmNew(false)} className="planner-btn-secondary">
                Keep my plan
              </button>
              <button onClick={() => {
                localStorage.removeItem(STORAGE_KEYS.PLANNER_DATA)
                setScreen("setup"); setEntries([]); setPlanInfo(null); setActiveDay(null); setConfirmNew(false)
              }} className="planner-btn-fill-danger">
                Yes, delete it
              </button>
            </div>
          </div>
        </>
      )}

      {addDayModal && (
        <>
          <div onClick={() => setAddDayModal(null)} className="planner-overlay planner-overlay-soft" />
          <div className="planner-modal planner-modal-sm">
            <div className="planner-modal-head planner-modal-head-sm">
              <h2 className="planner-modal-title planner-modal-title-sm">
                Add to {addDayModal.dayName}, {addDayModal.dateLabel}
              </h2>
              <button onClick={() => setAddDayModal(null)} className="planner-modal-close"><X size={15} /></button>
            </div>
            <textarea
              className="input-sm planner-textarea-add"
              rows={3}
              placeholder="What will you post on this day?"
              value={addDayContent}
              onChange={e => setAddDayContent(e.target.value)}
              style={{ borderColor: addDayContent ? accent : "var(--border2)" }}
            />
            <div className="planner-modal-actions">
              <button onClick={() => setAddDayModal(null)} className="planner-btn-secondary">
                Cancel
              </button>
              <button onClick={() => {
                if (!addDayContent.trim()) return
                const updated = entries.map(e => e.day === addDayModal.day ? { ...e, content: addDayContent.trim(), active: true } : e)
                setEntries(updated)
                savePlan(updated, planInfo)
                setAddDayModal(null)
              }}
                className="planner-btn-fill planner-btn-fill-sm"
                style={{ background: accent }}>
                <Check size={13} /> Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
