import { useState } from "react";
import { Sparkles, Copy, Check, ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { usePlatform } from "../context/PlatformContext";

const formats = ["Short Video", "Long Video", "Reel", "Carousel", "Blog Post", "Other"];
const niches  = ["Tech", "Finance", "Fitness", "Food", "Travel", "Gaming", "Education", "Lifestyle", "Business", "Entertainment", "Other"];
const goals   = ["Grow Audience", "Increase Engagement", "Drive Sales", "Build Authority", "Entertain", "Other"];
const tones   = ["Casual", "Professional", "Humorous", "Inspirational", "Educational", "Other"];

const SIDEBAR_W  = 72;
const PAGE_PAD   = 48;
const LEFT_W     = 300;
const GAP        = 32;
const HEADER_H   = 116;
const FIXED_LEFT = SIDEBAR_W + PAGE_PAD;

// ─── Select with "Other" support ─────────────────────────────────────────────
const Select = ({ label, options, value, customValue, onCustomChange, onChange }) => {
  const [open, setOpen] = useState(false);
  const isOther = value === "Other";

  const close = () => setOpen(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative" }}>
        <label style={{
          fontSize: "12px", fontWeight: "500", color: "var(--muted)",
          display: "block", marginBottom: "6px",
        }}>
          {label}
        </label>

        <div
          onClick={() => setOpen(p => !p)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: "9px",
            border: `1px solid ${open ? "var(--accent)" : "var(--border2)"}`,
            background: "var(--bg)", color: value ? "var(--text)" : "var(--dim)",
            fontSize: "13px", cursor: "pointer", userSelect: "none",
          }}
        >
          <span>{value || `Select ${label}`}</span>
          <ChevronDown size={14} color="var(--muted)"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
        </div>

        {open && (
          <>
            <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "9px", zIndex: 999, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,.5)",
            }}>
              {options.map(opt => (
                <div
                  key={opt}
                  className={`dropdown-item${value === opt ? " selected" : ""}`}
                  onClick={() => { onChange(opt); close(); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Custom input — only shown when "Other" is selected */}
      {isOther && (
        <input
          autoFocus
          placeholder={`Enter custom ${label.toLowerCase()}...`}
          value={customValue}
          onChange={e => onCustomChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "9px",
            border: "1px solid var(--accent)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color .15s",
          }}
        />
      )}
    </div>
  );
};

// ─── CopyButton ──────────────────────────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        display: "flex", alignItems: "center", gap: "5px",
        padding: "4px 10px", borderRadius: "6px",
        border: "1px solid var(--border2)", background: "transparent",
        color: "var(--muted)", fontSize: "11px", cursor: "pointer",
      }}
    >
      {copied ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

// ─── ResultCard ──────────────────────────────────────────────────────────────
const ResultCard = ({ label, content }) => (
  <div style={{
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: "10px", padding: "16px",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
      <span style={{
        fontSize: "11px", fontWeight: "600", color: "var(--accent)",
        textTransform: "uppercase", letterSpacing: "0.5px",
      }}>
        {label}
      </span>
      <CopyButton text={content} />
    </div>
    <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
      {content}
    </p>
  </div>
);

// ─── Main ────────────────────────────────────────────────────────────────────
export default function ContentGenerator() {
  const [format,      setFormat]      = useState("");
  const [customFormat, setCustomFormat] = useState("");
  const [niche,       setNiche]       = useState("");
  const [customNiche,  setCustomNiche]  = useState("");
  const [goal,        setGoal]        = useState("");
  const [customGoal,   setCustomGoal]   = useState("");
  const [tone,        setTone]        = useState("");
  const [customTone,   setCustomTone]   = useState("");
  const [topic,       setTopic]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState("");
  const { activePlat } = usePlatform();

  const isYT     = activePlat === "youtube";
  const isIG     = activePlat === "instagram";
  const accent   = isYT ? "#ff4444" : isIG ? "#c13584" : "var(--accent)";
  const platform = isYT ? "YouTube"  : isIG ? "Instagram" : "YouTube/Instagram";

  // resolve actual value — if "Other" use custom text
  const resolvedFormat = format === "Other" ? customFormat : format;
  const resolvedNiche  = niche  === "Other" ? customNiche  : niche;
  const resolvedGoal   = goal   === "Other" ? customGoal   : goal;
  const resolvedTone   = tone   === "Other" ? customTone   : tone;

  const handleGenerate = async () => {
    if (!format || !niche || !goal || !tone) {
      setError("Please fill all fields before generating.");
      return;
    }
    if (format === "Other" && !customFormat.trim()) { setError("Please enter a custom format."); return; }
    if (niche  === "Other" && !customNiche.trim())  { setError("Please enter a custom niche.");  return; }
    if (goal   === "Other" && !customGoal.trim())   { setError("Please enter a custom goal.");   return; }
    if (tone   === "Other" && !customTone.trim())   { setError("Please enter a custom tone.");   return; }

    setError(""); setLoading(true); setResult(null);

    const prompt = `You are an expert content strategist for ${platform} creators.
Generate detailed content ideas for a ${resolvedNiche} creator:
- Format: ${resolvedFormat}
- Goal: ${resolvedGoal}
- Tone: ${resolvedTone}
${topic ? `- Topic/Keyword: ${topic}` : ""}

Return ONLY this JSON, no markdown, no backticks, no explanation:
{"hook":"A powerful attention-grabbing opening line","angle":"The unique content angle or perspective","outline":"1. First point\\n2. Second point\\n3. Third point\\n4. Fourth point\\n5. Fifth point","caption":"A ready-to-post engaging caption with relevant hashtags","tip":"One specific actionable pro tip for this content type"}`;

    try {
      const res  = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a content strategist. Always respond with valid JSON only. No markdown, no backticks, no extra text. Just raw JSON." },
            { role: "user",   content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 1024,
        }),
      });
      const data   = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw    = data.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch (err) {
      setError(err.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      {/* ── FIXED HEADER ── */}
      <div
        className="fixed-header-fade"
        style={{
          position: "fixed",
          top: 0,
          left: `${SIDEBAR_W}px`,
          right: 0,
          height: `${HEADER_H}px`,
          background: "var(--bg)",
          zIndex: 20,
          padding: `24px ${PAGE_PAD}px 0`,
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "11px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>
          AI Tools
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Content Generator
        </h1>
        <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>
          Generate hooks, outlines &amp; captions for your {platform} content.
        </p>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <main style={{
        marginLeft:    `${SIDEBAR_W}px`,
        flex:          1,
        paddingTop:    `${HEADER_H + 32}px`,
        paddingBottom: "48px",
        paddingLeft:   `${PAGE_PAD}px`,
        paddingRight:  `${PAGE_PAD}px`,
        boxSizing:     "border-box",
      }}>
        <div style={{ display: "flex", gap: `${GAP}px`, alignItems: "flex-start" }}>

          {/* Ghost spacer */}
          <div style={{ width: `${LEFT_W}px`, flexShrink: 0 }} />

          {/* ── FIXED LEFT PANEL ── */}
          <div style={{
            position:      "fixed",
            top:           `${HEADER_H + 32}px`,
            left:          `${FIXED_LEFT}px`,
            width:         `${LEFT_W}px`,
            background:    "var(--card)",
            border:        "1px solid var(--border)",
            borderRadius:  "14px",
            padding:       "24px",
            display:       "flex",
            flexDirection: "column",
            gap:           "16px",
            zIndex:        10,
            boxSizing:     "border-box",
            /* allow panel to scroll if "Other" inputs push it too tall */
            maxHeight:     `calc(100vh - ${HEADER_H + 32 + 24}px)`,
            overflowY:     "auto",
          }}>
            <Select
              label="Format"
              options={formats}
              value={format}
              customValue={customFormat}
              onCustomChange={setCustomFormat}
              onChange={(v) => { setFormat(v); setCustomFormat(""); }}
            />
            <Select
              label="Niche"
              options={niches}
              value={niche}
              customValue={customNiche}
              onCustomChange={setCustomNiche}
              onChange={(v) => { setNiche(v); setCustomNiche(""); }}
            />
            <Select
              label="Goal"
              options={goals}
              value={goal}
              customValue={customGoal}
              onCustomChange={setCustomGoal}
              onChange={(v) => { setGoal(v); setCustomGoal(""); }}
            />
            <Select
              label="Tone"
              options={tones}
              value={tone}
              customValue={customTone}
              onCustomChange={setCustomTone}
              onChange={(v) => { setTone(v); setCustomTone(""); }}
            />

            {/* Topic input */}
            <div>
              <label style={{
                fontSize: "12px", fontWeight: "500", color: "var(--muted)",
                display: "block", marginBottom: "6px",
              }}>
                Topic / Keyword <span style={{ color: "var(--dim)" }}>(optional)</span>
              </label>
              <input
                placeholder="e.g. Morning routine, AI tools..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "9px",
                  border: "1px solid var(--border2)", background: "var(--bg)",
                  color: "var(--text)", fontSize: "13px", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <p style={{
                fontSize: "12px", color: "#f87171", margin: 0,
                padding: "10px 12px", background: "#ff000012",
                borderRadius: "8px", border: "1px solid #ff000025", lineHeight: "1.5",
              }}>
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: "100%", padding: "11px", borderRadius: "9px",
                border: "none", background: accent, color: "#fff",
                fontSize: "14px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity .2s",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "14px", height: "14px",
                    border: "2px solid #ffffff40", borderTopColor: "#fff",
                    borderRadius: "50%", animation: "spin .8s linear infinite",
                  }} />
                  Generating...
                </>
              ) : (
                <><Sparkles size={15} /> Generate Content</>
              )}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

          {/* ── RIGHT RESULTS ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!result && !loading && (
              <div style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "60px 40px", textAlign: "center",
              }}>
                <Sparkles size={32} color="var(--dim)" style={{ marginBottom: "16px" }} />
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", margin: "0 0 6px" }}>
                  Ready to generate
                </p>
                <p style={{ fontSize: "13px", color: "var(--dim)", margin: 0 }}>
                  Fill in the details and click Generate to get your content ideas.
                </p>
              </div>
            )}

            {loading && (
              <div style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "60px 40px", textAlign: "center",
              }}>
                <div style={{
                  width: "28px", height: "28px",
                  border: "2px solid var(--border2)", borderTopColor: accent,
                  borderRadius: "50%", animation: "spin .8s linear infinite",
                  margin: "0 auto 16px",
                }} />
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                  Generating your content ideas...
                </p>
              </div>
            )}

            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <ResultCard label="Hook"    content={result.hook}    />
                <ResultCard label="Angle"   content={result.angle}   />
                <ResultCard label="Outline" content={result.outline} />
                <ResultCard label="Caption" content={result.caption} />
                <ResultCard label="Pro Tip" content={result.tip}     />

                <button
                  onClick={handleGenerate}
                  style={{
                    padding: "10px", borderRadius: "9px",
                    border: "1px solid var(--border2)", background: "transparent",
                    color: "var(--muted)", fontSize: "13px", cursor: "pointer",
                    fontWeight: "500", transition: "border-color .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border2)"}
                >
                  Regenerate ↻
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}