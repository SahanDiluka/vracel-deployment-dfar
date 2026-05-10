import { useState, useEffect } from "react";

const GRAPHQL = "http://localhost:8000/graphql";

async function loginRequest(username, password) {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            tokenType
          }
        }
      `,
      variables: { username, password },
    }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data.login;
}

export default function LoginPage() {
  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd,  setShowPwd]    = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState("");
  const [token,    setToken]      = useState("");
  const [copied,   setCopied]     = useState(false);
  const [mounted,  setMounted]    = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await loginRequest(username, password);
      localStorage.setItem("token", result.token);
      setToken(result.token);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setUsername("");
    setPassword("");
  }

  return (
    <div className="min-h-screen bg-[#0c0e10] text-[#f0ede8] font-light relative overflow-hidden"
         style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Font import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0c0e10; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          from { left: -100%; }
          to   { left: 150%; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.12; }
        }

        .anim-0 { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .anim-1 { animation: fadeUp 0.6s ease 0.15s forwards; opacity: 0; }
        .anim-2 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
        .anim-3 { animation: fadeUp 0.6s ease 0.45s forwards; opacity: 0; }

        .btn-shimmer { position: relative; overflow: hidden; }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .btn-shimmer:hover::after { left: 150%; }

        .grid-bg::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
          z-index: 0;
        }

        .input-field {
          width: 100%;
          height: 50px;
          background: #111316;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #f0ede8;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: rgba(107,104,96,0.5); }
        .input-field:hover  { border-color: rgba(255,255,255,0.16); }
        .input-field:focus  { border-color: #7a5e35; background: #141618; }
        .input-field.error  { border-color: rgba(224,112,112,0.5); }

        .token-mono {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #c9a96e;
          word-break: break-all;
          line-height: 1.7;
        }
      `}</style>

      {/* Grid background */}
      <div className="grid-bg" />

      {/* Ambient glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)",
          animation: "pulse-glow 5s ease-in-out infinite",
        }}
      />

      {/* Two-column layout */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left panel ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-14 border-r"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Brand */}
          <div className="anim-0">
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22 }}>
              DFA<span style={{ color: "#c9a96e" }}>R</span>
            </span>
          </div>

          {/* Hero text */}
          <div className="anim-1" style={{ maxWidth: 380 }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(40px, 4vw, 58px)",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
                marginBottom: 20,
              }}
            >
              Manage with<br />
              <em style={{ color: "#c9a96e", fontStyle: "italic" }}>clarity.</em>
            </h1>
            <p style={{ fontSize: 15, color: "#6b6860", lineHeight: 1.75 }}>
              Your content management system.<br />
              Sign in to access the dashboard.
            </p>
          </div>

          {/* Footer */}
          <p className="anim-2" style={{ fontSize: 13, color: "#3d3c39" }}>
            © {new Date().getFullYear()} DFAR Website. All rights reserved.
          </p>
        </div>

        {/* ── Right panel ── */}
        <div className="flex items-center justify-center p-8 lg:p-14">
          <div className="w-full max-w-[400px] anim-3">

            {/* Header */}
            <div className="mb-10">
              {/* Mobile brand */}
              <div className="mb-8 lg:hidden" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>
                DFA<span style={{ color: "#c9a96e" }}>R</span>
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 30,
                  letterSpacing: "-0.5px",
                  marginBottom: 6,
                }}
              >
                Welcome back
              </h2>
              <p style={{ fontSize: 14, color: "#6b6860" }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* ── SUCCESS STATE ── */}
            {token ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Success badge */}
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "rgba(100,190,130,0.08)",
                    border: "1px solid rgba(100,190,130,0.2)",
                    borderRadius: 12, padding: "12px 16px",
                    fontSize: 14, color: "#7ecf95",
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Signed in successfully
                </div>

                {/* Token box */}
                <div
                  style={{
                    background: "#111316",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "14px 16px",
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6b6860", marginBottom: 8 }}>
                    JWT Token
                  </p>
                  <p className="token-mono">
                    {token.slice(0, 60)}…
                  </p>
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  style={{
                    width: "100%", height: 46,
                    background: copied ? "rgba(100,190,130,0.1)" : "transparent",
                    border: `1px solid ${copied ? "rgba(100,190,130,0.3)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 12,
                    color: copied ? "#7ecf95" : "#f0ede8",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                      </svg>
                      Copy token
                    </>
                  )}
                </button>

                {/* Redirect hint */}
                <p style={{ fontSize: 13, color: "#6b6860", textAlign: "center" }}>
                  Token saved to{" "}
                  <code style={{ color: "#c9a96e", fontSize: 12 }}>localStorage</code>.
                  Redirecting…
                </p>

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none", border: "none",
                    color: "#6b6860", fontSize: 13,
                    cursor: "pointer", textAlign: "center",
                    textDecoration: "underline", textDecorationColor: "rgba(107,104,96,0.3)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Sign out
                </button>
              </div>

            ) : (
              /* ── LOGIN FORM ── */
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "rgba(224,112,112,0.08)",
                      border: "1px solid rgba(224,112,112,0.2)",
                      borderRadius: 12, padding: "12px 14px",
                      fontSize: 13, color: "#e07070",
                      marginBottom: 20,
                    }}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Username */}
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block", fontSize: 11, fontWeight: 500,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      color: "#6b6860", marginBottom: 8,
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    className={`input-field ${error ? "error" : ""}`}
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(""); }}
                    autoComplete="username"
                    autoFocus
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: 28 }}>
                  <label
                    style={{
                      display: "block", fontSize: 11, fontWeight: 500,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      color: "#6b6860", marginBottom: 8,
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPwd ? "text" : "password"}
                      className={`input-field ${error ? "error" : ""}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      autoComplete="current-password"
                      style={{ paddingRight: 48 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      style={{
                        position: "absolute", right: 14, top: "50%",
                        transform: "translateY(-50%)",
                        background: "none", border: "none",
                        cursor: "pointer", color: "#6b6860",
                        padding: 4, display: "flex", alignItems: "center",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#f0ede8"}
                      onMouseLeave={e => e.currentTarget.style.color = "#6b6860"}
                    >
                      {showPwd ? (
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                      ) : (
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer"
                  style={{
                    width: "100%", height: 50,
                    background: loading ? "#7a5e35" : "#c9a96e",
                    color: "#1a1200",
                    border: "none", borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15, fontWeight: 500,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s, transform 0.15s, background 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                  onMouseDown={e  => { if (!loading) e.currentTarget.style.transform = "scale(0.99)"; }}
                  onMouseUp={e    => { e.currentTarget.style.transform = "none"; }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: 16, height: 16,
                          border: "2px solid rgba(26,18,0,0.3)",
                          borderTopColor: "#1a1200",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </>
                  )}
                </button>

                {/* Hint */}
                <p style={{ fontSize: 13, color: "#3d3c39", textAlign: "center", marginTop: 20 }}>
                  Contact your administrator for access
                </p>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
