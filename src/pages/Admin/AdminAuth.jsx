// src/pages/Admin/AdminAuth.jsx
import React, { useState, useEffect } from "react";
import { authService } from "../../services/auth_service";
import {
  Loader2, Check, X, Plus, ShieldCheck, User,
  KeyRound, Eye, EyeOff, LogIn,
} from "lucide-react";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: 40, padding: "0 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
  boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
};

function FieldLabel({ text }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, marginTop: 0 }}>
      {text}
    </p>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
      <X size={14} style={{ flexShrink: 0 }} /> {message}
    </div>
  );
}

function SuccessBox({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: "#1a2e1a", border: "1px solid #14532d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#4ade80", display: "flex", alignItems: "center", gap: 8 }}>
      <Check size={14} style={{ flexShrink: 0 }} /> {message}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder = "Password", required = false }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        style={{ ...inputStyle, paddingRight: 40 }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center" }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════

export function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authService.login(username, password);
      localStorage.setItem("dfar_token",      result.token);
      localStorage.setItem("dfar_username",   result.username);
      localStorage.setItem("dfar_fullname",   result.fullName || "");
      localStorage.setItem("dfar_superadmin", String(result.isSuperadmin));
      onLogin(result);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{
        background: "#1e293b", border: "1px solid #334155",
        borderRadius: 20, padding: 40, width: "100%", maxWidth: 400,
        boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: "#2563eb",
            borderRadius: 16, display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px",
          }}>
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>DFAR Admin</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Sign in to manage content</p>
        </div>

        <ErrorBox message={error} />

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <FieldLabel text="Username" />
            <input
              style={inputStyle}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_username"
              required
              autoFocus
            />
          </div>
          <div>
            <FieldLabel text="Password" />
            <PasswordInput value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 44, background: loading ? "#1e3a5f" : "#2563eb",
              color: loading ? "#60a5fa" : "#fff", border: "none",
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 4,
            }}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</>
              : <><LogIn size={16} /> Sign In</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. ADMIN USERS MANAGEMENT SECTION (superadmin only)
// ══════════════════════════════════════════════════════════════════════════════

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Deactivate "{label}"?</p>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>They will no longer be able to log in.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ height: 34, padding: "0 16px", fontSize: 13, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ height: 34, padding: "0 16px", fontSize: 13, fontWeight: 600, background: "#7f1d1d", color: "#fca5a5", border: "1px solid #991b1b", borderRadius: 8, cursor: "pointer" }}>Deactivate</button>
        </div>
      </div>
    </div>
  );
}

