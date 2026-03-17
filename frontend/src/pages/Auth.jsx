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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() } },
      });
      if (error) {
        setError(error.message);
      } else {
        // profile insert karo — naam trim karke
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name: name.trim(),
          platform: null,
        });

        // agar insert fail hua (409 duplicate) toh update karo
        if (insertError) {
          await supabase
            .from("profiles")
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
    background: "#18181b",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "var(--text)",
    fontSize: "13px",
    marginBottom: "10px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "32px",
          width: "360px",
        }}
      >
        <h1
          style={{
            color: "var(--text)",
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p
          style={{
            color: "var(--dim)",
            fontSize: "13px",
            marginBottom: "24px",
          }}
        >
          {isLogin ? "Sign in to CreatorStart" : "Start your creator journey"}
        </p>

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, marginBottom: "16px" }}
        />

        {error && (
          <p
            style={{
              color: "#f87171",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            background: "var(--accent)",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p
          style={{
            color: "var(--dim)",
            fontSize: "12px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "var(--accent)", cursor: "pointer" }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ color: "var(--dim)", fontSize: "12px" }}>or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "10px",
            color: "var(--text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img
            src="https://www.google.com/favicon.ico"
            width="16"
            height="16"
            alt="Google"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Auth;