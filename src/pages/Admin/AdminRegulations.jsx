// src/pages/admin/RegulationsAdminPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { regulationService } from "../../services/regulation_service";
import {
  Plus, Pencil, Trash2, Upload, X, Check,
  ChevronDown, ChevronRight, Loader2,
  FileText, CheckCircle, XCircle,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════════════

function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          borderRadius: 10, minWidth: 280, maxWidth: 380, pointerEvents: "all",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          border: `1px solid ${t.type === "success" ? "#14532d" : "#7f1d1d"}`,
          background: t.type === "success" ? "#0f2318" : "#1a0a0a",
          animation: "slideIn 0.2s ease",
        }}>
          {t.type === "success"
            ? <CheckCircle size={16} color="#4ade80" style={{ flexShrink: 0 }} />
            : <XCircle     size={16} color="#f87171" style={{ flexShrink: 0 }} />}
          <span style={{ fontSize: 13, color: t.type === "success" ? "#86efac" : "#fca5a5", flex: 1, lineHeight: 1.4 }}>{t.message}</span>
          <button onClick={() => onRemove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: t.type === "success" ? "#4ade80" : "#f87171", flexShrink: 0, display: "flex", alignItems: "center" }}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const remove  = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const add     = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);
  const success = useCallback((msg) => add(msg, "success"), [add]);
  const error   = useCallback((msg) => add(msg, "error"),   [add]);
  return { toasts, remove, success, error };
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════

const inputStyle = {
  width: "100%", height: 38, padding: "0 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
  boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
};

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI
// ══════════════════════════════════════════════════════════════════════════════

function FieldLabel({ text }) {
  return <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 0 }}>{text}</p>;
}

