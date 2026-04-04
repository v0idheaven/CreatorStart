import { useState } from "react"
import { Sparkles, Check, Pencil, X, StickyNote, Users, Flame, Zap, Target, DollarSign, Heart, Youtube, Instagram, Scale, Calendar, Plus, Trash2 } from "lucide-react"

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
import { apiFetch } from "../utils/api"

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

function buildFallbackContent(goalLabel, topicLabel, platformLabel, dayNum, seed) {
  const angles = [
    "quick tip", "common mistake", "step-by-step guide", "myth vs reality",
    "behind-the-scenes", "beginner checklist", "pro strategy", "case study",
    "trending topic", "audience Q&A", "personal story", "tool review",
  ]
  const formats = ["Short video", "Carousel", "Story", "Post", "Live topic", "Reel", "Tutorial", "Vlog"]
  const idx = (dayNum + seed) % angles.length
  const fidx = (dayNum * 3 + seed) % formats.length
  const angle = angles[idx]
  const format = formats[fidx]
  return `${format}: ${goalLabel} for ${topicLabel} on ${platformLabel} - ${angle}.`
}

function generatePlan(goal, topic, freq, focus, platform, seed = 0) {
  // IST today
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())

  // Full current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const focusPlatform = focus || platform
  const goalLabel = GOALS.find(g => g.id === goal)?.label || goal
  const topicLabel = TOPICS.find(t => t.id === topic)?.label || topic

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + i)
    const dayNum = i + 1
    const isPast = date < today
    const isToday = date.getTime() === today.getTime()
    const offsetFromToday = Math.round((date - today) / 86400000)

    // Determine if this day should have content based on frequency
    let isActive = false
    if (!isPast) {
      if (freq === "daily") isActive = true
      else if (freq === "alt") isActive = offsetFromToday % 2 === 0
      else if (freq === "weekdays") {
        const dow = date.getDay()
        isActive = dow !== 0 && dow !== 6
      } else isActive = true
    }

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
      date: date.toISOString(),
      dateLabel: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      dayName: date.toLocaleDateString("en-IN", { weekday: "short" }),
      isToday,
      content: isActive ? buildFallbackContent(goalLabel, topicLabel, p === "both" ? "YouTube + Instagram" : p === "youtube" ? "YouTube" : "Instagram", dayNum, seed) : "",
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

  const rawSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.getPlannerData()) || "null")

  // If saved plan is from a previous month, clear it
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  const todayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())

  let saved = rawSaved
  if (rawSaved?.entries?.length > 0) {
    const firstEntry = rawSaved.entries[0]
    if (firstEntry?.date) {
      const firstDate = new Date(firstEntry.date)
      const sameMonth = firstDate.getFullYear() === todayIST.getFullYear() &&
                        firstDate.getMonth() === todayIST.getMonth()
      const startsOnFirst = firstDate.getDate() === 1
      const isStringDate = typeof firstEntry.date === "string"
      if (!sameMonth || !startsOnFirst || !isStringDate) {
        saved = null
        localStorage.removeItem(STORAGE_KEYS.getPlannerData())
      }
    }
  }

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
  const [activeExtraIdx, setActiveExtraIdx] = useState(null)

  // load from backend on mount, merge with localStorage
  useState(() => {
    async function loadFromBackend() {
      try {
        const [planRes, streakRes] = await Promise.all([
          apiFetch(API_ENDPOINTS.getPlan(platform)),
          apiFetch(API_ENDPOINTS.getStreak(platform))
        ])
        if (planRes.ok) {
          const planData = await planRes.json()
          if (planData?.data) {
            localStorage.setItem(STORAGE_KEYS.getPlannerData(), JSON.stringify(planData.data))
            if (!saved) {
              setEntries(planData.data.entries || [])
              setPlanInfo(planData.data.planInfo || null)
              if (planData.data.entries?.length > 0) setScreen("plan")
            }
          }
        }
        if (streakRes.ok) {
          const streakData = await streakRes.json()
          if (Array.isArray(streakData?.data)) {
            localStorage.setItem(STORAGE_KEYS.getStreakData(), JSON.stringify(streakData.data))
          }
        }
      } catch (error) {
        console.warn("Failed to load planner/streak data", error)
      }
    }
    loadFromBackend()
  })

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
      setActiveExtraIdx(null)
    } else {
      setActiveDay(day)
      setActiveExtraIdx(null)
      const entry = entries.find(e => e.day === day)
      if (entry?.content) generateDayDetail(entry)
    }
  }

  function savePlan(newEntries, newPlanInfo) {
    const planId = newPlanInfo?.planId || planInfo?.planId
    const planPayload = { entries: newEntries, planInfo: newPlanInfo }
    localStorage.setItem(STORAGE_KEYS.getPlannerData(), JSON.stringify(planPayload))

    // sync to backend
    apiFetch(API_ENDPOINTS.savePlan, {
      method: "POST",
      body: JSON.stringify({ platform, planData: planPayload })
    }).catch(() => {})

    const completedDays = newEntries.filter(e => e.isCompleted).map(e => ({ day: e.day, date: e.date, planId }))
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.getStreakData()) || "[]")
    const otherPlans = existing.filter(m => m.planId !== planId)
    const merged = [...otherPlans, ...completedDays]
    localStorage.setItem(STORAGE_KEYS.getStreakData(), JSON.stringify(merged))

    // sync streak to backend
    apiFetch(API_ENDPOINTS.saveStreak, {
      method: "POST",
      body: JSON.stringify({ platform, streakData: merged })
    }).catch(() => {})
  }

  async function handleGenerate(goal, topic, freq, focus) {
    setGenerating(true)
    const newInfo = { goal, topic, freq, focus, planId: `plan_${Date.now()}` }
    setPlanInfo(newInfo)
    setTimeout(() => {
      const newEntries = generatePlan(goal, topic, freq, focus, platform, Date.now() % 1000)
      setEntries(newEntries)
      savePlan(newEntries, newInfo)
      setScreen("plan")
      setGenerating(false)
    }, 1200)
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
    const entry = entries.find(e => e.id === id)
    if (!entry) return

    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
    const entryDate = entry.date ? new Date(entry.date) : null
    if (entryDate) entryDate.setHours(0, 0, 0, 0)

    if (!entryDate || entryDate.getTime() !== today.getTime()) return

    const updated = entries.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e)
    setEntries(updated)
    savePlan(updated, planInfo)
  }

  if (generating) {
    return (
      <div className="planner-generating-root">
        <Sidebar />
      <div className="planner-generating-main">
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
        </div>
      </div>
    )
  }

  return (
    <div className="planner-root">
      <Sidebar />
      <div className="planner-content-wrapper">
      <main className="planner-main">

        <div className="planner-header">
          <div>
            <p className="planner-header-kicker">Content</p>
            <h1 className="planner-header-title">
              30-Day Planner &nbsp;
              <span className="planner-header-month">
                {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}
              </span>
            </h1>
            {planInfo && (
              <p className="planner-header-subtitle">
                {GOALS.find(g => g.id === planInfo.goal)?.label} · {TOPICS.find(t => t.id === planInfo.topic)?.label} · {FREQUENCIES.find(f => f.id === planInfo.freq)?.label}
              </p>
            )}
          </div>

          {screen === "plan" && (
            <div className="planner-top-actions">
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
            <div className="planner-filter-row">
              <div className="planner-filter-chips">
                {[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "done", label: "Done" }].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} className="planner-filter-chip"
                    style={{ border: `1px solid ${filter === f.id ? accent : "var(--border)"}`, background: filter === f.id ? accent : "transparent", color: filter === f.id ? "#fff" : "var(--muted)" }}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="planner-progress-row">
                <span className="planner-progress-label">{completed} of {active.length} done</span>
                <div className="planner-progress-bar">
                  <div className="planner-progress-fill-bar" style={{ width: `${active.length ? (completed / active.length) * 100 : 0}%` }} />
                </div>
                <span className="planner-progress-pct">{active.length ? Math.round((completed / active.length) * 100) : 0}%</span>
              </div>
            </div>

            <div className="planner-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} className="planner-weekday">{d}</div>
              ))}
            </div>

            <div className="planner-calendar">
              {(() => {
                const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())
                const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                const startDow = firstOfMonth.getDay()
                const mondayOffset = startDow === 0 ? 6 : startDow - 1
                const blanks = Array.from({ length: mondayOffset }, (_, i) => (
                  <div key={`b${i}`} className="planner-blank" />
                ))

                const allEntries = filter === "all"
                  ? entries
                  : filter === "done"
                  ? entries.map(e => e.active && !e.isCompleted ? { ...e, content: "" } : e)
                  : entries.map(e => e.active && e.isCompleted ? { ...e, content: "" } : e)

                const cards = allEntries.map(entry => {
                  const pc = PC[entry.platform] || PC.both
                  const isSelected = activeDay === entry.day
                  const dateLabel = entry.dateLabel || String(entry.date ? new Date(entry.date).getDate() : entry.day)
                  const isEmpty = !entry.active || !entry.content

                  const _istNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                  const todayNow = new Date(_istNow.getFullYear(), _istNow.getMonth(), _istNow.getDate())
                  const entryDateObj = entry.date ? new Date(entry.date) : null
                  if (entryDateObj) entryDateObj.setHours(0, 0, 0, 0)
                  const isTodayNow = entryDateObj ? entryDateObj.getTime() === todayNow.getTime() : false
                  const isPastNow = entryDateObj ? entryDateObj < todayNow : false

                  return (
                    <div key={entry.id}
                      onClick={() => { if (!isEmpty) handleDayClick(entry.day) }}
                      className={`planner-day-card ${isEmpty ? "planner-day-card--empty" : "planner-day-card--clickable"}`}
                      style={{
                        border: `1.5px solid ${isSelected ? accent : entry.isCompleted ? "#4ade8040" : isTodayNow ? accent + "70" : "var(--border)"}`,
                        background: isSelected ? accent + "12" : entry.isCompleted ? "#4ade8008" : isTodayNow && !isEmpty ? accent + "08" : "var(--card)",
                      }}>
                      <div className="planner-day-card-top">
                        <div className="planner-day-date-col">
                          <span className="planner-day-date" style={{ color: isTodayNow ? accent : entry.isCompleted ? "#4ade80" : "var(--text)" }}>{dateLabel}</span>
                          {isTodayNow && <div className="planner-day-today-dot" style={{ background: accent }} />}
                        </div>
                        {!isEmpty && <span className="planner-day-platform-badge" style={{ color: pc.color, background: pc.bg }}>{pc.label}</span>}
                      </div>
                      {!isEmpty && entry.content && (
                        <p className="planner-day-content" style={{ color: entry.isCompleted ? "var(--dim)" : "var(--muted)", textDecoration: entry.isCompleted ? "line-through" : "none" }}>
                          {entry.content}
                        </p>
                      )}
                      {entry.isCompleted && (
                        <div className="planner-day-done-dot"><Check size={7} color="#fff" strokeWidth={3} /></div>
                      )}
                      {entry.note && !entry.isCompleted && <div className="planner-day-note-dot" />}
                      {entry.extraPosts?.length > 0 && (
                        <div className="planner-day-extra-badge" style={{ color: accent, background: accent + "20" }}>+{entry.extraPosts.length}</div>
                      )}
                      {isEmpty && planInfo?.freq !== "daily" && !isPastNow && (
                        <button onClick={e => { e.stopPropagation(); setAddDayModal(entry); setAddDayContent("") }}
                          className="planner-day-add-btn"
                          style={{ border: `1.5px solid ${accent}`, background: accent + "30", color: accent }}>
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      )}
                      {!isEmpty && !isPastNow && (
                        <button onClick={e => { e.stopPropagation(); setAddDayModal(entry); setAddDayContent("") }}
                          className="planner-day-add-btn planner-day-add-btn-sm"
                          style={{ border: `1px solid ${accent}50`, background: accent + "20", color: accent }}>
                          <Plus size={10} strokeWidth={2.5} />
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
              <span className="planner-detail-date">{activeEntry.dayName}, {activeEntry.dateLabel}</span>
              {activeEntry.isToday && <span className="planner-detail-today-tag">Today</span>}
              <span className="planner-detail-tag" style={{ color: PC[activeEntry.platform].color, background: PC[activeEntry.platform].bg }}>{PC[activeEntry.platform].label}</span>
              {activeEntry.isCompleted && <span className="planner-detail-done-tag">✓ Done</span>}
            </div>
            <div className="planner-detail-head-right">
              {(() => {
                const _nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                const today = new Date(_nowIST.getFullYear(), _nowIST.getMonth(), _nowIST.getDate()); today.setHours(0,0,0,0)
                const entryDate = activeEntry.date ? new Date(activeEntry.date) : null
                if (entryDate) entryDate.setHours(0,0,0,0)
                const isFuture = entryDate && entryDate > today
                const isPast = entryDate && entryDate < today

                if (isFuture) return <span className="planner-detail-unavailable">Available on {activeEntry.dateLabel}</span>
                if (isPast) return <span className="planner-detail-unavailable">{activeEntry.isCompleted ? "✓ Completed" : "Missed"}</span>
                return (
                  <button onClick={() => toggleDone(activeEntry.id)} className="planner-detail-status-btn">
                    <Check size={11} />{activeEntry.isCompleted ? "Undo" : "Mark done"}
                  </button>
                )
              })()}
              <button onClick={() => openEdit(activeEntry)} className="planner-detail-edit-btn" style={{ border: `1px solid ${accent}30`, color: accent }}>
                <Pencil size={11} />Edit
              </button>
              {(() => {
                const _n = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                const _today = new Date(_n.getFullYear(), _n.getMonth(), _n.getDate()); _today.setHours(0,0,0,0)
                const _ed = activeEntry.date ? new Date(activeEntry.date) : null
                if (_ed) _ed.setHours(0,0,0,0)
                if (_ed && _ed < _today) return null
                return (
                  <button onClick={() => {
                    const updated = entries.map(e => e.id === activeEntry.id ? { ...e, content: "", active: false, isCompleted: false, note: "", extraPosts: [] } : e)
                    setEntries(updated); savePlan(updated, planInfo); setActiveDay(null); setAiDetail(null)
                  }} className="planner-detail-delete-btn">
                    <Trash2 size={11} />Delete
                  </button>
                )
              })()}
              <button onClick={() => { setActiveDay(null); setAiDetail(null) }} className="planner-detail-close-btn">
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="planner-detail-body">
            <div>
              <p className="planner-detail-content">{activeEntry.content}</p>
              {activeEntry.extraPosts?.length > 0 && (
                <div className="planner-extra-posts">
                  {activeEntry.extraPosts.map((post, i) => (
                    <div key={i} className="planner-extra-post" style={{ borderColor: activeExtraIdx === i ? accent + "60" : "var(--border)" }}>
                      <span className="planner-extra-num" style={{ color: accent, background: accent + "15" }}>#{i + 2}</span>
                      <p className="planner-extra-text">{post}</p>
                      <button onClick={async () => {
                        setActiveExtraIdx(i)
                        try {
                          await generateDayDetail({ ...activeEntry, content: post })
                        } catch (error) {
                          console.warn("Failed to generate extra post brief", error)
                        }
                      }} className="planner-extra-brief-btn" style={{ border: `1px solid ${accent}30`, color: accent }}>
                        <Sparkles size={10} /> Brief
                      </button>
                      <button onClick={() => {
                        const updated = entries.map(e => e.id === activeEntry.id ? { ...e, extraPosts: e.extraPosts.filter((_, j) => j !== i) } : e)
                        setEntries(updated); savePlan(updated, planInfo)
                        if (activeExtraIdx === i) {
                          setActiveExtraIdx(null)
                        }
                      }} className="planner-extra-remove-btn">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {(() => {
                const _n = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                const todayCheck = new Date(_n.getFullYear(), _n.getMonth(), _n.getDate())
                const entryDateCheck = activeEntry.date ? new Date(activeEntry.date) : null
                if (entryDateCheck) entryDateCheck.setHours(0,0,0,0)
                if (entryDateCheck && entryDateCheck < todayCheck) return null
                return (
                  <button onClick={() => { setAddDayModal(activeEntry); setAddDayContent("") }}
                    className="planner-add-post-btn" style={{ border: `1px solid ${accent}30`, color: accent }}>
                    <Plus size={12} /> Add another post for this day
                  </button>
                )
              })()}
            </div>
            {aiLoading && (
              <div className="planner-loading-row">
                <div className="spinner spinner-sm" style={{ borderTopColor: accent }} />
                Generating content brief...
              </div>
            )}
            {aiError && <p style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{aiError}</p>}
            {aiDetail && (
              <div className="planner-ai-grid">
                {[{ key: "hook", label: "Hook" }, { key: "cta", label: "Call to Action" }, { key: "whatToSay", label: "What to Say" }, { key: "tip", label: "Pro Tip" }, { key: "script", label: "Script Outline" }].map(({ key, label }) => aiDetail[key] && (
                  <div key={key} className="planner-ai-card">
                    <p className="planner-ai-card-label" style={{ color: accent }}>{label}</p>
                    <p className="planner-ai-card-text">{aiDetail[key]}</p>
                  </div>
                ))}
              </div>
            )}
            {!aiLoading && !aiDetail && !aiError && (
              <button onClick={() => generateDayDetail(activeEntry)}
                className="planner-brief-btn" style={{ border: `1px solid ${accent}40`, background: accent + "12", color: accent }}>
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
                    ))}                  </div>
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
              <button onClick={async () => {
                localStorage.removeItem(STORAGE_KEYS.getPlannerData())
                // also clear from backend so reload doesn't restore it
                try {
                  await apiFetch(API_ENDPOINTS.savePlan, {
                    method: "POST",
                    body: JSON.stringify({ platform, planData: null })
                  })
                } catch (error) {
                  console.warn("Failed to clear plan on server", error)
                }
                setConfirmNew(false)
                setEntries([])
                setPlanInfo(null)
                setActiveDay(null)
                setScreen("setup")
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
                const updated = entries.map(e => {
                  if (e.day !== addDayModal.day) return e
                  if (!e.content) return { ...e, content: addDayContent.trim(), active: true }
                  return { ...e, extraPosts: [...(e.extraPosts || []), addDayContent.trim()] }
                })
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
    </div>
  )
}
