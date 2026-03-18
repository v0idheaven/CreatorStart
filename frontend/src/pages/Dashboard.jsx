import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { usePlatform } from "../context/PlatformContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Youtube, Instagram, Zap, CalendarDays, FileText, TrendingUp, Clock, CheckCheck, AlignLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [plannerData, setPlannerData] = useState([]);
  const [hoveredPlat, setHoveredPlat] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);
  const { activePlat, setActivePlat } = usePlatform();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles").select("name, platform").eq("id", user.id).single();

      if (profileData) {
        if (!profileData.name || profileData.name === "User" || profileData.name === "") {
          profileData.name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
        }
        setProfile(profileData);
        if (!activePlat && profileData?.platform === "both") setActivePlat("overall");
        else if (!activePlat && profileData?.platform) setActivePlat(profileData.platform);
      }

      let query = supabase.from("posts").select("*").eq("user_id", user.id);
      if (activePlat && activePlat !== "overall") query = query.eq("platform", activePlat);
      const { data: postsData } = await query.order("day", { ascending: true });
      setPosts(postsData || []);

      const { data: planner } = await supabase
        .from("planner").select("*").eq("user_id", user.id).order("day", { ascending: true });
      setPlannerData(planner || []);
    };
    fetchData();
  }, [activePlat]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const isYT = activePlat === "youtube";
  const isIG = activePlat === "instagram";
  const accent = "var(--accent)";

  const planned = posts.filter(p => p.status === "planned").length;
  const done    = posts.filter(p => p.status === "done").length;
  const draft   = posts.filter(p => p.status === "draft").length;
  const total   = posts.length;

  const graphData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    posts: posts.filter(p => p.day === i + 1).length,
  }));

  const statCards = [
    { label: "Total Posts", value: total,   icon: AlignLeft,  color: "var(--accent)" },
    { label: "Planned",     value: planned,  icon: Clock,      color: "#60a5fa" },
    { label: "Completed",   value: done,     icon: CheckCheck, color: "#4ade80" },
    { label: "Drafts",      value: draft,    icon: FileText,   color: "#f472b6" },
  ];

  const quickActions = [
    {
      icon: Zap, title: "Content Generator",
      desc: isYT ? "Generate hooks, scripts & CTAs for your next video."
          : isIG ? "Generate hooks, captions & CTAs for your next reel."
          : "Generate hooks, scripts & captions for all platforms.",
      href: "/generator",
    },
    {
      icon: CalendarDays, title: "30-Day Planner",
      desc: isYT ? "Organize your YouTube content pipeline for the month."
          : isIG ? "Organize your Instagram content pipeline for the month."
          : "Organize your full content pipeline for the month.",
      href: "/planner",
    },
    {
      icon: FileText, title: "Posts",
      desc: isYT ? "View and manage all your video drafts and ideas."
          : isIG ? "View and manage all your reel drafts and ideas."
          : "View and manage all your content drafts.",
      href: "/posts",
    },
  ];

  const switcherButtons = [
    { id: "overall",   label: "Overall",   Icon: null,      iconColor: "var(--text)" },
    { id: "youtube",   label: "YouTube",   Icon: Youtube,   iconColor: "#ff4444" },
    { id: "instagram", label: "Instagram", Icon: Instagram, iconColor: "#c13584" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />

      <main style={{ marginLeft: "72px", flex: 1, padding: "40px", maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>
              Dashboard
            </p>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
              {greeting()},{" "}
              <span style={{ color: accent }}>{profile?.name?.split(" ")[0]}</span> 👋
            </h1>
            <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>
              Here's how your {activePlat === "overall" ? "content" : isYT ? "YouTube" : "Instagram"} is performing today.
            </p>
          </div>

          {/* Platform switcher — React state hover fix */}
          {profile?.platform === "both" && (
            <div style={{
              display: "flex", gap: "4px", padding: "4px",
              background: "var(--card)", borderRadius: "10px",
              border: "1px solid var(--border)",
            }}>
              {switcherButtons.map(({ id, label, Icon, iconColor }) => {
                const isActive  = activePlat === id;
                const isHovered = hoveredPlat === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActivePlat(id)}
                    onMouseEnter={() => setHoveredPlat(id)}
                    onMouseLeave={() => setHoveredPlat(null)}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "6px 12px", borderRadius: "7px", border: "none",
                      background: isActive
                        ? "var(--border2)"
                        : isHovered
                        ? "var(--border)"
                        : "transparent",
                      color: isActive
                        ? "var(--accent)"
                        : isHovered
                        ? "var(--text)"
                        : "var(--dim)",
                      cursor: "pointer", fontSize: "12px", fontWeight: "500",
                      transition: "all 0.15s",
                    }}
                  >
                    {Icon && (
                      <Icon size={12} color={isActive ? iconColor : isHovered ? iconColor : "var(--dim)"} />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "20px 20px 16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>{label}</span>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: color + "15",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} color={color} strokeWidth={2} />
                </div>
              </div>
              <p style={{ fontSize: "30px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", lineHeight: 1 }}>
                {value}
              </p>
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
                <p style={{ fontSize: "11px", color: "var(--dim)", margin: 0 }}>Posts over first 7 days</p>
              </div>
              <span style={{ fontSize: "11px", color: "var(--dim)", padding: "4px 10px", borderRadius: "6px", background: "var(--bg)", border: "1px solid var(--border)" }}>
                This week
              </span>
            </div>
            {graphData.some(d => d.posts > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={graphData}>
                  <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--sb)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="posts" stroke="var(--accent)" strokeWidth={2} dot={{ fill: "var(--accent)", strokeWidth: 0, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <p style={{ color: "var(--dim)", fontSize: "13px", margin: 0 }}>No activity yet</p>
                <span onClick={() => navigate("/posts")} style={{ fontSize: "12px", color: accent, cursor: "pointer" }}>
                  Add posts to see graph →
                </span>
              </div>
            )}
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 3px" }}>30-Day Planner</p>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: "0 0 16px" }}>{plannerData.length} / 30 days planned</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "5px" }}>
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const has = plannerData.some(p => p.day === day);
                return (
                  <div key={day} onClick={() => navigate("/planner")} style={{
                    aspectRatio: "1", borderRadius: "5px",
                    background: has ? "var(--accent)" : "var(--border)",
                    opacity: has ? 1 : 0.35,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "8px", fontWeight: "600",
                    color: has ? "#fff" : "var(--dim)",
                    cursor: "pointer",
                  }}>
                    {day}
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate("/planner")} style={{
              width: "100%", marginTop: "14px", padding: "8px",
              borderRadius: "8px", border: "1px solid var(--border)",
              background: "var(--bg)", color: "var(--muted)",
              fontSize: "12px", cursor: "pointer", fontWeight: "500",
            }}>
              Open Planner →
            </button>
          </div>
        </div>

        {/* Quick Actions — React state hover fix */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)", margin: "0 0 12px" }}>Quick Actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {quickActions.map(({ icon: Icon, title, desc, href }) => (
              <div
                key={title}
                onClick={() => navigate(href)}
                onMouseEnter={() => setHoveredAction(title)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  background: "var(--card)",
                  border: `1px solid ${hoveredAction === title ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "12px", padding: "20px", cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "9px",
                  background: "rgba(129,140,248,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "12px",
                }}>
                  <Icon size={16} color="var(--accent)" strokeWidth={2} />
                </div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 5px" }}>{title}</p>
                <p style={{ fontSize: "12px", color: "var(--dim)", margin: 0, lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts — React state hover fix */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>Recent Posts</span>
            <span onClick={() => navigate("/posts")} style={{ fontSize: "12px", color: accent, cursor: "pointer" }}>
              View all →
            </span>
          </div>
          {posts.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--dim)", fontSize: "13px", margin: "0 0 14px" }}>
                No posts yet — start with Content Generator!
              </p>
              <button onClick={() => navigate("/generator")} style={{
                padding: "8px 20px", borderRadius: "8px",
                background: "var(--accent)", border: "none",
                color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}>
                Generate Content
              </button>
            </div>
          ) : (
            posts.slice(0, 5).map(post => (
              <div
                key={post.id}
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "13px 20px", borderBottom: "1px solid var(--border)",
                  background: hoveredPost === post.id ? "var(--bg)" : "transparent",
                  transition: "background 0.12s",
                }}
              >
                <FileText size={13} color="var(--dim)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "var(--text)", flex: 1 }}>{post.title}</span>
                <span style={{ fontSize: "11px", color: "var(--dim)" }}>Day {post.day}</span>
                <span style={{
                  fontSize: "10px", padding: "3px 10px", borderRadius: "5px", fontWeight: "600",
                  background: post.status === "done" ? "#4ade8015" : post.status === "planned" ? "rgba(129,140,248,0.1)" : "var(--border)",
                  color: post.status === "done" ? "#4ade80" : post.status === "planned" ? "var(--accent)" : "var(--dim)",
                }}>
                  {post.status}
                </span>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}

export default Dashboard;