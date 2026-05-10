import React, { useState, useEffect, useRef, useCallback } from "react";
import { byCatchService } from "../../services/bycatch_service";
import {
  Plus, Pencil, Trash2, Upload, X, Check,
  ChevronDown, ChevronRight, Loader2,
  Users, CheckCircle, XCircle, Image as ImageIcon, Link,
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

const selectStyle = { ...inputStyle, cursor: "pointer" };

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
        <Users size={17} color="#3b82f6" />
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
// IMAGE UPLOAD BUTTON
// ══════════════════════════════════════════════════════════════════════════════

function ImageUploadButton({ onUploaded, onError }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const ref = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setLoading(true);
    try {
      const result = await byCatchService.uploadRecordImage(file);
      onUploaded(result.path, result.url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      onError?.("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <button type="button" onClick={() => ref.current?.click()} disabled={loading}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 500, color: "#60a5fa", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 8, cursor: "pointer" }}>
        {loading ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : done ? <Check size={12} /> : <Upload size={12} />}
        {done ? "Uploaded!" : "Upload Photo"}
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VIDEO LINKS EDITOR
// ══════════════════════════════════════════════════════════════════════════════

function VideoLinksEditor({ links, onChange, langTab }) {
  const add = () => onChange([...links, { label_en: "", label_si: "", label_ta: "", url: "" }]);
  const remove = (i) => onChange(links.filter((_, idx) => idx !== i));
  const set = (i, field, val) => {
    const updated = links.map((l, idx) => idx === i ? { ...l, [field]: val } : l);
    onChange(updated);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <FieldLabel text="Video Links" />
        <button type="button" onClick={add}
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>
          <Plus size={11} /> Add Link
        </button>
      </div>

      {links.length === 0 && (
        <p style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>No video links yet. Click "Add Link" to add one.</p>
      )}

      {links.map((link, i) => (
        <div key={i} style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "12px 14px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link size={12} color="#3b82f6" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>Link {i + 1}</span>
            </div>
            <button type="button" onClick={() => remove(i)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", display: "flex", alignItems: "center", padding: 2 }}>
              <X size={13} />
            </button>
          </div>

          {/* URL — always visible */}
          <div style={{ marginBottom: 8 }}>
            <FieldLabel text="URL" />
            <input
              style={inputStyle}
              value={link.url}
              onChange={e => set(i, "url", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          {/* Trilingual label — follows langTab */}
          <div>
            {langTab === "en" && (
              <>
                <FieldLabel text="Label (EN)" />
                <input style={inputStyle} value={link.label_en} onChange={e => set(i, "label_en", e.target.value)} placeholder="e.g. Click Here to view the video 1" />
              </>
            )}
            {langTab === "si" && (
              <>
                <FieldLabel text="Label (SI)" />
                <input style={inputStyle} value={link.label_si} onChange={e => set(i, "label_si", e.target.value)} placeholder="වීඩියෝව බලන්න" />
              </>
            )}
            {langTab === "ta" && (
              <>
                <FieldLabel text="Label (TA)" />
                <input style={inputStyle} value={link.label_ta} onChange={e => set(i, "label_ta", e.target.value)} placeholder="காணொளியைப் பார்க்க" />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RECORD FORM
// ══════════════════════════════════════════════════════════════════════════════

function RecordForm({ topicId, initial, onSave, onCancel, toast }) {
  const [langTab, setLangTab] = useState("en");
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState(() => ({
    topic_id:   topicId,
    name_en:    "", name_si:    "", name_ta:    "",
    species_en: "", species_si: "", species_ta: "",
    video_links: [],
    image_path: "", image_url:  "",
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
          {langTab === "en" && <><FieldLabel text="Name (EN)" /><input style={inputStyle} value={form.name_en} onChange={e => set("name_en", e.target.value)} required placeholder="e.g. D.K.P. Kumara Dias" /></>}
          {langTab === "si" && <><FieldLabel text="Name (SI)" /><input style={inputStyle} value={form.name_si} onChange={e => set("name_si", e.target.value)} placeholder="සිංහල නම" /></>}
          {langTab === "ta" && <><FieldLabel text="Name (TA)" /><input style={inputStyle} value={form.name_ta} onChange={e => set("name_ta", e.target.value)} placeholder="தமிழ் பெயர்" /></>}
        </div>

        {/* Species */}
        <div style={{ marginBottom: 12 }}>
          {langTab === "en" && <><FieldLabel text="Species (EN)" /><input style={inputStyle} value={form.species_en} onChange={e => set("species_en", e.target.value)} required placeholder="e.g. Turtle" /></>}
          {langTab === "si" && <><FieldLabel text="Species (SI)" /><input style={inputStyle} value={form.species_si} onChange={e => set("species_si", e.target.value)} placeholder="විශේෂය" /></>}
          {langTab === "ta" && <><FieldLabel text="Species (TA)" /><input style={inputStyle} value={form.species_ta} onChange={e => set("species_ta", e.target.value)} placeholder="இனம்" /></>}
        </div>

        {/* Video links */}
        <VideoLinksEditor
          links={form.video_links}
          onChange={(links) => set("video_links", links)}
          langTab={langTab}
        />

        {/* Photo */}
        <div style={{ marginBottom: 12 }}>
          <FieldLabel text="Photo" />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {form.image_url && (
              <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", border: "1px solid #334155", flexShrink: 0 }}>
                <img src={form.image_url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <ImageUploadButton
              onUploaded={(path, url) => { set("image_path", path); set("image_url", url); toast.success("Photo uploaded."); }}
              onError={toast.error}
            />
            {form.image_path && (
              <span style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
                <Check size={11} /> Photo set
                <button type="button" onClick={() => { set("image_path", ""); set("image_url", ""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", display: "flex", alignItems: "center", padding: 0, marginLeft: 2 }}>
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Sort Order */}
        <div style={{ marginBottom: 16, width: 120 }}>
          <FieldLabel text="Sort Order" />
          <input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", +e.target.value)} />
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
    title_en: "", title_si: "", title_ta: "",
    slug: "", is_active: true, sort_order: 0,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!initial.title_en && form.title_en) {
      set("slug", form.title_en.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [form.title_en]);

  return (
    <FormCard>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {initial.title_en ? "Edit topic" : "New topic"}
      </p>
      <form onSubmit={async e => { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }}>
        <div style={{ marginBottom: 12 }}>
          {langTab === "en" && <><FieldLabel text="Title (EN)" /><input style={inputStyle} value={form.title_en} onChange={e => set("title_en", e.target.value)} required placeholder="e.g. Turtles" /></>}
          {langTab === "si" && <><FieldLabel text="Title (SI)" /><input style={inputStyle} value={form.title_si} onChange={e => set("title_si", e.target.value)} placeholder="ශීර්ෂය" /></>}
          {langTab === "ta" && <><FieldLabel text="Title (TA)" /><input style={inputStyle} value={form.title_ta} onChange={e => set("title_ta", e.target.value)} placeholder="தலைப்பு" /></>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 12, marginBottom: 16 }}>
          <div><FieldLabel text="Slug" /><input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="e.g. turtles" required /></div>
          <div><FieldLabel text="Sort Order" /><input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", +e.target.value)} /></div>
          <div>
            <FieldLabel text="Active" />
            <select style={selectStyle} value={form.is_active ? "true" : "false"} onChange={e => set("is_active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <SaveButton loading={saving} isEdit={!!initial.title_en} />
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </FormCard>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ══════════════════════════════════════════════════════════════════════════════

function ByCatchSection({ toast }) {
  const [topics, setTopics]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [expanded, setExpanded]           = useState(null);
  const [editingTopic, setEditingTopic]   = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingTopic, setDeletingTopic] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [showNewTopic, setShowNewTopic]   = useState(false);
  const [showNewRecord, setShowNewRecord] = useState(null); // topicId
  const [langTab, setLangTab]             = useState("en");
  const [error, setError]                 = useState("");

  const reload = () => {
    setLoading(true);
    byCatchService.getAllByCatchTopics("en")
      .then(setTopics)
      .catch(e => { setError(e.message); toast.error(e.message); })
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  // Serialize video_links from form state → GraphQL input shape
  const serializeLinks = (links) =>
    (links || []).map(l => ({
      labelEn: l.label_en || null,
      labelSi: l.label_si || null,
      labelTa: l.label_ta || null,
      url:     l.url,
    }));

  // Deserialize video_links from API response → form state shape
  const deserializeLinks = (links) =>
    (links || []).map(l => ({
      label_en: l.labelEn ?? "",
      label_si: l.labelSi ?? "",
      label_ta: l.labelTa ?? "",
      url:      l.url ?? "",
    }));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SectionHeader title="By-Catch Topics" onAdd={() => { setShowNewTopic(true); setEditingTopic(null); }} addLabel="New Topic" />

      {showNewTopic && (
        <TopicForm
          langTab={langTab}
          onSave={async (form) => {
            try {
              await byCatchService.createByCatchTopic({
                titleEn: form.title_en, titleSi: form.title_si || null, titleTa: form.title_ta || null,
                slug: form.slug, isActive: form.is_active, sortOrder: form.sort_order,
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

          {/* Topic row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <button type="button"
              onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>
              {expanded === topic.id
                ? <ChevronDown  size={15} color="#3b82f6" />
                : <ChevronRight size={15} color="#475569" />}
              {topic.titleEn}
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>/{topic.slug}</span>
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>· {topic.records.length} record{topic.records.length !== 1 ? "s" : ""}</span>
              {!topic.isActive && (
                <span style={{ fontSize: 10, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 20, padding: "1px 8px" }}>inactive</span>
              )}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => { setEditingTopic(editingTopic?.id === topic.id ? null : topic); setShowNewTopic(false); }}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer", color: "#60a5fa" }}>
                <Pencil size={12} />
              </button>
              <button onClick={() => setDeletingTopic(topic)}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer", color: "#f87171" }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Inline topic edit */}
          {editingTopic?.id === topic.id && (
            <div style={{ padding: "0 20px 16px" }}>
              <TopicForm
                langTab={langTab}
                initial={{ title_en: topic.titleEn, title_si: topic.titleSi, title_ta: topic.titleTa, slug: topic.slug, is_active: topic.isActive, sort_order: topic.sortOrder }}
                onSave={async (form) => {
                  try {
                    await byCatchService.updateByCatchTopic(topic.id, {
                      titleEn: form.title_en, titleSi: form.title_si || null, titleTa: form.title_ta || null,
                      slug: form.slug, isActive: form.is_active, sortOrder: form.sort_order,
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

          {/* Records table (expanded) */}
          {expanded === topic.id && (
            <div style={{ borderTop: "1px solid #334155", padding: "16px 20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
                <thead>
                  <tr style={{ background: "#0f172a" }}>
                    <Th>#</Th>
                    <Th>Photo</Th>
                    <Th>Name (EN)</Th>
                    <Th>Species (EN)</Th>
                    <Th>Videos</Th>
                    <Th>Translations</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {topic.records.map((record, i) => (
                    <React.Fragment key={record.id}>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        <Td><span style={{ color: "#475569" }}>{i + 1}</span></Td>
                        <td style={{ padding: "10px 16px" }}>
                          {record.imageUrl
                            ? <img src={record.imageUrl} alt={record.nameEn}
                                style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "1px solid #334155" }} />
                            : <div style={{ width: 36, height: 36, borderRadius: 8, background: "#172033", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ImageIcon size={14} color="#475569" />
                              </div>
                          }
                        </td>
                        <td style={{ padding: "10px 16px", fontWeight: 500, color: "#e2e8f0" }}>{record.nameEn}</td>
                        <Td>{record.speciesEn}</Td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ fontSize: 11, background: "#0f172a", color: "#3b82f6", border: "1px solid #1e3a5f", borderRadius: 20, padding: "2px 10px" }}>
                            {(record.videoLinks || []).length} link{(record.videoLinks || []).length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {record.nameSi && <span style={{ fontSize: 10, background: "#1a1a2e", color: "#a78bfa", border: "1px solid #3730a3", borderRadius: 20, padding: "1px 8px" }}>SI</span>}
                            {record.nameTa && <span style={{ fontSize: 10, background: "#0c1a2e", color: "#38bdf8", border: "1px solid #0369a1", borderRadius: 20, padding: "1px 8px" }}>TA</span>}
                            {!record.nameSi && !record.nameTa && <span style={{ fontSize: 10, color: "#475569" }}>EN only</span>}
                          </div>
                        </td>
                        <ActionButtons
                          onEdit={() => setEditingRecord(editingRecord?.id === record.id ? null : record)}
                          onDelete={() => setDeletingRecord(record)}
                        />
                      </tr>

                      {/* Inline record edit */}
                      {editingRecord?.id === record.id && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0, background: "#0f1f33" }}>
                            <div style={{ padding: "12px 16px" }}>
                              <RecordForm
                                key={record.id}
                                topicId={topic.id}
                                toast={toast}
                                initial={{
                                  name_en:    record.nameEn,    name_si:    record.nameSi    ?? "",  name_ta:    record.nameTa    ?? "",
                                  species_en: record.speciesEn, species_si: record.speciesSi ?? "",  species_ta: record.speciesTa ?? "",
                                  video_links: deserializeLinks(record.videoLinks),
                                  image_path: record.imagePath ?? "", image_url: record.imageUrl ?? "",
                                  sort_order: record.sortOrder,
                                }}
                                onSave={async (form) => {
                                  try {
                                    await byCatchService.updateByCatchRecord(record.id, {
                                      nameEn:    form.name_en,    nameSi:    form.name_si    || null, nameTa:    form.name_ta    || null,
                                      speciesEn: form.species_en, speciesSi: form.species_si || null, speciesTa: form.species_ta || null,
                                      videoLinks: serializeLinks(form.video_links),
                                      imagePath: form.image_path || null,
                                      sortOrder: form.sort_order,
                                    });
                                    toast.success("Record updated.");
                                    setEditingRecord(null);
                                    reload();
                                  } catch (e) { toast.error(e.message); }
                                }}
                                onCancel={() => setEditingRecord(null)}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Add record */}
              {showNewRecord === topic.id ? (
                <RecordForm
                  key={`new-${topic.id}`}
                  topicId={topic.id}
                  toast={toast}
                  initial={null}
                  onSave={async (form) => {
                    try {
                      await byCatchService.createByCatchRecord({
                        topicId:    topic.id,
                        nameEn:     form.name_en,    nameSi:    form.name_si    || null, nameTa:    form.name_ta    || null,
                        speciesEn:  form.species_en, speciesSi: form.species_si || null, speciesTa: form.species_ta || null,
                        videoLinks: serializeLinks(form.video_links),
                        imagePath:  form.image_path || null,
                        sortOrder:  form.sort_order,
                      });
                      toast.success("Record added.");
                      setShowNewRecord(null);
                      reload();
                    } catch (e) { toast.error(e.message); }
                  }}
                  onCancel={() => setShowNewRecord(null)}
                />
              ) : (
                <button onClick={() => setShowNewRecord(topic.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>
                  <Plus size={13} /> Add Record
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Confirm delete topic */}
      {deletingTopic && (
        <ConfirmDelete
          label={deletingTopic.titleEn}
          onConfirm={async () => {
            try { await byCatchService.deleteByCatchTopic(deletingTopic.id); toast.success("Topic deleted."); setDeletingTopic(null); reload(); }
            catch (e) { toast.error(e.message); setDeletingTopic(null); }
          }}
          onCancel={() => setDeletingTopic(null)}
        />
      )}

      {/* Confirm delete record */}
      {deletingRecord && (
        <ConfirmDelete
          label={deletingRecord.nameEn}
          onConfirm={async () => {
            try { await byCatchService.deleteByCatchRecord(deletingRecord.id); toast.success("Record deleted."); setDeletingRecord(null); reload(); }
            catch (e) { toast.error(e.message); setDeletingRecord(null); }
          }}
          onCancel={() => setDeletingRecord(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════

export default function ByCatchAdminPanel() {
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>By-Catch Release Management</h2>
        </div>

        <ByCatchSection toast={toast} />
      </div>
    </div>
  );
}