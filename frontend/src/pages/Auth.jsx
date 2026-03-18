import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/select-platform",
        scopes:
          "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
      },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!isLogin && !name.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() } },
      });
      if (error) {
        setError(error.message);
      } else {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name: name.trim(),
          platform: null,
        });
        if (insertError) {
          await supabase.from("profiles")
            .update({ name: name.trim() })
            .eq("id", data.user.id);
        }
        navigate("/select-platform");
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg)",
    border: "1px solid var(--border2)",
    borderRadius: "10px",
    padding: "11px 14px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>

      {/* Logo above card */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--text)" }}>
          Creator<span style={{ color: "var(--accent)" }}>Start</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "32px 28px",
        width: "100%",
        maxWidth: "400px",
      }}>

        {/* Heading */}
        <h1 style={{
          color: "var(--text)", fontSize: "20px",
          fontWeight: "600", margin: "0 0 4px"
        }}>
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p style={{
          color: "var(--muted)", fontSize: "13px",
          margin: "0 0 24px"
        }}>
          {isLogin ? "Sign in to CreatorStart" : "Start your creator journey"}
        </p>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!isLogin && (
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "12px", padding: "10px 14px",
            background: "#ff000012", border: "1px solid #ff000025",
            borderRadius: "8px", color: "#f87171", fontSize: "13px"
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", marginTop: "16px",
            background: "var(--accent)", border: "none",
            borderRadius: "10px", padding: "11px",
            color: "#fff", fontSize: "14px",
            fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s"
          }}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
        </button>

        {/* Switch */}
        <p style={{
          color: "var(--muted)", fontSize: "13px",
          textAlign: "center", marginTop: "16px", marginBottom: "0"
        }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setIsLogin(!isLogin); setError("") }}
            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: "500" }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "10px", margin: "20px 0"
        }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%", padding: "11px",
            background: "transparent",
            border: "1px solid var(--border2)",
            borderRadius: "10px", color: "var(--text)",
            fontSize: "14px", fontWeight: "500",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.8-11.3-7l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Footer */}
      <p style={{
        marginTop: "20px", fontSize: "12px",
        color: "var(--dim)", textAlign: "center"
      }}>
        By continuing you agree to our Terms & Privacy Policy
      </p>

    </div>
  )
}

export default Auth;