export function AdminUsersSection() {
  const [admins, setAdmins]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showNew, setShowNew]       = useState(false);
  const [deactivating, setDeactivating] = useState(null);
  const [showChangePw, setShowChangePw] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg]     = useState("");

  // Register form state
  const [form, setForm]       = useState({ username: "", email: "", password: "", fullName: "", isSuperadmin: false });
  const [saving, setSaving]   = useState(false);
  const [formError, setFormError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Change password state
  const [pwForm, setPwForm]     = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError]   = useState("");

  // Auto-clear success/error banners after 3 s
  useEffect(() => {
    if (!successMsg && !errorMsg) return;
    const t = setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 3000);
    return () => clearTimeout(t);
  }, [successMsg, errorMsg]);

  const reload = () => {
    setLoading(true);
    authService.listAdmins()
      .then(setAdmins)
      .catch(e => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await authService.registerAdmin(form);
      setSuccessMsg(`Admin "${form.username}" registered.`);
      setShowNew(false);
      setForm({ username: "", email: "", password: "", fullName: "", isSuperadmin: false });
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      await authService.changePassword(pwForm.oldPassword, pwForm.newPassword);
      setSuccessMsg("Password changed successfully.");
      setShowChangePw(false);
      setPwForm({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh", padding: "32px 24px" }} className="mt-10 rounded-lg">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Global feedback banners */}
      <SuccessBox message={successMsg} />
      <ErrorBox   message={errorMsg}  />

      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={17} color="#3b82f6" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Admin Users</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowChangePw(s => !s)}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 8, cursor: "pointer" }}
          >
            <KeyRound size={13} /> Change Password
          </button>
          <button
            onClick={() => { setShowNew(s => !s); setFormError(""); }}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            <Plus size={13} /> Register Admin
          </button>
        </div>
      </div>

      {/* Change password form */}
      {showChangePw && (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Change Your Password</p>
          <ErrorBox message={pwError} />
          <form onSubmit={handleChangePw} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <FieldLabel text="Current Password" />
              <PasswordInput value={pwForm.oldPassword} onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel text="New Password" />
                <PasswordInput value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="New password" required />
              </div>
              <div>
                <FieldLabel text="Confirm New Password" />
                <PasswordInput value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Confirm password" required />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={pwSaving} style={{ height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500, background: pwSaving ? "#1e3a5f" : "#2563eb", color: pwSaving ? "#60a5fa" : "#fff", border: "none", borderRadius: 8, cursor: pwSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                {pwSaving ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={13} />}
                {pwSaving ? "Saving…" : "Update Password"}
              </button>
              <button type="button" onClick={() => setShowChangePw(false)} style={{ height: 36, padding: "0 16px", fontSize: 13, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Register new admin form */}
      {showNew && (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Register New Admin</p>
          <ErrorBox message={formError} />
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel text="Username" />
                <input style={inputStyle} value={form.username} onChange={e => set("username", e.target.value)} placeholder="john_doe" required />
              </div>
              <div>
                <FieldLabel text="Full Name" />
                <input style={inputStyle} value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="John Doe" />
              </div>
            </div>
            <div>
              <FieldLabel text="Email" />
              <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@fisheriesdept.gov.lk" required />
            </div>
            <div>
              <FieldLabel text="Password" />
              <PasswordInput value={form.password} onChange={e => set("password", e.target.value)} required />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isSuperadmin}
                onChange={e => set("isSuperadmin", e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#2563eb" }}
              />
              Grant superadmin privileges (can register other admins)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={saving} style={{ height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500, background: saving ? "#1e3a5f" : "#2563eb", color: saving ? "#60a5fa" : "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                {saving ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={13} />}
                {saving ? "Registering…" : "Register"}
              </button>
              <button type="button" onClick={() => setShowNew(false)} style={{ height: 36, padding: "0 16px", fontSize: 13, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Admin users table */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "#475569", gap: 8 }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
        </div>
      ) : (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Username", "Full Name", "Email", "Role", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: admin.isSuperadmin ? "#1e3a5f" : "#1a2e1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {admin.isSuperadmin
                          ? <ShieldCheck size={13} color="#60a5fa" />
                          : <User size={13} color="#4ade80" />
                        }
                      </div>
                      {admin.username}
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{admin.fullName || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#64748b", fontSize: 12 }}>{admin.email}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: admin.isSuperadmin ? "#1e3a5f" : "#1a2e1a", color: admin.isSuperadmin ? "#60a5fa" : "#4ade80", border: `1px solid ${admin.isSuperadmin ? "#1e40af" : "#14532d"}` }}>
                      {admin.isSuperadmin ? "Superadmin" : "Admin"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: admin.isActive ? "#1a2e1a" : "#1f1215", color: admin.isActive ? "#4ade80" : "#f87171", border: `1px solid ${admin.isActive ? "#14532d" : "#7f1d1d"}` }}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    {admin.isActive && (
                      <button
                        onClick={() => setDeactivating(admin)}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deactivating && (
        <ConfirmDelete
          label={deactivating.username}
          onConfirm={async () => {
            try {
              await authService.deactivateAdmin(deactivating.id);
              setSuccessMsg(`"${deactivating.username}" deactivated.`);
              setDeactivating(null);
              reload();
            } catch (e) {
              setErrorMsg(e.message);
              setDeactivating(null);
            }
          }}
          onCancel={() => setDeactivating(null)}
        />
      )}
    </div>
  );
}