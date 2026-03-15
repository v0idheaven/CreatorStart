import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./supabase";
import Auth from "./pages/Auth";
import Sidebar from "./components/Sidebar";
import PlatformSelect from "./pages/PlatformSelect";
import { usePlatform } from "./context/PlatformContext";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activePlat } = usePlatform();

  useEffect(() => {
  if (activePlat === 'youtube') {
    document.body.className = 'theme-yt'
  } else if (activePlat === 'instagram') {
    document.body.className = 'theme-ig'
  } else {
    document.body.className = ''
  }
}, [activePlat])

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
        <Route
          path="/select-platform"
          element={user ? <PlatformSelect /> : <Navigate to="/auth" />}
        />
        <Route
          path="/*"
          element={
            user ? (
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  background: "var(--bg)",
                }}
              >
                <Sidebar />
                <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
                  <p style={{ color: "var(--text)" }}>Main content here</p>
                </main>
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
