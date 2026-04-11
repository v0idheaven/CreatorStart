import { useNavigate } from "react-router-dom"

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>

        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", marginBottom: "40px", fontSize: "13px" }}>
          ← Back
        </button>

        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ color: "#666", marginBottom: "40px", fontSize: "14px" }}>Last updated: April 2026</p>

        {[
          {
            title: "1. Information We Collect",
            content: "We collect information you provide when creating an account: name, email address, and profile details. If you connect your YouTube account via Google OAuth, we access your channel statistics, video data, and analytics through the YouTube Data API and YouTube Analytics API."
          },
          {
            title: "2. How We Use Your Information",
            content: "We use your information to provide and improve CreatorStart services, including your content planner, analytics dashboard, and AI content generator. We do not sell your personal data to third parties."
          },
          {
            title: "3. YouTube API Services",
            content: "CreatorStart uses YouTube API Services. By connecting your YouTube account, you agree to be bound by the YouTube Terms of Service (https://www.youtube.com/t/terms). We access your YouTube data solely to display analytics and channel information within the app. You can revoke access at any time via your Google Account permissions page (https://myaccount.google.com/permissions)."
          },
          {
            title: "4. Google OAuth",
            content: "We use Google OAuth 2.0 for authentication. We only request the minimum permissions needed: your basic profile info and YouTube read-only access. We do not post, modify, or delete any content on your behalf."
          },
          {
            title: "5. Data Storage",
            content: "Your data is stored securely in MongoDB Atlas. Passwords are hashed and never stored in plain text. Access tokens are stored securely and used only to fetch your YouTube data."
          },
          {
            title: "6. Data Retention",
            content: "You can delete your account at any time from Settings. Upon deletion, all your personal data, plans, and content are permanently removed from our servers."
          },
          {
            title: "7. Cookies",
            content: "We use HTTP-only cookies for authentication (refresh tokens). We do not use tracking or advertising cookies."
          },
          {
            title: "8. Third-Party Services",
            content: "We use the following third-party services: Google APIs (YouTube Data, YouTube Analytics, OAuth), Cloudinary (avatar storage), MongoDB Atlas (database), Groq AI (content generation). Each service has its own privacy policy."
          },
          {
            title: "9. Contact",
            content: "For any privacy-related questions, contact us at: dahiyavarun2007@gmail.com"
          }
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: "#fff" }}>{title}</h2>
            <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#aaa" }}>{content}</p>
          </div>
        ))}

        <div style={{ borderTop: "1px solid #222", paddingTop: "24px", marginTop: "40px" }}>
          <p style={{ fontSize: "13px", color: "#555" }}>© 2026 CreatorStart · <span style={{ cursor: "pointer", color: "#818cf8" }} onClick={() => navigate("/terms")}>Terms of Service</span></p>
        </div>
      </div>
    </div>
  )
}
