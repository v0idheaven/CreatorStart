import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_URL || "https://creator-start-backend.onrender.com"

// Right panel: Google button + email/password form
export default function AuthForm({ isLogin, onToggle, onSubmit, loading, error }) {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="auth-main">
      <div className="auth-form-wrap">
        <h1 className="auth-title">{isLogin ? "Welcome back." : "Create account."}</h1>
        <p className="auth-subtitle">{isLogin ? "Sign in to CreatorStart to continue." : "Start your creator journey today."}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <a href={`${API_BASE}/api/v1/auth/google`} className="auth-google-btn">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <input className="auth-input" value={form.name} onChange={set("name")} placeholder="Your full name" />
            </div>
          )}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-pw-wrap">
              <input className="auth-input auth-input-pw" type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pw-toggle">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-actions">
            <button type="submit" disabled={loading} className="auth-btn-primary">
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
            <button type="button" onClick={onToggle} className="auth-btn-secondary">
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="auth-legal">By continuing you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  )
}
