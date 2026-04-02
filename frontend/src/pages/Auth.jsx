import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const navigate = useNavigate()

  function handleSubmit() {
    navigate("/select-platform")
  }

  return (
    <div className="auth-page">

      <div className="auth-logo">
        <span className="auth-logo-text">
          Creator<span className="auth-logo-accent">Start</span>
        </span>
      </div>

      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="auth-subtitle">
          {isLogin ? "Sign in to CreatorStart" : "Start your creator journey"}
        </p>

        <div className="auth-fields">
          {!isLogin && (
            <input
              className="input"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          {isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="auth-switch-link"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <div className="auth-divider-line" />
        </div>

        <button className="btn-outline" onClick={() => navigate("/select-platform")}>
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.8-11.3-7l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="auth-legal">
        By continuing you agree to our Terms & Privacy Policy
      </p>
    </div>
  )
}
