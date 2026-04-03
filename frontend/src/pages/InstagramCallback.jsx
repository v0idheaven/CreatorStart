import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { apiFetch } from "../utils/api"
import { API_ENDPOINTS } from "../constants/api"

export default function InstagramCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [status, setStatus] = useState("Connecting Instagram...")

  useEffect(() => {
    async function link() {
      const dataRaw = params.get("data")
      if (!dataRaw) { navigate("/analytics"); return }

      try {
        const { longToken, igStats } = JSON.parse(decodeURIComponent(dataRaw))
        setStatus("Linking your Instagram account...")

        const res = await apiFetch(API_ENDPOINTS.instagramLink, {
          method: "POST",
          body: JSON.stringify({ longToken, igStats })
        })
        const data = await res.json()

        if (res.ok && data?.data?.user) {
          const user = JSON.parse(localStorage.getItem("user") || "{}")
          localStorage.setItem("user", JSON.stringify({ ...user, ...data.data.user }))
          window.dispatchEvent(new Event("userUpdated"))
        }
      } catch (e) {
        console.error("Instagram link error:", e)
      }
      navigate("/analytics")
    }
    link()
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #c13584", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>{status}</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
