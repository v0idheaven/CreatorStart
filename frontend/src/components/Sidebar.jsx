import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Calendar,
  FileText,
  Settings,
  BarChart2,
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
                background: isActive
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
                whiteSpace: "nowrap",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "transparent";
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

      {/* Logout */}
      <div style={{ padding: "0 8px 8px" }}>
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
              fontSize: "10px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            VY
          </div>

          {isOpen && (
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;