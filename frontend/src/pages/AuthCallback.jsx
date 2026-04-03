import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const token = params.get("token")
    const userRaw = params.get("user")

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        localStorage.setItem("accessToken", token)
        localStorage.setItem("user", JSON.stringify(user))
        if (user.platform) localStorage.setItem("platform", user.platform)
        navigate(user.platform ? "/dashboard" : "/select-platform", { replace: true })
      } catch {
        navigate("/auth", { replace: true })
      }
    } else {
      navigate("/auth", { replace: true })
    }
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #818cf8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Signing you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
