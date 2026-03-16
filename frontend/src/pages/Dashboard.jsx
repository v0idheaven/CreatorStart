import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { usePlatform } from "../hooks/useplatform";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Youtube, Instagram } from "lucide-react";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [plannerData, setPlannerData] = useState([]);
  const { activePlat, setActivePlat } = usePlatform();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      let query = supabase.from("posts").select("*").eq("user_id", user.id);

      if (activePlat !== "overall") {
        query = query.eq("platform", activePlat);
      }

      const { data: postsData } = await query.order("day", { ascending: true });

      setPosts(postsData || []);

      const { data: planner } = await supabase
        .from("planner")
        .select("*")
        .eq("user_id", user.id)
        .order("day", { ascending: true });

      setPlannerData(planner || []);
    };

    fetchData();
  }, [activePlat]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const planned = posts.filter((p) => p.status === "planned").length;
  const done = posts.filter((p) => p.status === "done").length;
  const draft = posts.filter((p) => p.status === "draft").length;
  const total = posts.length;
  const isYT = activePlat === "youtube";

  const graphData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    posts: posts.filter((p) => p.day === i + 1).length,
  }));

  const quickActions = [
  {
    icon: "✦",
    title: "Content Generator",
    desc:
      activePlat === "youtube"
        ? "Generate hooks, scripts, and CTAs for your next video."
        : activePlat === "instagram"
        ? "Generate hooks, captions, and CTAs for your next reel."
        : "Generate hooks, scripts, captions, and CTAs for your next post.",
    href: "/generator",
  },
  {
    icon: "▦",
    title: "Content Planner",
    desc:
      activePlat === "youtube"
        ? "Organize your YouTube content pipeline for the month."
        : activePlat === "instagram"
        ? "Organize your Instagram content pipeline for the month."
        : "Organize your content pipeline for all platforms.",
    href: "/planner",
  },
  {
    icon: "◫",
    title: "Posts",
    desc:
      activePlat === "youtube"
        ? "View and manage all your video drafts."
        : activePlat === "instagram"
        ? "View and manage all your reel drafts."
        : "View and manage all your content drafts.",
    href: "/posts",
  },
]


  const dashboardTheme =
  activePlat === "instagram"
    ? { "--dash-accent": "#c13584" }
    : activePlat === "youtube"
    ? { "--dash-accent": "#ff4444" }
    : { "--dash-accent": "#818cf8" }

  return (
    <div
    style={{
      ...dashboardTheme,
      maxWidth:'1150px',
      margin:'0 auto',
      padding:'56px 32px'
    }}
  >

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <p
            style={{
              color: "var(--dim)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "4px",
            }}
          >
            DASHBOARD
          </p>
          <h1
            style={{
              color: "var(--text)",
              fontSize: "32px",
              fontWeight: "700",
              letterSpacing: "-1px",
            }}
          >
            {greeting()},{" "}
            <span style={{ color: "var(--dash-accent)" }}>{profile?.name}</span>
          </h1>
          <p
            style={{ color: "var(--dim)", fontSize: "13px", marginTop: "4px" }}
          >
            Here's how your{" "}
            {activePlat === "overall"
              ? "content"
              : isYT
                ? "YouTube"
                : "Instagram"}{" "}
            content is performing today.
          </p>
        </div>


        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {profile?.platform === "both" ? (
            <>
              <button
                onClick={() => setActivePlat("overall")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background:
                    activePlat === "overall"
                      ? "rgba(129,140,248,0.1)"
                      : "transparent",
                  color:
                    activePlat === "overall" ? "var(--dash-accent)" : "var(--dim)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Overall
              </button>

              <button
                onClick={() => setActivePlat("youtube")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background:
                    activePlat === "youtube"
                      ? "rgba(255,0,0,0.1)"
                      : "transparent",
                  color: activePlat === "youtube" ? "#ff4444" : "var(--dim)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                <Youtube size={14} /> YouTube
              </button>

              <button
                onClick={() => setActivePlat("instagram")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background:
                    activePlat === "instagram"
                      ? "rgba(193,53,132,0.1)"
                      : "transparent",
                  color: activePlat === "instagram" ? "#c13584" : "var(--dim)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                <Instagram size={14} /> Instagram
              </button>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "12px",
                color: isYT ? "#ff4444" : "#c13584",
              }}
            >
              {isYT ? <Youtube size={14} /> : <Instagram size={14} />}
              {isYT ? "YouTube" : "Instagram"}
            </div>
          )}
        </div>
      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          { label: "Total Posts", value: total },
          { label: "Planned", value: planned },
          { label: "Done", value: done },
          { label: "Drafts", value: draft },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--dim)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "12px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "var(--text)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{ fontSize: "12px", color: "#4ade80", marginTop: "6px" }}
            >
              ↑ {stat.value} this month
            </div>
          </div>
        ))}
      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text)",
              }}
            >
              Content Activity
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--dim)",
                marginTop: "2px",
              }}
            >
              {activePlat === "overall"
                ? "Content"
                : isYT
                  ? "YouTube"
                  : "Instagram"}{" "}
              posts over first 7 days
            </div>
          </div>
          {graphData.some((d) => d.posts > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={graphData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "var(--dim)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--dim)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="var(--dash-accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--dim)",
                fontSize: "13px",
              }}
            >
              No activity yet — add posts to see graph
            </div>
          )}
        </div>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--text)",
              marginBottom: "4px",
            }}
          >
            30-Day Planner
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--dim)",
              marginBottom: "16px",
            }}
          >
            {plannerData.length} days planned
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "4px",
            }}
          >
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const hasContent = plannerData.some((p) => p.day === day);
              return (
                <div
                  key={day}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "4px",
                    background: hasContent ? "var(--dash-accent)" : "var(--border)",
                    opacity: hasContent ? 1 : 0.4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    color: hasContent ? "#fff" : "var(--dim)",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>


      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--text)",
            marginBottom: "12px",
          }}
        >
          Quick Actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {quickActions.map((action) => (
            <div
              key={action.title}
              onClick={() => navigate(action.href)}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--dash-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                {action.icon}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text)",
                  marginBottom: "4px",
                }}
              >
                {action.title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--dim)" }}>
                {action.desc}
              </div>
            </div>
          ))}
        </div>
      </div>


      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--text)",
            }}
          >
            Recent Posts
          </span>
          <span
            onClick={() => navigate("/posts")}
            style={{
              fontSize: "12px",
              color: "var(--dash-accent)",
              cursor: "pointer",
            }}
          >
            View all →
          </span>
        </div>
        {posts.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--dim)",
              fontSize: "13px",
            }}
          >
            No posts yet — go to Content Generator to get started
          </div>
        ) : (
          posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--dim)",
                  minWidth: "48px",
                }}
              >
                Day {post.day}
              </span>
              <span
                style={{ fontSize: "13px", color: "var(--muted)", flex: 1 }}
              >
                {post.title}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "3px 10px",
                  borderRadius: "4px",
                  background:
                    post.status === "done"
                      ? "rgba(74,222,128,0.08)"
                      : post.status === "planned"
                        ? "rgba(129,140,248,0.08)"
                        : "var(--border)",
                  color:
                    post.status === "done"
                      ? "#4ade80"
                      : post.status === "planned"
                        ? "var(--dash-accent)"
                        : "var(--dim)",
                }}
              >
                {post.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
