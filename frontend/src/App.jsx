import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import PlatformSelect from './pages/PlatformSelect'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import Planner from './pages/Planner'
import Settings from './pages/Settings'
import Content from './pages/Content'
import Analytics from './pages/Analytics'
import AuthCallback from './pages/AuthCallback'
import InstagramCallback from './pages/InstagramCallback'

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken")
  if (!token) return <Navigate to="/auth" replace />
  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/instagram/callback" element={<PrivateRoute><InstagramCallback /></PrivateRoute>} />
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

export default App
