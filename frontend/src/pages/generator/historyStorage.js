const HISTORY_KEY = "generator_history"
const MAX_HISTORY = 10

export function saveToHistory(fields, result) {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      fields: {
        format: fields.format,
        niche: fields.niche,
        goal: fields.goal,
        tone: fields.tone,
        topic: fields.topic,
        outputType: fields.outputType,
      },
      result,
    }
    const updated = [entry, ...existing].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // silent
  }
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
  } catch {
    return []
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function writeHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}
