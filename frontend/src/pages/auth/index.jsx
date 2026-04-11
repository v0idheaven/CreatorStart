import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { API_ENDPOINTS } from "../../constants/api"
import AuthAside from "./AuthAside"
import AuthForm from "./AuthForm"
import "./Auth.css"


export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(!location.state?.signup)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function restoreUserToLocal(user) {
    localStorage.setItem("user", JSON.stringify(user))
    if (user.platform) localStorage.setItem("platform", user.platform)
  }

  async function handleSubmit(form) {
    setError("")
    if (!form.email || !form.password) { setError("Email and password are required."); return }
    if (!isLogin && !form.name) { setError("Full name is required."); return }
    setLoading(true)

    try {
      if (isLogin) {
        const res = await fetch(API_ENDPOINTS.login, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: form.email, password: form.password }) })
        const data = await res.json()
        if (!res.ok) { setError(data.message || "Login failed"); setLoading(false); return }
        localStorage.setItem("accessToken", data.data.accessToken)
        restoreUserToLocal(data.data.user)
        navigate(data.data.user?.platform ? "/dashboard" : "/select-platform")
      } else {
        const res = await fetch(API_ENDPOINTS.register, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ fullName: form.name, username: form.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + Date.now().toString().slice(-4), email: form.email, password: form.password }) })
        const data = await res.json()
        if (!res.ok) { setError(data.message || "Registration failed"); setLoading(false); return }
        const loginRes = await fetch(API_ENDPOINTS.login, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: form.email, password: form.password }) })
        const loginData = await loginRes.json()
        if (loginRes.ok) { localStorage.setItem("accessToken", loginData.data.accessToken); restoreUserToLocal(loginData.data.user) }
        navigate("/select-platform")
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleToggle() { setIsLogin(!isLogin); setError("") }

  return (
    <div className="auth-page">
      <AuthAside isLogin={isLogin} />
      <AuthForm isLogin={isLogin} onToggle={handleToggle} onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  )
}
