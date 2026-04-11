import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), 15000)
    const token = params.get("token")
    const userRaw = params.get("user")

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        localStorage.setItem("accessToken", token)
        localStorage.setItem("user", JSON.stringify(user))
        if (user.platform) localStorage.setItem("platform", user.platform)
        clearTimeout(timeout)
        navigate(user.platform ? "/dashboard" : "/select-platform", { replace: true })
      } catch {
        clearTimeout(timeout)
        navigate("/auth", { replace: true })
      }
    } else {
      clearTimeout(timeout)
      navigate("/auth", { replace: true })
    }
    return () => clearTimeout(timeout)
  }, [navigate, params])

  if (timedOut) {
    return (
      <div className="callback-page">
        <p style={{ color: "#f87171", fontSize: "14px" }}>Sign in timed out. Please try again.</p>
        <button onClick={() => navigate("/auth")} style={{ marginTop: "12px", padding: "8px 20px", borderRadius: "8px", border: "none", background: "#818cf8", color: "#fff", cursor: "pointer", fontSize: "13px" }}>Back to Login</button>
      </div>
    )
  }

  return (
    <div className="callback-page">
      <div className="spinner spinner-md" style={{ borderTopColor: "#818cf8" }} />
      <p className="callback-text">Signing you in...</p>
    </div>
  )
}
