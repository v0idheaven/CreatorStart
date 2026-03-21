import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Youtube, Instagram, Zap, CalendarDays, FileText, TrendingUp, Clock, CheckCheck, AlignLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";

const graphData = [
  { day: "Mon", posts: 2 }, { day: "Tue", posts: 1 }, { day: "Wed", posts: 4 },
  { day: "Thu", posts: 3 }, { day: "Fri", posts: 2 }, { day: "Sat", posts: 5 }, { day: "Sun", posts: 3 },
];
const plannerFilled = [1, 3, 5, 7, 9, 12, 15, 18, 20, 22, 25, 28];
const recentPosts = [
  { id: 1, title: "How to grow on YouTube in 2025", day: 1, status: "done" },
  { id: 2, title: "Morning routine vlog ideas", day: 3, status: "planned" },
  { id: 3, title: "Top 10 finance tips for beginners", day: 5, status: "draft" },
  { id: 4, title: "AI tools for content creators", day: 7, status: "planned" },
  { id: 5, title: "Behind the scenes reel", day: 9, status: "done" },
];
const statCards = [
  { label: "Total Posts", value: 24, icon: AlignLeft,  color: "#818cf8" },
  { label: "Planned",     value: 8,  icon: Clock,      color: "#60a5fa" },
  { label: "Completed",   value: 12, icon: CheckCheck, color: "#4ade80" },
  { label: "Drafts",      value: 4,  icon: FileText,   color: "#f472b6" },
];
const quickActions = [
  { icon: Zap,         title: "Content Generator", desc: "Generate hooks, scripts & CTAs for your next video.", href: "/generator" },
  { icon: CalendarDays, title: "30-Day Planner",   desc: "Organize your content pipeline for the month.",      href: "/planner" },
  { icon: FileText,    title: "Posts",             desc: "View and manage all your content drafts.",            href: "/posts" },
];
const switcherButtons = [
  { id: "overall",   label: "Overall",   Icon: null,      iconColor: "#818cf8" },
  { id: "youtube",   label: "YouTube",   Icon: Youtube,   iconColor: "#ff4444" },
  { id: "instagram", label: "Instagram", Icon: Instagram, iconColor: "#c13584" },
];

export default function Dashboard() {
  const [activePlat, setActivePlat] = useState("overall");
  const [hoveredPlat, setHoveredPlat] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);
  const navigate = useNavigate();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ marginLeft: "72px", flex: 1, padding: "40px", maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>Dashboard</p>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
              {greeting()}, <span style={{ color: "#818cf8" }}>Varun</span> 👋
            </h1>
            <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>Here's how your content is performing today.</p>
          </div>

          <div style={{ display: "flex", gap: "4px", padding: "4px", background: "var(--card)", borderRadius: "10px", border: "1px solid var(--border)" }}>
            {switcherButtons.map(({ id, label, Icon, iconColor }) => {
              const isActive = activePlat === id;
              const isHovered = hoveredPlat === id;
              return (
                <button key={id} onClick={() => setActivePlat(id)}
                  onMouseEnter={() => setHoveredPlat(id)} onMouseLeave={() => setHoveredPlat(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "6px 12px", borderRadius: "7px", border: "none",
                    background: isActive ? "var(--border2)" : isHovered ? "var(--border)" : "transparent",
                    color: isActive ? iconColor : isHovered ? "var(--text)" : "var(--dim)",
                    cursor: "pointer", fontSize: "12px", fontWeight: "500", transition: "all 0.15s",
                  }}>
                  {Icon && <Icon size={12} color={isActive ? iconColor : isHovered ? iconColor : "var(--dim)"} />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 20px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>{label}</span>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={color} strokeWidth={2} />
                </div>
              </div>
              <p style={{ fontSize: "30px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", lineHeight: 1 }}>{value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={11} color="#4ade80" />
                <span style={{ fontSize: "11px", color: "#4ade80" }}>this month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Graph + Planner */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>Content Activity</p>
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Posts over this week</p>
              </div>
              <span style={{ fontSize: "11px", color: "var(--dim)", padding: "4px 10px", borderRadius: "6px", background: "var(--bg)", border: "1px solid var(--border)" }}>This week</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={graphData}>
                <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="posts" stroke="#818cf8" strokeWidth={2} dot={{ fill: "#818cf8", strokeWidth: 0, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>30-Day Planner</p>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: "0 0 16px" }}>{plannerFilled.length} / 30 days planned</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "5px" }}>
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const has = plannerFilled.includes(day);
                return (
                  <div key={day} onClick={() => navigate("/planner")} style={{
                    aspectRatio: "1", borderRadius: "5px",
                    background: has ? "#818cf8" : "var(--border)",
                    opacity: has ? 1 : 0.35,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "8px", fontWeight: "600", color: has ? "#fff" : "var(--dim)", cursor: "pointer",
                  }}>{day}</div>
                );
              })}
            </div>
            <button onClick={() => navigate("/planner")} style={{ width: "100%", marginTop: "14px", padding: "8px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--muted)", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}>
              Open Planner →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 12px" }}>Quick Actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {quickActions.map(({ icon: Icon, title, desc, href }) => (
              <div key={title} onClick={() => navigate(href)}
                onMouseEnter={() => setHoveredAction(title)} onMouseLeave={() => setHoveredAction(null)}
                style={{
                  background: "var(--card)", border: `1px solid ${hoveredAction === title ? "#818cf8" : "var(--border)"}`,
                  borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "border-color 0.15s",
                }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#818cf815", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Icon size={16} color="#818cf8" strokeWidth={2} />
                </div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 5px" }}>{title}</p>
                <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0, lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>Recent Posts</span>
            <span onClick={() => navigate("/posts")} style={{ fontSize: "12px", color: "#818cf8", cursor: "pointer" }}>View all →</span>
          </div>
          {recentPosts.map(post => (
            <div key={post.id}
              onMouseEnter={() => setHoveredPost(post.id)} onMouseLeave={() => setHoveredPost(null)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "13px 20px", borderBottom: "1px solid var(--border)",
                background: hoveredPost === post.id ? "var(--bg)" : "transparent", transition: "background 0.12s",
              }}>
              <FileText size={13} color="var(--dim)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{post.title}</span>
              <span style={{ fontSize: "11px", color: "var(--dim)" }}>Day {post.day}</span>
              <span style={{
                fontSize: "10px", padding: "3px 10px", borderRadius: "5px", fontWeight: "600",
                background: post.status === "done" ? "#4ade8015" : post.status === "planned" ? "#818cf815" : "var(--border)",
                color: post.status === "done" ? "#4ade80" : post.status === "planned" ? "#818cf8" : "var(--dim)",
              }}>{post.status}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}