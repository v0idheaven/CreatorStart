import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Zap, Calendar, FileText, Settings, BarChart2, LogOut } from "lucide-react";
import supabase from "../supabase";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FileText, label: "Content", href: "/posts" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Zap, label: "Content Generator", href: "/generator" },
  { icon: Calendar, label: "30-Day Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("name").eq("id", user.id).single();
      if (data?.name && data.name !== "User" && data.name !== "") {
        setUserName(data.name);
      } else {
        setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.email);
      }
      setUserEmail(user.email || "");
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const initials = userName
    ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "..";

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        width: isOpen ? "240px" : "72px",
        transition: "width 0.22s ease",
        background: "var(--sb)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "8px 0",
        overflow: "hidden",
        position: "fixed",
        left: 0, top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{
        height: "56px", minHeight: "56px",
        padding: "0 20px",
        display: "flex", alignItems: "center", gap: "12px",
        flexShrink: 0,
      }}>
        <div style={{
          width: "32px", height: "32px", minWidth: "32px",
          background: "#818cf8",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: "800", color: "#fff",
          flexShrink: 0,
        }}>
          CS
        </div>
        <span style={{
          color: "var(--text)", fontWeight: "600",
          fontSize: "15px", whiteSpace: "nowrap",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.15s",
        }}>
          Creator<span style={{ color: "#818cf8" }}>Start</span>
        </span>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "2px", padding: "4px 8px",
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.href)}
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "10px 12px", borderRadius: "10px",
                cursor: "pointer",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                whiteSpace: "nowrap", transition: "background 0.1s",
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
            >
              <item.icon
                size={20}
                color={isActive ? "#818cf8" : "var(--dim)"}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{ minWidth: "20px" }}
              />
              <span style={{
                color: isActive ? "var(--text)" : "var(--muted)",
                fontSize: "14px", fontWeight: isActive ? "600" : "400",
                opacity: isOpen ? 1 : 0, transition: "opacity 0.15s",
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0 8px 12px", flexShrink: 0 }}>
        <div style={{ height: "1px", background: "var(--border)", margin: "8px 4px 10px" }} />
        <div
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "10px",
            cursor: "pointer", height: "48px", minHeight: "48px",
            transition: "background 0.1s", boxSizing: "border-box",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: "28px", height: "28px", minWidth: "28px",
            borderRadius: "50%", background: "#818cf8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: "700", color: "#fff", flexShrink: 0,
          }}>
            {initials}
          </div>
          {isOpen && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "var(--text)", fontSize: "13px", fontWeight: "600", margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {userName}
                </p>
                <p style={{ color: "var(--muted)", fontSize: "11px", margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {userEmail}
                </p>
              </div>
              <LogOut size={16} color="var(--dim)" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;