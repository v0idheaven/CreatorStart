import { useState, useEffect } from "react";
import supabase from "../supabase";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Youtube } from "lucide-react";

function DashboardYT() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [plannerData, setPlannerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);
      const { data: postsData } = await supabase.from("posts").select("*").eq("user_id", user.id).eq("platform", "youtube").order("day", { ascending: true });
      setPosts(postsData || []);
      const { data: planner } = await supabase.from("planner").select("*").eq("user_id", user.id).eq("platform", "youtube").order("day", { ascending: true });
      setPlannerData(planner || []);
    };
    fetchData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const planned = posts.filter(p => p.status === "planned").length;
  const done = posts.filter(p => p.status === "done").length;
  const draft = posts.filter(p => p.status === "draft").length;

  const graphData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    posts: posts.filter(p => p.day === i + 1).length,
  }));

  return (
    <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "0 0 40px 0", boxSizing: "border-box" }}>

      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <p style={{ color: "var(--dim)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>DASHBOARD</p>
          <h1 style={{ color: "var(--text)", fontSize: "32px", fontWeight: "700", letterSpacing: "-1px" }}>
            {greeting()}, <span style={{ color: "var(--accent)" }}>{profile?.name}</span>
          </h1>
          <p style={{ color: "var(--dim)", fontSize: "13px", marginTop: "4px" }}>Here's how your YouTube content is performing today.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--accent)", fontSize: "12px", fontWeight: "500", marginTop: "8px" }}>
          <Youtube size={13} /> YouTube
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Planned", value: planned },
          { label: "Done", value: done },
          { label: "Drafts", value: draft },
        ].map(stat => (
          <div key={stat.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
            <span style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "12px" }}>{stat.label}</span>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--text)", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "6px" }}>YouTube</div>
          </div>
        ))}
      </div>

      {/* Graph + Planner */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>Content Activity</div>
            <div style={{ fontSize: "11px", color: "var(--dim)", marginTop: "2px" }}>YouTube posts over first 7 days</div>
          </div>
          {graphData.some(d => d.posts > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={graphData}>
                <XAxis dataKey="day" tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--dim)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="posts" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)", fontSize: "13px" }}>
              No activity yet
            </div>
          )}
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>30-Day Planner</div>
          <div style={{ fontSize: "11px", color: "var(--dim)", marginBottom: "16px" }}>{plannerData.length} days planned</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px" }}>
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const hasContent = plannerData.some(p => p.day === day);
              return (
                <div key={day} style={{ width: "100%", aspectRatio: "1", borderRadius: "4px", background: hasContent ? "var(--accent)" : "var(--border)", opacity: hasContent ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: hasContent ? "#fff" : "var(--dim)" }}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "12px" }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[
            { icon: "✦", title: "Content Generator", desc: "Generate hooks, scripts, and CTAs for your next video." },
            { icon: "▦", title: "Content Planner", desc: "Organize your YouTube content pipeline for the month." },
            { icon: "◫", title: "Posts", desc: "View and manage all your video drafts." },
          ].map(action => (
            <div key={action.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{action.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>{action.title}</div>
              <div style={{ fontSize: "12px", color: "var(--dim)" }}>{action.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)" }}>Recent Videos</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>{posts.length} total</span>
        </div>
        {posts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--dim)", fontSize: "13px" }}>
            No videos yet — go to Content Generator to get started
          </div>
        ) : (
          posts.slice(0, 5).map(post => (
            <div key={post.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "11px", color: "var(--dim)", minWidth: "48px" }}>Day {post.day}</span>
              <span style={{ fontSize: "13px", color: "var(--muted)", flex: 1 }}>{post.title}</span>
              <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "4px", background: post.status === "done" ? "rgba(74,222,128,0.08)" : post.status === "planned" ? "rgba(129,140,248,0.08)" : "var(--border)", color: post.status === "done" ? "#4ade80" : post.status === "planned" ? "var(--accent)" : "var(--dim)" }}>
                {post.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardYT;