import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Calendar,
  FileText,
  Settings,
  BarChart2,
  LogOut,
} from "lucide-react";
import supabase from "../supabase";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: FileText, label: "Content", href: "/posts" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Zap, label: "Content Generator", href: "/generator" },
  { icon: Calendar, label: "30-Day Planner", href: "/planner" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();
      if (data?.name) {
        setUserName(data.name);
      } else {
        setUserName(
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email
        );
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
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
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 20px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            minWidth: "32px",
            background: "var(--accent)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "800",
            color: "#fff",
          }}
        >
          CS
        </div>
        {isOpen && (
          <span
            style={{
              color: "var(--text)",
              fontWeight: "600",
              fontSize: "15px",
              whiteSpace: "nowrap",
            }}
          >
            Creator
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              Start
            </em>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "0 8px",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.href)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "10px 12px",
                borderRadius: "10px",
                cursor: "pointer",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                whiteSpace: "nowrap",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <item.icon
                size={22}
                color={isActive ? "var(--text)" : "var(--dim)"}
                style={{ minWidth: "22px" }}
              />
              {isOpen && (
                <span
                  style={{
                    color: isActive ? "var(--text)" : "var(--muted)",
                    fontSize: "14px",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "0 8px 12px" }}>
        <div
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              minWidth: "28px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          {isOpen && (
            <>
              <span
                style={{
                  color: "var(--text)",
                  fontSize: "13px",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userName}
              </span>
              <LogOut size={16} color="var(--dim)" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;