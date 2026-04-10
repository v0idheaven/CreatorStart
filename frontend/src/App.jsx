import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing'
import Auth from './pages/auth'
import AuthCallback from './pages/auth/AuthCallback'
import PlatformSelect from './pages/platform'
import Dashboard from './pages/dashboard'
import ContentGenerator from './pages/generator'
import Planner from './pages/planner'
import Settings from './pages/settings'
import Content from './pages/content'
import Analytics from './pages/analytics'
import NotFound from './pages/NotFound'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import { API_ENDPOINTS } from './constants/api'

// On app load — silently try to refresh token using httpOnly cookie
async function tryRestoreSession() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000) // 8s max wait
    const res = await fetch(API_ENDPOINTS.refresh, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) return false
    const data = await res.json()
    if (data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken)
      if (data?.data?.user) {
        const existing = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...existing, ...data.data.user }))
        if (data.data.user.platform) localStorage.setItem("platform", data.data.user.platform)
      }
      return true
    }
    return false
  } catch {
    return false
  }
}

function PrivateRoute({ children, sessionChecked, sessionValid }) {
  const token = localStorage.getItem("accessToken")
  const user = localStorage.getItem("user")

  // If we already have token + user in localStorage — render immediately, no wait
  if (token && user) return children

  // No local data — wait for session check
  if (!sessionChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid #2d8fa320", borderTop: "3px solid #2d8fa3", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // Session check done — if valid render, else redirect
  if (!sessionValid) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const user = localStorage.getItem("user")

    if (token && user) {
      // Both token and user exist — immediately valid, refresh silently in background
      setSessionValid(true)
      setSessionChecked(true)
      // Background refresh to keep token fresh (don't block UI)
      tryRestoreSession().catch(() => {})
    } else if (token && !user) {
      // Token exists but no user — fetch user data
      tryRestoreSession().then(ok => {
        setSessionValid(ok || !!localStorage.getItem("accessToken"))
        setSessionChecked(true)
      })
    } else {
      // No token — try cookie-based restore (may take time on cold start)
      tryRestoreSession().then(ok => {
        setSessionValid(ok)
        setSessionChecked(true)
      })
    }
  }, [])

  const privateProps = { sessionChecked, sessionValid }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          localStorage.getItem("accessToken") && localStorage.getItem("user")
            ? <Navigate to="/dashboard" replace />
            : <LandingPage />
        } />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/select-platform" element={<PrivateRoute {...privateProps}><PlatformSelect /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute {...privateProps}><Dashboard /></PrivateRoute>} />
        <Route path="/generator" element={<PrivateRoute {...privateProps}><ContentGenerator /></PrivateRoute>} />
        <Route path="/planner" element={<PrivateRoute {...privateProps}><Planner /></PrivateRoute>} />
        <Route path="/content" element={<PrivateRoute {...privateProps}><Content /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute {...privateProps}><Analytics /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute {...privateProps}><Settings /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
