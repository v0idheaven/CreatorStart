import { useState, useEffect, useMemo } from "react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"
import { STORAGE_KEYS } from "../../constants/storageKeys"
import { generatePlan } from "./plannerUtils"

// Manages all planner state: entries, planInfo, screen, saving, generating
export default function usePlannerData(platform) {
  const saved = useMemo(() => {
    const rawSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.getPlannerData()) || "null")
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const todayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate())

    let validated = rawSaved
    if (rawSaved?.entries?.length > 0) {
      const first = rawSaved.entries[0]
      if (first?.date) {
        const fd = new Date(first.date)
        const sameMonth = fd.getFullYear() === todayIST.getFullYear() && fd.getMonth() === todayIST.getMonth()
        if (!sameMonth || fd.getDate() !== 1 || typeof first.date !== "string") {
          validated = null
          localStorage.removeItem(STORAGE_KEYS.getPlannerData())
        }
      }
    }
    return validated
  }, [])

  const [screen, setScreen] = useState(saved ? "plan" : "setup")
  const [generating, setGenerating] = useState(false)
  const [entries, setEntries] = useState(saved?.entries || [])
  const [planInfo, setPlanInfo] = useState(saved?.planInfo || null)

  function savePlan(newEntries, newPlanInfo) {
    const planId = newPlanInfo?.planId || planInfo?.planId
    const payload = { entries: newEntries, planInfo: newPlanInfo }
    localStorage.setItem(STORAGE_KEYS.getPlannerData(), JSON.stringify(payload))
    apiFetch(API_ENDPOINTS.savePlan, { method: "POST", body: JSON.stringify({ platform, planData: payload }) }).catch(() => {})

    const completedDays = newEntries.filter(e => e.isCompleted).map(e => ({ day: e.day, date: e.date, planId }))
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.getStreakData()) || "[]")
    const merged = [...existing.filter(m => m.planId !== planId), ...completedDays]
    localStorage.setItem(STORAGE_KEYS.getStreakData(), JSON.stringify(merged))
    apiFetch(API_ENDPOINTS.saveStreak, { method: "POST", body: JSON.stringify({ platform, streakData: merged }) }).catch(() => {})
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

  function updateEntries(updated, info) {
    setEntries(updated)
    savePlan(updated, info || planInfo)
  }

  function toggleDone(id) {
    const entry = entries.find(e => e.id === id)
    if (!entry) return
    const n = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    const today = new Date(n.getFullYear(), n.getMonth(), n.getDate())
    const ed = entry.date ? new Date(entry.date) : null
    if (ed) ed.setHours(0, 0, 0, 0)
    if (!ed || ed.getTime() !== today.getTime()) return
    updateEntries(entries.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e))
  }

  function saveEdit(entryId, { content, note, platform: p, contentType }) {
    updateEntries(entries.map(e => e.id === entryId ? { ...e, content, note, platform: p, contentType: contentType || e.contentType } : e))
  }

  function deleteEntry(entry) {
    updateEntries(entries.map(e => e.id === entry.id ? { ...e, content: "", active: false, isCompleted: false, note: "", extraPosts: [] } : e))
  }

  function addToDay(entry, content) {
    updateEntries(entries.map(e => {
      if (e.day !== entry.day) return e
      if (!e.content) return { ...e, content, active: true }
      return { ...e, extraPosts: [...(e.extraPosts || []), content] }
    }))
  }

  function removeExtraPost(entryId, idx) {
    updateEntries(entries.map(e => e.id === entryId ? { ...e, extraPosts: e.extraPosts.filter((_, j) => j !== idx) } : e))
  }

  async function clearPlan() {
    localStorage.removeItem(STORAGE_KEYS.getPlannerData())
    try { await apiFetch(API_ENDPOINTS.savePlan, { method: "POST", body: JSON.stringify({ platform, planData: null }) }) } catch { /* silent */ }
    setEntries([]); setPlanInfo(null); setScreen("setup")
  }

  // Load from backend on mount
  useEffect(() => {
    async function load() {
      try {
        const [planRes, streakRes] = await Promise.all([
          apiFetch(API_ENDPOINTS.getPlan(platform)),
          apiFetch(API_ENDPOINTS.getStreak(platform))
        ])
        if (planRes.ok) {
          const d = await planRes.json()
          if (d?.data) {
            localStorage.setItem(STORAGE_KEYS.getPlannerData(), JSON.stringify(d.data))
            if (!saved) {
              setEntries(d.data.entries || [])
              setPlanInfo(d.data.planInfo || null)
              if (d.data.entries?.length > 0) setScreen("plan")
            }
          }
        }
        if (streakRes.ok) {
          const d = await streakRes.json()
          if (Array.isArray(d?.data)) localStorage.setItem(STORAGE_KEYS.getStreakData(), JSON.stringify(d.data))
        }
      } catch { /* silent fail — backend may be unavailable */ }
    }
    load()
  }, [platform, saved])

  return { screen, setScreen, generating, entries, planInfo, handleGenerate, toggleDone, saveEdit, deleteEntry, addToDay, removeExtraPost, clearPlan }
}
