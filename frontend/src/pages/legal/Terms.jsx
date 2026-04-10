import { useNavigate } from "react-router-dom"

export default function Terms() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>

        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", marginBottom: "40px", fontSize: "13px" }}>
          ← Back
        </button>

        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>Terms of Service</h1>
        <p style={{ color: "#666", marginBottom: "40px", fontSize: "14px" }}>Last updated: April 2026</p>

        {[
          {
            title: "1. Acceptance of Terms",
            content: "By using CreatorStart, you agree to these Terms of Service. If you do not agree, please do not use the service."
          },
          {
            title: "2. Description of Service",
            content: "CreatorStart is an AI-powered content planning platform for YouTube and Instagram creators. We provide tools including a 30-day content planner, AI content generator, and analytics dashboard."
          },
          {
            title: "3. User Accounts",
            content: "You are responsible for maintaining the security of your account. You must provide accurate information when creating an account. You may not use another person's account without permission."
          },
          {
            title: "4. YouTube API Usage",
            content: "CreatorStart integrates with YouTube API Services. Your use of YouTube features within CreatorStart is subject to the YouTube Terms of Service. We access your YouTube data in read-only mode solely to display information within the app."
          },
          {
            title: "5. Acceptable Use",
            content: "You agree not to misuse the service, attempt to gain unauthorized access, or use the service for any illegal purpose. We reserve the right to suspend accounts that violate these terms."
          },
          {
            title: "6. Intellectual Property",
            content: "The CreatorStart platform, including its design and code, is owned by CreatorStart. Content you create using our tools remains yours."
          },
          {
            title: "7. Disclaimer",
            content: "CreatorStart is provided 'as is' without warranties of any kind. We are not responsible for any loss of data or damages arising from use of the service."
          },
          {
            title: "8. Changes to Terms",
            content: "We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms."
          },
          {
            title: "9. Contact",
            content: "For questions about these terms, contact us at: dahiyavarun2007@gmail.com"
          }
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: "#fff" }}>{title}</h2>
            <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#aaa" }}>{content}</p>
          </div>
        ))}

        <div style={{ borderTop: "1px solid #222", paddingTop: "24px", marginTop: "40px" }}>
          <p style={{ fontSize: "13px", color: "#555" }}>© 2026 CreatorStart · <span style={{ cursor: "pointer", color: "#2d8fa3" }} onClick={() => navigate("/privacy")}>Privacy Policy</span></p>
        </div>
      </div>
    </div>
  )
}
