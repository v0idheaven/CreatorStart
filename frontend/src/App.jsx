import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./supabase";
import Auth from "./pages/Auth";
import Sidebar from "./components/Sidebar";
import PlatformSelect from "./pages/PlatformSelect";
import Dashboard from "./pages/Dashboard";
import DashboardYT from "./pages/DashboardYT";
import DashboardIG from "./pages/DashboardIG";
import ContentGenerator from "./pages/ContentGenerator";
import Planner from "./pages/Planner";
import { usePlatform } from "./hooks/useplatform";

const Layout = ({ children }) => (
  <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
    <Sidebar />
    <main style={{ flex: 1, overflow: "auto", padding: "24px", marginLeft: "68px" }}>
      {children}
    </main>
  </div>
);

const DashboardRouter = () => {
  const { platform } = usePlatform();
  if (!platform) return <div style={{ color: "var(--dim)", padding: "24px" }}>Loading...</div>;
  if (platform === "youtube") return <DashboardYT />;
  if (platform === "instagram") return <DashboardIG />;
  return <Dashboard />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { platform } = usePlatform();

useEffect(() => {
  if (platform === "youtube") {
    document.body.className = "theme-yt"
  }
  else if (platform === "instagram") {
    document.body.className = "theme-ig"
  }
  else {
    document.body.className = ""
  }
}, [platform])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (loading)
    return <div style={{ background: "var(--bg)", height: "100vh" }} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/select-platform" element={user ? <PlatformSelect /> : <Navigate to="/auth" />} />
        <Route path="/" element={user ? <Layout><DashboardRouter /></Layout> : <Navigate to="/auth" />} />
        <Route path="/generator" element={user ? <Layout><ContentGenerator /></Layout> : <Navigate to="/auth" />} />
        <Route path="/planner" element={user ? <Layout><Planner /></Layout> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;