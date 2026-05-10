// src/pages/AdminFooter.jsx
import React, { useState, useEffect, useCallback } from "react";
import { footerService } from "../../services/footer_service";
import { Plus, Check, Loader2, Link as LinkIcon, Share2, CheckCircle, XCircle, X } from "lucide-react";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: 38, padding: "0 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
  boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };

function FieldLabel({ text }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 0 }}>
      {text}
    </p>
  );
}

function SaveButton({ loading, isEdit }) {
  return (
    <button type="submit" disabled={loading} style={{ height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500, background: loading ? "#1e3a5f" : "#2563eb", color: loading ? "#60a5fa" : "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
      {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={13} />}
      {loading ? "Saving…" : isEdit ? "Update" : "Save"}
    </button>
  );
}

function CancelButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>
      Cancel
    </button>
  );
}

function FormCard({ children }) {
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
      {children}
    </div>
  );
}

// ── Inline message banner ─────────────────────────────────────────────────────
function SectionMessage({ message, onClose }) {
  if (!message) return null;
  const isError = message.type === "error";
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 10, padding: "10px 14px", borderRadius: 10, marginBottom: 16,
      background: isError ? "#1f1215" : "#0f231a",
      border: `1px solid ${isError ? "#7f1d1d" : "#14532d"}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isError
          ? <XCircle size={15} color="#f87171" />
          : <CheckCircle size={15} color="#4ade80" />}
        <span style={{ fontSize: 13, color: isError ? "#f87171" : "#4ade80" }}>
          {message.text}
        </span>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2, display: "flex", alignItems: "center" }}>
        <X size={13} />
      </button>
    </div>
  );
}

// ── useSectionMessage hook ────────────────────────────────────────────────────
function useSectionMessage() {
  const [message, setMessage] = useState(null);

  const showSuccess = useCallback((text) => {
    setMessage({ type: "success", text });
    // auto-dismiss after 3 s
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const showError = useCallback((text) => {
    setMessage({ type: "error", text });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const clear = useCallback(() => setMessage(null), []);

  return { message, showSuccess, showError, clear };
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Delete "{label}"?</p>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>This cannot be undone.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ height: 34, padding: "0 16px", fontSize: 13, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ height: 34, padding: "0 16px", fontSize: 13, fontWeight: 600, background: "#7f1d1d", color: "#fca5a5", border: "1px solid #991b1b", borderRadius: 8, cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "#475569", gap: 8 }}>
      <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
    </div>
  );
}

const LANG_TABS = [
  { code: "en", label: "EN 🇬🇧" },
  { code: "si", label: "SI 🇱🇰" },
  { code: "ta", label: "TA 🇱🇰" },
];

function LangTabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "#0f172a", borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 16 }}>
      {LANG_TABS.map(t => (
        <button key={t.code} onClick={() => onChange(t.code)} type="button"
          style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 7, border: "none", cursor: "pointer", background: active === t.code ? "#2563eb" : "transparent", color: active === t.code ? "#fff" : "#64748b" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

const PLATFORMS = ["facebook", "twitter", "youtube", "linkedin", "instagram"];
const PLATFORM_COLOURS = {
  facebook: "#1877F2", twitter: "#000000", youtube: "#FF0000",
  linkedin: "#0A66C2", instagram: "#E1306C",
};

// ══════════════════════════════════════════════════════════════════════════════
// RELATED LINK FORM
// ══════════════════════════════════════════════════════════════════════════════

function LinkForm({ initial = {}, onSave, onCancel, langTab, setLangTab }) {
  const [form, setForm] = useState({
    name_en: "", name_si: "", name_ta: "", url: "", is_active: true, sort_order: 0,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormCard>
      <form onSubmit={handleSubmit}>
        <LangTabs active={langTab} onChange={setLangTab} />
        <div style={{ marginBottom: 12 }}>
          {langTab === "en" && (
            <><FieldLabel text="Link Name (EN)" />
              <input style={inputStyle} value={form.name_en} onChange={e => set("name_en", e.target.value)} required /></>
          )}
          {langTab === "si" && (
            <><FieldLabel text="Link Name (SI)" />
              <input style={inputStyle} value={form.name_si} onChange={e => set("name_si", e.target.value)} /></>
          )}
          {langTab === "ta" && (
            <><FieldLabel text="Link Name (TA)" />
              <input style={inputStyle} value={form.name_ta} onChange={e => set("name_ta", e.target.value)} /></>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", gap: 12, marginBottom: 16 }}>
          <div>
            <FieldLabel text="URL" />
            <input style={inputStyle} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." required />
          </div>
          <div>
            <FieldLabel text="Sort Order" />
            <input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", +e.target.value)} />
          </div>
          <div>
            <FieldLabel text="Active" />
            <select style={selectStyle} value={form.is_active ? "true" : "false"} onChange={e => set("is_active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SaveButton loading={saving} isEdit={!!initial.name_en} />
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </FormCard>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RELATED LINKS SECTION
// ══════════════════════════════════════════════════════════════════════════════

function RelatedLinksSection() {
  const [links, setLinks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [langTab, setLangTab]   = useState("en");
  const { message, showSuccess, showError, clear } = useSectionMessage();

  useEffect(() => {
    footerService.getRelatedLinks("en", null)
      .then(setLinks)
      .catch(e => showError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const silentReload = useCallback(() => {
    footerService.getRelatedLinks("en", null)
      .then(setLinks)
      .catch(e => showError(e.message));
  }, []);

  const applyOptimistic = useCallback((id, patch) => {
    setLinks(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  }, []);

  const handleCreate = async (form) => {
    try {
      await footerService.createRelatedLink(form);
      showSuccess("Link added successfully.");
      setShowNew(false);
      silentReload();
    } catch (e) {
      showError(e.message);
    }
  };

  const handleUpdate = async (id, form) => {
    try {
      const updated = await footerService.updateRelatedLink(id, form);
      applyOptimistic(id, {
        nameEn:    updated.nameEn,
        nameSi:    updated.nameSi,
        nameTa:    updated.nameTa,
        url:       updated.url,
        isActive:  updated.isActive,
        sortOrder: updated.sortOrder,
      });
      showSuccess("Link updated successfully.");
      setEditing(null);
    } catch (e) {
      showError(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await footerService.deleteRelatedLink(deleting.id);
      setLinks(prev => prev.filter(item => item.id !== deleting.id));
      showSuccess("Link deleted.");
      setDeleting(null);
    } catch (e) {
      showError(e.message);
      setDeleting(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LinkIcon size={17} color="#3b82f6" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Related Links</p>
        </div>
        <button
          onClick={() => { setShowNew(true); setEditing(null); }}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          <Plus size={13} /> Add Link
        </button>
      </div>

      {/* ── Inline message banner ── */}
      <SectionMessage message={message} onClose={clear} />

      {showNew && (
        <LinkForm
          langTab={langTab}
          setLangTab={setLangTab}
          onSave={handleCreate}
          onCancel={() => setShowNew(false)}
        />
      )}

      {links.length === 0 && !showNew && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 24 }}>No links yet.</p>
      )}

      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {["Name (EN)", "URL", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <React.Fragment key={link.id}>
                <tr style={{ borderBottom: "1px solid #1e293b", background: editing?.id === link.id ? "#172033" : "transparent" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{link.nameEn}</td>
                  <td style={{ padding: "10px 16px", maxWidth: 260 }}>
                    <span style={{ color: "#3b82f6", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{link.url}</span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: link.isActive ? "#1a2e1a" : "#1f1215", color: link.isActive ? "#4ade80" : "#f87171", border: `1px solid ${link.isActive ? "#14532d" : "#7f1d1d"}` }}>
                      {link.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => { setEditing(editing?.id === link.id ? null : link); setShowNew(false); }}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(link)}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {editing?.id === link.id && (
                  <tr>
                    <td colSpan={4} style={{ padding: "12px 16px", background: "#172033" }}>
                      <LinkForm
                        langTab={langTab}
                        setLangTab={setLangTab}
                        initial={{
                          name_en:    link.nameEn,
                          name_si:    link.nameSi ?? "",
                          name_ta:    link.nameTa ?? "",
                          url:        link.url,
                          is_active:  link.isActive,
                          sort_order: link.sortOrder,
                        }}
                        onSave={(form) => handleUpdate(link.id, form)}
                        onCancel={() => setEditing(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {deleting && (
        <ConfirmDelete
          label={deleting.nameEn}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SOCIAL LINK FORM
// ══════════════════════════════════════════════════════════════════════════════

function SocialForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    platform: "facebook", url: "", is_active: true, sort_order: 0,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormCard>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 100px 100px", gap: 12, marginBottom: 16 }}>
          <div>
            <FieldLabel text="Platform" />
            <select style={selectStyle} value={form.platform} onChange={e => set("platform", e.target.value)}>
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel text="URL" />
            <input style={inputStyle} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://facebook.com/yourpage" required />
          </div>
          <div>
            <FieldLabel text="Sort Order" />
            <input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", +e.target.value)} />
          </div>
          <div>
            <FieldLabel text="Active" />
            <select style={selectStyle} value={form.is_active ? "true" : "false"} onChange={e => set("is_active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SaveButton loading={saving} isEdit={!!initial.platform} />
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </FormCard>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS SECTION
// ══════════════════════════════════════════════════════════════════════════════

function SocialLinksSection() {
  const [links, setLinks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const { message, showSuccess, showError, clear } = useSectionMessage();

  useEffect(() => {
    footerService.getSocialLinks(null)
      .then(setLinks)
      .catch(e => showError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const silentReload = useCallback(() => {
    footerService.getSocialLinks(null)
      .then(setLinks)
      .catch(e => showError(e.message));
  }, []);

  const applyOptimistic = useCallback((id, patch) => {
    setLinks(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  }, []);

  const handleCreate = async (form) => {
    try {
      await footerService.createSocialLink(form);
      showSuccess("Social link added successfully.");
      setShowNew(false);
      silentReload();
    } catch (e) {
      showError(e.message);
    }
  };

  const handleUpdate = async (id, form) => {
    try {
      const updated = await footerService.updateSocialLink(id, form);
      applyOptimistic(id, {
        platform:  updated.platform,
        url:       updated.url,
        isActive:  updated.isActive,
        sortOrder: updated.sortOrder,
      });
      showSuccess("Social link updated successfully.");
      setEditing(null);
    } catch (e) {
      showError(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await footerService.deleteSocialLink(deleting.id);
      setLinks(prev => prev.filter(item => item.id !== deleting.id));
      showSuccess("Social link deleted.");
      setDeleting(null);
    } catch (e) {
      showError(e.message);
      setDeleting(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Share2 size={17} color="#3b82f6" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Social Links</p>
        </div>
        <button
          onClick={() => { setShowNew(true); setEditing(null); }}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          <Plus size={13} /> Add Social
        </button>
      </div>

      {/* ── Inline message banner ── */}
      <SectionMessage message={message} onClose={clear} />

      {showNew && (
        <SocialForm
          onSave={handleCreate}
          onCancel={() => setShowNew(false)}
        />
      )}

      {links.length === 0 && !showNew && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 24 }}>No social links yet.</p>
      )}

      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {["Platform", "URL", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <React.Fragment key={link.id}>
                <tr style={{ borderBottom: "1px solid #1e293b", background: editing?.id === link.id ? "#172033" : "transparent" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: PLATFORM_COLOURS[link.platform] ?? "#334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{link.platform.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span style={{ fontWeight: 500, color: "#f1f5f9", textTransform: "capitalize" }}>{link.platform}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", maxWidth: 300 }}>
                    <span style={{ color: "#3b82f6", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{link.url}</span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: link.isActive ? "#1a2e1a" : "#1f1215", color: link.isActive ? "#4ade80" : "#f87171", border: `1px solid ${link.isActive ? "#14532d" : "#7f1d1d"}` }}>
                      {link.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => { setEditing(editing?.id === link.id ? null : link); setShowNew(false); }}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(link)}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {editing?.id === link.id && (
                  <tr>
                    <td colSpan={4} style={{ padding: "12px 16px", background: "#172033" }}>
                      <SocialForm
                        initial={{
                          platform:   link.platform,
                          url:        link.url,
                          is_active:  link.isActive,
                          sort_order: link.sortOrder,
                        }}
                        onSave={(form) => handleUpdate(link.id, form)}
                        onCancel={() => setEditing(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {deleting && (
        <ConfirmDelete
          label={deleting.platform}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT  — no toast prop needed anymore
// ══════════════════════════════════════════════════════════════════════════════

export default function AdminFooter() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh", padding: "32px 24px" }} className="mt-10 rounded-lg">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Footer Management</h2>
      </div>
      <RelatedLinksSection />
      <SocialLinksSection />
    </div>
  );
}