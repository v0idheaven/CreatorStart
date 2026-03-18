import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from './supabase'

import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import PlatformSelect from './pages/PlatformSelect'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import Planner from './pages/Planner'
import { PlatformProvider } from './context/PlatformContext'

const App = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg)' }}>
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent)' }} />
    </div>
  )

  return (
    // BrowserRouter wraps PlatformProvider so useLocation works inside context
    <BrowserRouter>
      <PlatformProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/select-platform" element={session ? <PlatformSelect /> : <Navigate to="/auth" />} />
          <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/generator" element={session ? <ContentGenerator /> : <Navigate to="/auth" />} />
          <Route path="/planner" element={session ? <Planner /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </PlatformProvider>
    </BrowserRouter>
  )
}

export default App