import type { ScoreSession } from "../lib/session"

type ScoreSession = {
  a: number
  b: number
  engagement: number
  formatMatch: number
  topicMatch: number   // ✅ Standardized
  risk: number
}

const KEY = "cheesecake_session"

export function saveSession(data: ScoreSession) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function loadSession(): ScoreSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(KEY)
}
