import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

function PlatformSelect() {
  const navigate = useNavigate();

  const selectPlatform = async (platform) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ platform }).eq("id", user.id);
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            color: "var(--text)",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Where do you create?
        </h1>
        <p style={{ color: "var(--dim)", fontSize: "14px" }}>
          Select all platforms you create content on
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <div
          onClick={() => selectPlatform("youtube")}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px 40px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>▶</div>
          <div
            style={{
              color: "var(--text)",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            YouTube
          </div>
          <div
            style={{ color: "var(--dim)", fontSize: "12px", marginTop: "4px" }}
          >
            Videos & shorts
          </div>
        </div>

        <div
          onClick={() => selectPlatform("instagram")}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px 40px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>◈</div>
          <div
            style={{
              color: "var(--text)",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Instagram
          </div>
          <div
            style={{ color: "var(--dim)", fontSize: "12px", marginTop: "4px" }}
          >
            Reels & posts
          </div>
        </div>

        <div
          onClick={() => selectPlatform("both")}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px 40px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⊕</div>
          <div
            style={{
              color: "var(--text)",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Both
          </div>
          <div
            style={{ color: "var(--dim)", fontSize: "12px", marginTop: "4px" }}
          >
            YouTube + Instagram
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformSelect;
