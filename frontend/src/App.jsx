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

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken")
  if (!token) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/select-platform" element={<PrivateRoute><PlatformSelect /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/generator" element={<PrivateRoute><ContentGenerator /></PrivateRoute>} />
        <Route path="/planner" element={<PrivateRoute><Planner /></PrivateRoute>} />
        <Route path="/content" element={<PrivateRoute><Content /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
