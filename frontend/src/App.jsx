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
// This keeps users logged in across sessions (up to 7 days)
async function tryRestoreSession() {
  try {
    const res = await fetch(API_ENDPOINTS.refresh, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken)
      // Also refresh user data
      if (data?.data?.user) {
        const existing = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...existing, ...data.data.user }))
      }
      return true
    }
    return false
  } catch {
    return false
  }
}

function PrivateRoute({ children, sessionChecked, sessionValid }) {
  // Wait for session check to complete before deciding
  if (!sessionChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid #818cf820", borderTop: "3px solid #818cf8", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }
  const token = localStorage.getItem("accessToken")
  if (!token && !sessionValid) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      // Already have a token — no need to refresh on startup
      setSessionValid(true)
      setSessionChecked(true)
    } else {
      // No token — try to restore session via refresh token cookie
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
        <Route path="/" element={<LandingPage />} />
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
