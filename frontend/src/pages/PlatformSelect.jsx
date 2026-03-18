import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Youtube, Instagram, LayoutGrid, ArrowRight } from "lucide-react";
import supabase from "../supabase";
import { usePlatform } from "../context/PlatformContext";

const PlatformSelect = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { reloadPlatform } = usePlatform();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ platform: selected }).eq("id", user.id);
    await reloadPlatform();
    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: "24px" }}>
        <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--text)" }}>
          Creator<span style={{ color: "var(--accent)" }}>Start</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "32px 28px",
      }}>

        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text)", margin: "0 0 4px" }}>
          Where do you create?
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 24px" }}>
          Choose your platform. You can change this later.
        </p>

        {/* Top row — YouTube + Instagram */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

          {/* YouTube */}
          <div
            onClick={() => setSelected("youtube")}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "20px 12px",
              borderRadius: "12px",
              border: `2px solid ${selected === "youtube" ? "#ff4444" : "var(--border2)"}`,
              background: selected === "youtube" ? "#ff000012" : "var(--bg)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Youtube
              size={22}
              color={selected === "youtube" ? "#ff0000" : "var(--muted)"}
              strokeWidth={1.8}
            />
            <span style={{
              fontSize: "13px", fontWeight: "600",
              color: selected === "youtube" ? "var(--text)" : "var(--muted)",
            }}>
              YouTube
            </span>
            <span style={{
              fontSize: "11px", color: "var(--dim)",
              textAlign: "center", lineHeight: "1.4"
            }}>
              Plan & grow your channel
            </span>
          </div>

          {/* Instagram */}
          <div
            onClick={() => setSelected("instagram")}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "20px 12px",
              borderRadius: "12px",
              border: `2px solid ${selected === "instagram" ? "#e1306c" : "var(--border2)"}`,
              background: selected === "instagram" ? "#c1358412" : "var(--bg)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Instagram
              size={22}
              color={selected === "instagram" ? "#c13584" : "var(--muted)"}
              strokeWidth={1.8}
            />
            <span style={{
              fontSize: "13px", fontWeight: "600",
              color: selected === "instagram" ? "var(--text)" : "var(--muted)",
            }}>
              Instagram
            </span>
            <span style={{
              fontSize: "11px", color: "var(--dim)",
              textAlign: "center", lineHeight: "1.4"
            }}>
              Reels, posts & growth
            </span>
          </div>
        </div>

        {/* Both — full width */}
        <div
          onClick={() => setSelected("both")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px 18px",
            borderRadius: "12px",
            border: `2px solid ${selected === "both" ? "#818cf8" : "var(--border2)"}`,
            background: selected === "both" ? "#818cf812" : "var(--bg)",
            cursor: "pointer",
            transition: "all 0.15s",
            marginBottom: "20px",
          }}
        >
          <LayoutGrid
            size={20}
            color={selected === "both" ? "var(--accent)" : "var(--muted)"}
            strokeWidth={1.8}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{
              fontSize: "13px", fontWeight: "600",
              color: selected === "both" ? "var(--text)" : "var(--muted)",
            }}>
              Both platforms
            </span>
            <span style={{ fontSize: "11px", color: "var(--dim)" }}>
              One dashboard for everything
            </span>
          </div>
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "10px",
            border: "none",
            background: selected ? "var(--accent)" : "var(--border)",
            color: selected ? "#fff" : "var(--dim)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: selected ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s",
          }}
        >
          {loading ? "Saving..." : "Continue"}
          {selected && !loading && <ArrowRight size={14} />}
        </button>

      </div>

      <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--dim)" }}>
        You can change your platform anytime in settings.
      </p>

    </div>
  );
};

export default PlatformSelect;