function ErrorBox({ message }) {
  if (!message) return null;
  return <div style={{ background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>{message}</div>;
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
  return <button type="button" onClick={onClick} style={{ height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>;
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
        <button key={t.code} onClick={() => onChange(t.code)} type="button" style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 7, border: "none", cursor: "pointer", transition: "all 0.15s", background: active === t.code ? "#2563eb" : "transparent", color: active === t.code ? "#fff" : "#64748b" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function FormCard({ children }) {
  return <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>{children}</div>;
}

function SectionHeader({ title, onAdd, addLabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={17} color="#3b82f6" />
        <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{title}</p>
      </div>
      <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}

function Th({ children }) {
  return <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ padding: "10px 16px", color: "#94a3b8", fontSize: 13 }}>{children}</td>;
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <td style={{ padding: "10px 16px" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onEdit}   style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>Edit</button>
        <button onClick={onDelete} style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>Delete</button>
      </div>
    </td>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "#475569", gap: 8 }}>
      <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
    </div>
  );
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Delete "{label}"?</p>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel}  style={{ height: 34, padding: "0 16px", fontSize: 13, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ height: 34, padding: "0 16px", fontSize: 13, fontWeight: 600, background: "#7f1d1d", color: "#fca5a5", border: "1px solid #991b1b", borderRadius: 8, cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PDF UPLOAD BUTTON
// ══════════════════════════════════════════════════════════════════════════════

function PdfUploadButton({ onUploaded, onError, currentPath }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const ref = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setLoading(true);
    try {
      const result = await regulationService.uploadPdf(file);
      onUploaded(result.path);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      onError?.("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input ref={ref} type="file" accept="application/pdf" style={{ display: "none" }} onChange={handleFile} />
      <button type="button" onClick={() => ref.current?.click()} disabled={loading}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 500, color: "#60a5fa", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 8, cursor: "pointer" }}>
        {loading ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : done ? <Check size={12} /> : <Upload size={12} />}
        {done ? "Uploaded!" : "Upload PDF"}
      </button>
      {currentPath && (
        <span style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
          <Check size={11} /> {currentPath.split("/").pop()}
        </span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROW FORM
// ══════════════════════════════════════════════════════════════════════════════

function RowForm({ topicId, initial, onSave, onCancel, toast }) {
  const [langTab, setLangTab] = useState("en");
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState(() => ({
    topic_id: topicId,
    name_en: "", name_si: "", name_ta: "",
    number: "", date: "", pdf_path: "",
    sort_order: 0,
    ...(initial || {}),
  }));
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background: "#172033", border: "1px solid #1e3a5f", borderRadius: 10, padding: "16px 20px", marginBottom: 12 }}>
      <LangTabs active={langTab} onChange={setLangTab} />
      <form onSubmit={async e => { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }}>

        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          {langTab === "en" && <><FieldLabel text="Regulation Name (EN)" /><input style={inputStyle} value={form.name_en} onChange={e => set("name_en", e.target.value)} required placeholder="Full regulation name" /></>}
          {langTab === "si" && <><FieldLabel text="Regulation Name (SI)" /><input style={inputStyle} value={form.name_si} onChange={e => set("name_si", e.target.value)} placeholder="රෙගුලාසි නාමය" /></>}
          {langTab === "ta" && <><FieldLabel text="Regulation Name (TA)" /><input style={inputStyle} value={form.name_ta} onChange={e => set("name_ta", e.target.value)} placeholder="ஒழுங்குவிதி பெயர்" /></>}
        </div>

        {/* Number + Date + Sort */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: 12, marginBottom: 12 }}>
          <div>
            <FieldLabel text="Number" />
            <input style={inputStyle} value={form.number || ""} onChange={e => set("number", e.target.value)} placeholder="e.g. No. 12/2024" />
          </div>
          <div>
            <FieldLabel text="Date" />
            <input style={inputStyle} type="date" value={form.date || ""} onChange={e => set("date", e.target.value)} />
          </div>
          <div>
            <FieldLabel text="Sort Order" />
            <input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", parseInt(e.target.value) || 0)} />
          </div>
        </div>

        {/* PDF */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel text="PDF File" />
          <PdfUploadButton
            currentPath={form.pdf_path}
            onUploaded={(path) => { set("pdf_path", path); toast.success("PDF uploaded."); }}
            onError={toast.error}
          />
          {form.pdf_path && (
            <button type="button" onClick={() => set("pdf_path", "")}
              style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <X size={11} /> Remove PDF
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <SaveButton loading={saving} isEdit={!!initial?.name_en} />
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TOPIC FORM
// ══════════════════════════════════════════════════════════════════════════════

function TopicForm({ initial = {}, langTab, onSave, onCancel }) {
  const [form, setForm] = useState({
    nav_label_en: "", nav_label_si: "", nav_label_ta: "",
    header_en: "", header_si: "", header_ta: "",
    slug: "", is_active: true, sort_order: 0,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!initial.header_en && form.header_en) {
      set("slug", form.header_en.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [form.header_en]);

  return (
    <FormCard>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {initial.header_en ? "Edit Topic" : "New Topic"}
      </p>
      <form onSubmit={async e => { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }}>

        {/* Nav label */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, marginTop: 0 }}>Nav Label</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><FieldLabel text="EN *" /><input style={inputStyle} value={form.nav_label_en} onChange={e => set("nav_label_en", e.target.value)} required placeholder="e.g. Regulations" /></div>
            <div><FieldLabel text="SI"   /><input style={inputStyle} value={form.nav_label_si || ""} onChange={e => set("nav_label_si", e.target.value)} placeholder="සිංහල" /></div>
            <div><FieldLabel text="TA"   /><input style={inputStyle} value={form.nav_label_ta || ""} onChange={e => set("nav_label_ta", e.target.value)} placeholder="தமிழ்" /></div>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, marginTop: 0 }}>Page Header</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><FieldLabel text="EN *" /><input style={inputStyle} value={form.header_en} onChange={e => set("header_en", e.target.value)} required placeholder="e.g. Health Regulations" /></div>
            <div><FieldLabel text="SI"   /><input style={inputStyle} value={form.header_si || ""} onChange={e => set("header_si", e.target.value)} placeholder="ශීර්ෂය" /></div>
            <div><FieldLabel text="TA"   /><input style={inputStyle} value={form.header_ta || ""} onChange={e => set("header_ta", e.target.value)} placeholder="தலைப்பு" /></div>
          </div>
        </div>

        {/* Slug + sort + active */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 12, marginBottom: 16 }}>
          <div><FieldLabel text="Slug *" /><input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} required placeholder="e.g. health-regulations" /></div>
          <div><FieldLabel text="Sort Order" /><input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", +e.target.value)} /></div>
          <div>
            <FieldLabel text="Active" />
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.is_active ? "true" : "false"} onChange={e => set("is_active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <SaveButton loading={saving} isEdit={!!initial.header_en} />
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </FormCard>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ══════════════════════════════════════════════════════════════════════════════

function RegulationsSection({ toast }) {
  const [topics,        setTopics]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [expanded,      setExpanded]      = useState(null);
  const [editingTopic,  setEditingTopic]  = useState(null);
  const [editingRow,    setEditingRow]    = useState(null);
  const [deletingTopic, setDeletingTopic] = useState(null);
  const [deletingRow,   setDeletingRow]   = useState(null);
  const [showNewTopic,  setShowNewTopic]  = useState(false);
  const [showNewRow,    setShowNewRow]    = useState(null);
  const [langTab,       setLangTab]       = useState("en");
  const [error,         setError]         = useState("");

  const reload = () => {
    setLoading(true);
    regulationService.getAllRegulationTopics("en", null)
      .then(setTopics)
      .catch(e => { setError(e.message); toast.error(e.message); })
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SectionHeader
        title="Regulation Topics"
        onAdd={() => { setShowNewTopic(true); setEditingTopic(null); }}
        addLabel="New Topic"
      />

      {showNewTopic && (
        <TopicForm
          langTab={langTab}
          onSave={async (form) => {
            try {
              await regulationService.createRegulationTopic({
                nav_label_en: form.nav_label_en, nav_label_si: form.nav_label_si || null, nav_label_ta: form.nav_label_ta || null,
                header_en: form.header_en,       header_si: form.header_si || null,       header_ta: form.header_ta || null,
                slug: form.slug, is_active: form.is_active, sort_order: form.sort_order,
              });
              toast.success("Topic created.");
              setShowNewTopic(false);
              reload();
            } catch (e) { toast.error(e.message); }
          }}
          onCancel={() => setShowNewTopic(false)}
        />
      )}

      {topics.length === 0 && !showNewTopic && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 32 }}>No topics yet. Create one above.</p>
      )}

      <LangTabs active={langTab} onChange={setLangTab} />

      {topics.map(topic => (
        <div key={topic.id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>

          {/* ── Topic header bar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <button type="button"
              onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>
              {expanded === topic.id
                ? <ChevronDown  size={15} color="#3b82f6" />
                : <ChevronRight size={15} color="#475569" />}
              {/* FIXED: camelCase API response */}
              {topic.headerEn}
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>/{topic.slug}</span>
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>
                · {topic.rows?.length || 0} row{topic.rows?.length !== 1 ? "s" : ""}
              </span>
              {/* FIXED: isActive */}
              {!topic.isActive && (
                <span style={{ fontSize: 10, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 20, padding: "1px 8px" }}>inactive</span>
              )}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => { setEditingTopic(editingTopic?.id === topic.id ? null : topic); setShowNewTopic(false); }}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer", color: "#60a5fa" }}>
                <Pencil size={12} />
              </button>
              <button
                onClick={() => setDeletingTopic(topic)}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer", color: "#f87171" }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* ── Inline topic edit ── */}
          {editingTopic?.id === topic.id && (
            <div style={{ padding: "0 20px 16px" }}>
              <TopicForm
                langTab={langTab}
                initial={{
                  // FIXED: all camelCase → snake_case for form state
                  nav_label_en: topic.navLabelEn, nav_label_si: topic.navLabelSi, nav_label_ta: topic.navLabelTa,
                  header_en: topic.headerEn,       header_si: topic.headerSi,     header_ta: topic.headerTa,
                  slug: topic.slug, is_active: topic.isActive, sort_order: topic.sortOrder,
                }}
                onSave={async (form) => {
                  try {
                    await regulationService.updateRegulationTopic(topic.id, {
                      nav_label_en: form.nav_label_en, nav_label_si: form.nav_label_si || null, nav_label_ta: form.nav_label_ta || null,
                      header_en: form.header_en,       header_si: form.header_si || null,       header_ta: form.header_ta || null,
                      slug: form.slug, is_active: form.is_active, sort_order: form.sort_order,
                    });
                    toast.success("Topic updated.");
                    setEditingTopic(null);
                    reload();
                  } catch (e) { toast.error(e.message); }
                }}
                onCancel={() => setEditingTopic(null)}
              />
            </div>
          )}

          {/* ── Rows table ── */}
          {expanded === topic.id && (
            <div style={{ borderTop: "1px solid #334155", padding: "16px 20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
                <thead>
                  <tr style={{ background: "#0f172a" }}>
                    <Th>#</Th>
                    <Th>Name (EN)</Th>
                    <Th>Number</Th>
                    <Th>Date</Th>
                    <Th>PDF</Th>
                    <Th>Translations</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {topic.rows && topic.rows.map((row, i) => (
                    <React.Fragment key={row.id}>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        <Td><span style={{ color: "#475569" }}>{i + 1}</span></Td>
                        <td style={{ padding: "10px 16px", fontWeight: 500, color: "#e2e8f0", fontSize: 13, maxWidth: 220 }}>
                          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {/* FIXED: nameEn */}
                            {row.nameEn}
                          </span>
                        </td>
                        <Td>
                          <span style={{ fontFamily: "monospace", background: "#0f172a", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>
                            {row.number || "—"}
                          </span>
                        </Td>
                        <Td>{row.date || "—"}</Td>
                        <Td>
                          {/* FIXED: pdfPath */}
                          {row.pdfPath
                            ? <span style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}><Check size={11} /> PDF</span>
                            : <span style={{ color: "#334155" }}>—</span>}
                        </Td>
                        <Td>
                          <div style={{ display: "flex", gap: 4 }}>
                            {/* FIXED: nameSi, nameTa */}
                            {row.nameSi && <span style={{ fontSize: 10, background: "#1a1a2e", color: "#a78bfa", border: "1px solid #3730a3", borderRadius: 20, padding: "1px 8px" }}>SI</span>}
                            {row.nameTa && <span style={{ fontSize: 10, background: "#0c1a2e", color: "#38bdf8", border: "1px solid #0369a1", borderRadius: 20, padding: "1px 8px" }}>TA</span>}
                            {!row.nameSi && !row.nameTa && <span style={{ fontSize: 10, color: "#475569" }}>EN only</span>}
                          </div>
                        </Td>
                        <ActionButtons
                          onEdit={() => setEditingRow(editingRow?.id === row.id ? null : row)}
                          onDelete={() => setDeletingRow(row)}
                        />
                      </tr>

                      {/* Inline row edit */}
                      {editingRow?.id === row.id && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0, background: "#0f1f33" }}>
                            <div style={{ padding: "12px 16px" }}>
                              <RowForm
                                key={row.id}
                                topicId={topic.id}
                                toast={toast}
                                initial={{
                                  // FIXED: all camelCase → snake_case for form state
                                  name_en: row.nameEn,   name_si: row.nameSi ?? "",  name_ta: row.nameTa ?? "",
                                  number:  row.number ?? "", date: row.date ?? "",
                                  pdf_path: row.pdfPath ?? "",
                                  sort_order: row.sortOrder,
                                }}
                                onSave={async (form) => {
                                  try {
                                    await regulationService.updateRegulationRow(row.id, {
                                      name_en: form.name_en, name_si: form.name_si || null, name_ta: form.name_ta || null,
                                      number: form.number || null, date: form.date || null,
                                      pdf_path: form.pdf_path || null, sort_order: form.sort_order,
                                    });
                                    toast.success("Row updated.");
                                    setEditingRow(null);
                                    reload();
                                  } catch (e) { toast.error(e.message); }
                                }}
                                onCancel={() => setEditingRow(null)}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Add row */}
              {showNewRow === topic.id ? (
                <RowForm
                  key={`new-${topic.id}`}
                  topicId={topic.id}
                  toast={toast}
                  initial={null}
                  onSave={async (form) => {
                    try {
                      await regulationService.createRegulationRow({
                        topic_id: topic.id,
                        name_en: form.name_en, name_si: form.name_si || null, name_ta: form.name_ta || null,
                        number: form.number || null, date: form.date || null,
                        pdf_path: form.pdf_path || null, sort_order: form.sort_order,
                      });
                      toast.success("Row added.");
                      setShowNewRow(null);
                      reload();
                    } catch (e) { toast.error(e.message); }
                  }}
                  onCancel={() => setShowNewRow(null)}
                />
              ) : (
                <button
                  onClick={() => setShowNewRow(topic.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>
                  <Plus size={13} /> Add Row
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {deletingTopic && (
        <ConfirmDelete
          label={deletingTopic.headerEn}
          onConfirm={async () => {
            try { await regulationService.deleteRegulationTopic(deletingTopic.id); toast.success("Topic deleted."); setDeletingTopic(null); reload(); }
            catch (e) { toast.error(e.message); setDeletingTopic(null); }
          }}
          onCancel={() => setDeletingTopic(null)}
        />
      )}

      {deletingRow && (
        <ConfirmDelete
          label={deletingRow.nameEn}
          onConfirm={async () => {
            try { await regulationService.deleteRegulationRow(deletingRow.id); toast.success("Row deleted."); setDeletingRow(null); reload(); }
            catch (e) { toast.error(e.message); setDeletingRow(null); }
          }}
          onCancel={() => setDeletingRow(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════

export default function RegulationsAdminPage() {
  const toast = useToast();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh", padding: "32px 24px" }} className="mt-10 rounded-lg">
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        input:focus, textarea:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        input::placeholder, textarea::placeholder { color: #475569; }
        select option { background: #1e293b; color: #e2e8f0; }
        * { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
        *::-webkit-scrollbar       { width: 6px; }
        *::-webkit-scrollbar-track { background: #0f172a; }
        *::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Regulations Management</h2>
        </div>
        <RegulationsSection toast={toast} />
      </div>
    </div>
  );
}