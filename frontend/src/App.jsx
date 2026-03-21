import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import PlatformSelect from './pages/PlatformSelect'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import Planner from './pages/Planner'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/select-platform" element={<PlatformSelect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generator" element={<ContentGenerator />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App