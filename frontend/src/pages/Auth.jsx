import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Youtube, Instagram, Layers } from "lucide-react"
import { API_ENDPOINTS } from "../constants/api"

const inputStyle = {
  width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "14px", padding: "12px 16px", color: "#fff", fontSize: "14px",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s"
}

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(!location.state?.signup)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const focus = (e) => e.target.style.borderColor = "#818cf8"
  const blur = (e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"

  function restoreUserToLocal(user) {
    localStorage.setItem("user", JSON.stringify(user))
    if (user.platform) localStorage.setItem("platform", user.platform)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form.email || !form.password) { setError("Email and password are required."); return }
    if (!isLogin && !form.name) { setError("Full name is required."); return }
    setLoading(true)

    try {
      if (isLogin) {
        const res = await fetch(API_ENDPOINTS.login, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email, password: form.password })
        })
        const data = await res.json()
        if (!res.ok) { setError(data.message || "Login failed"); setLoading(false); return }

        localStorage.setItem("accessToken", data.data.accessToken)
        restoreUserToLocal(data.data.user)

        const plat = data.data.user?.platform
        navigate(plat ? "/dashboard" : "/select-platform")
      } else {
        const res = await fetch(API_ENDPOINTS.register, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName: form.name,
            username: form.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + Date.now().toString().slice(-4),
            email: form.email,
            password: form.password
          })
        })
        const data = await res.json()
        if (!res.ok) { setError(data.message || "Registration failed"); setLoading(false); return }

        // auto login after register
        const loginRes = await fetch(API_ENDPOINTS.login, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email, password: form.password })
        })
        const loginData = await loginRes.json()
        if (loginRes.ok) {
          localStorage.setItem("accessToken", loginData.data.accessToken)
          restoreUserToLocal(loginData.data.user)
        }
        navigate("/select-platform")
      }
    } catch {
      // backend offline — local fallback
      const stored = JSON.parse(localStorage.getItem("user") || "{}")
      if (isLogin) {
        if (!stored.email) { setError("No account found. Please sign up first."); setLoading(false); return }
        if (stored.email !== form.email) { setError("Email not found."); setLoading(false); return }
        if (stored.password && stored.password !== form.password) { setError("Incorrect password."); setLoading(false); return }
        const plat = stored.platform || localStorage.getItem("platform")
        if (plat) localStorage.setItem("platform", plat)
        navigate(plat ? "/dashboard" : "/select-platform")
      } else {
        const user = { fullName: form.name, email: form.email, password: form.password, username: form.email.split("@")[0] }
        localStorage.setItem("user", JSON.stringify(user))
        navigate("/select-platform")
      }
    } finally {
      setLoading(false)
    }
  }

  const asidePoints = isLogin
    ? ["Your session stays alive with refresh-token auth.", "Switch between YouTube, Instagram, or both platforms.", "Your 30-day planner and streak are saved across sessions."]
    : ["AI builds your 30-day content plan in seconds.", "Platform-specific dashboards for YT and Instagram.", "Track your posting streak like GitHub contributions."]

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ width: "420px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0a", padding: "48px 40px", display: "flex", flexDirection: "column", gap: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "60px" }}>
            <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: 0, marginRight: "8px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back
            </button>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "linear-gradient(135deg, #818cf8, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#fff" }}>CS</div>
            <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.04em" }}>Creator<span style={{ color: "#818cf8" }}>Start</span></span>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "16px", border: "1px solid rgba(129,140,248,0.2)", background: "rgba(129,140,248,0.08)", padding: "5px 12px", fontSize: "12px", fontWeight: "500", color: "#818cf8", marginBottom: "24px" }}>
            {isLogin ? "Welcome back" : "Get started"}
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.05em", lineHeight: "1.15", margin: "0 0 20px", color: "#fff" }}>
            {isLogin ? "Sign in and pick up where your last post left off." : "Build your content empire, one day at a time."}
          </h2>

          <p style={{ fontSize: "14px", lineHeight: "1.8", color: "rgba(255,255,255,0.4)", margin: "0 0 32px" }}>
            {isLogin ? "Your planner, streak, and AI tools are waiting." : "AI-powered planning for YouTube and Instagram creators."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {asidePoints.map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(129,140,248,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <span style={{ color: "#818cf8", fontSize: "12px", fontWeight: "700" }}>+</span>
                </div>
                <p style={{ fontSize: "13px", lineHeight: "1.7", color: "rgba(255,255,255,0.55)", margin: 0 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {[{ Icon: Youtube, color: "#ff4444", label: "YT" }, { Icon: Instagram, color: "#c13584", label: "IG" }, { Icon: Layers, color: "#818cf8", label: "Both" }].map(({ Icon, color, label }) => (
            <div key={label} style={{ flex: 1, borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "#111", padding: "12px", textAlign: "center" }}>
              <Icon size={18} color={color} strokeWidth={1.8} style={{ margin: "0 auto 6px", display: "block" }} />
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 40px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.05em", margin: "0 0 8px" }}>
            {isLogin ? "Welcome back." : "Create account."}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 36px" }}>
            {isLogin ? "Sign in to CreatorStart to continue." : "Start your creator journey today."}
          </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Google OAuth */}
            <a href={`${import.meta.env.VITE_API_URL || ""}/api/v1/auth/google`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.12)", background: "#111", color: "#fff", fontSize: "14px", fontWeight: "500", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>
            {!isLogin && (
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "7px", fontWeight: "500" }}>Full name</label>
                <input value={form.name} onChange={set("name")} placeholder="Your full name" style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            )}
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "7px", fontWeight: "500" }}>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "7px", fontWeight: "500" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Enter your password"
                  style={{ ...inputStyle, padding: "12px 48px 12px 16px" }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", padding: "4px" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ borderRadius: "12px", border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.08)", padding: "10px 14px", fontSize: "13px", color: "#f87171" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", paddingTop: "6px" }}>
              <button type="submit" disabled={loading}
                style={{ padding: "12px 24px", borderRadius: "20px", background: "#818cf8", border: "none", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
              </button>
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setForm({ name: "", email: "", password: "" }) }}
                style={{ padding: "12px 24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </div>
          </form>

          <p style={{ marginTop: "24px", fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
            By continuing you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
