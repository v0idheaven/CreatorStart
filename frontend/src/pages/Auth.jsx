import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Youtube, Instagram, Layers } from "lucide-react"

const API = import.meta.env.VITE_API_URL || ""

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

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) { setError("Email and password are required."); return }
    if (!isLogin && !form.name) { setError("Full name is required."); return }

    setLoading(true)
    try {
      if (isLogin) {
        const res = await fetch(`${API}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email, password: form.password })
        })
        const data = await res.json()
        if (!res.ok) { setError(data.message || "Login failed"); return }

        localStorage.setItem("accessToken", data.data.accessToken)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        navigate("/select-platform")
      } else {
        const res = await fetch(`${API}/api/v1/auth/register`, {
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
        if (!res.ok) { setError(data.message || "Registration failed"); return }

        // auto-login after register
        const loginRes = await fetch(`${API}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email, password: form.password })
        })
        const loginData = await loginRes.json()
        if (loginRes.ok) {
          localStorage.setItem("accessToken", loginData.data.accessToken)
          localStorage.setItem("user", JSON.stringify(loginData.data.user))
        }
        navigate("/select-platform")
      }
    } catch {
      setError("Network error. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  const asidePoints = isLogin
    ? ["Your session stays alive with refresh-token auth.", "Switch between YouTube, Instagram, or both platforms.", "Your 30-day planner and streak are saved across sessions."]
    : ["AI builds your 30-day content plan in seconds.", "Platform-specific dashboards for YT and Instagram.", "Track your posting streak like GitHub contributions."]

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Left aside */}
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

      {/* Right form */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 40px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "-0.05em", margin: "0 0 8px" }}>
            {isLogin ? "Welcome back." : "Create account."}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 36px" }}>
            {isLogin ? "Sign in to CreatorStart to continue." : "Start your creator journey today."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {!isLogin && (
              <>
                <div>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "7px", fontWeight: "500" }}>Full name</label>
                  <input value={form.name} onChange={set("name")} placeholder="Your full name"
                    style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "7px", fontWeight: "500" }}>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
                style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "7px", fontWeight: "500" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Enter your password"
                  style={{ ...inputStyle, padding: "12px 48px 12px 16px" }}
                  onFocus={focus} onBlur={blur} />
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
                style={{ padding: "12px 24px", borderRadius: "20px", background: "#818cf8", border: "none", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}>
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
