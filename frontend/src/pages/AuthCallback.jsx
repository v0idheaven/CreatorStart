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
  }, [navigate, params])

  return (
    <div className="callback-page">
      <div className="spinner spinner-md" style={{ borderTopColor: "#818cf8" }} />
      <p className="callback-text">Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
