// src/pages/AdminAbout.jsx

import React, { useState, useEffect, useRef } from "react";
// 1. FIXED: Corrected the import name
import { aboutService } from "../../services/ministry_service"; 
// 2. FIXED: Import uploadImage from helper, not the service
import { uploadImage } from "../../services/helper"; 
import {
  Plus, Pencil, Trash2, Upload, Check,
  Loader2, User, Users,
} from "lucide-react";

// ── snake_case form state → camelCase GraphQL input ───────────────────────────
function toGqlDg(f) {
  return {
    nameEn: f.name_en,         nameSi: f.name_si,         nameTa: f.name_ta,
    titleEn: f.title_en,       titleSi: f.title_si,       titleTa: f.title_ta,
    departmentEn: f.department_en, departmentSi: f.department_si, departmentTa: f.department_ta,
    quoteEn: f.quote_en,       quoteSi: f.quote_si,       quoteTa: f.quote_ta,
    messageEn: f.message_en,   messageSi: f.message_si,   messageTa: f.message_ta,
    imagePath: f.image_path,   initials: f.initials,      isActive: f.is_active,
  };
}

function toGqlOfficial(f) {
  return {
    roleEn: f.role_en,         roleSi: f.role_si,         roleTa: f.role_ta,
    nameEn: f.name_en,         nameSi: f.name_si,         nameTa: f.name_ta,
    ministryEn: f.ministry_en, ministrySi: f.ministry_si, ministryTa: f.ministry_ta,
    phone: f.phone,            fax: f.fax,
    imagePath: f.image_path,   isActive: f.is_active,     sortOrder: f.sort_order,
  };
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: 38, padding: "0 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
  boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };
const textareaStyle = { ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", minHeight: 90 };

function FieldLabel({ text }) {
  return <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 0 }}>{text}</p>;
}

function SaveButton({ loading, isEdit }) {
  return (
    <button type="submit" disabled={loading} style={{ height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500, background: loading ? "#1e3a5f" : "#2563eb", color: loading ? "#60a5fa" : "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
      {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={13} />}
      {loading ? "Saving..." : isEdit ? "Update" : "Save"}
    </button>
  );
}

function CancelButton({ onClick }) {
  return <button type="button" onClick={onClick} style={{ height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>;
}

const LANG_TABS = [{ code: "en", label: "EN" }, { code: "si", label: "SI" }, { code: "ta", label: "TA" }];

function LangTabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "#0f172a", borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 16 }}>
      {LANG_TABS.map(t => (
        <button key={t.code} onClick={() => onChange(t.code)} type="button" style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 7, border: "none", cursor: "pointer", transition: "all 0.15s", background: active === t.code ? "#2563eb" : "transparent", color: active === t.code ? "#fff" : "#64748b" }}>{t.label}</button>
      ))}
    </div>
  );
}

function FormCard({ children }) {
  return <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>{children}</div>;
}

function ErrorBox({ message }) {
  if (!message) return null;
  return <div style={{ background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>{message}</div>;
}

function SuccessBox({ message }) {
  if (!message) return null;
  return <div style={{ background: "#0f2a1a", border: "1px solid #14532d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#4ade80" }}>{message}</div>;
}

function LoadingSpinner() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "#475569", gap: 8 }}><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading...</div>;
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Delete "{label}"?</p>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ height: 34, padding: "0 16px", fontSize: 13, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ height: 34, padding: "0 16px", fontSize: 13, fontWeight: 600, background: "#7f1d1d", color: "#fca5a5", border: "1px solid #991b1b", borderRadius: 8, cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── ImageUploadButton — FIXED: Now uses uploadImage from helper directly ────────────
function ImageUploadButton({ onUploaded }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");
  const ref = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setError("");
    setLoading(true);
    try {
      // FIXED: Called from helper, not aboutService
      const path = await uploadImage(file); 
      onUploaded(path);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <button type="button" onClick={() => ref.current?.click()} disabled={loading}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 500, color: "#60a5fa", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 8, cursor: "pointer" }}>
        {loading ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : done ? <Check size={12} /> : <Upload size={12} />}
        {loading ? "Uploading..." : done ? "Uploaded!" : "Upload Photo"}
      </button>
      {error && <p style={{ fontSize: 11, color: "#f87171", marginTop: 4, marginBottom: 0 }}>{error}</p>}
    </div>
  );
}

// ── DGForm ────────────────────────────────────────────────────────────────────
function DGForm({ initial = {}, onSave, onCancel }) {
  const [langTab, setLangTab] = useState("en");
  const empty = {
    name_en: "", name_si: "", name_ta: "",
    title_en: "Director General", title_si: "", title_ta: "",
    department_en: "", department_si: "", department_ta: "",
    quote_en: "", quote_si: "", quote_ta: "",
    message_en: "", message_si: "", message_ta: "",
    image_path: "", initials: "", is_active: true,
  };
  const [form, setForm] = useState({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <FormCard>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {initial.name_en ? "Edit Director General" : "New Director General"}
      </p>
      <ErrorBox message={error} />
      <form onSubmit={async e => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try { await onSave(form); }
        catch (err) { setError(err.message); }
        finally { setSaving(false); }
      }}>
        <LangTabs active={langTab} onChange={setLangTab} />

        {langTab === "en" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel text="Full Name (EN)" /><input style={inputStyle} value={form.name_en} onChange={e => set("name_en", e.target.value)} required /></div>
              <div><FieldLabel text="Title (EN)" /><input style={inputStyle} value={form.title_en} onChange={e => set("title_en", e.target.value)} /></div>
            </div>
            <div><FieldLabel text="Department (EN)" /><input style={inputStyle} value={form.department_en} onChange={e => set("department_en", e.target.value)} /></div>
            <div><FieldLabel text="Pull Quote (EN)" /><textarea style={textareaStyle} value={form.quote_en} onChange={e => set("quote_en", e.target.value)} placeholder="Short inspirational quote shown on the card..." /></div>
            <div><FieldLabel text="Full Message (EN) — separate paragraphs with a blank line" /><textarea style={{ ...textareaStyle, minHeight: 180 }} value={form.message_en} onChange={e => set("message_en", e.target.value)} /></div>
          </div>
        )}
        {langTab === "si" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel text="Full Name (SI)" /><input style={inputStyle} value={form.name_si} onChange={e => set("name_si", e.target.value)} /></div>
              <div><FieldLabel text="Title (SI)" /><input style={inputStyle} value={form.title_si} onChange={e => set("title_si", e.target.value)} /></div>
            </div>
            <div><FieldLabel text="Department (SI)" /><input style={inputStyle} value={form.department_si} onChange={e => set("department_si", e.target.value)} /></div>
            <div><FieldLabel text="Pull Quote (SI)" /><textarea style={textareaStyle} value={form.quote_si} onChange={e => set("quote_si", e.target.value)} /></div>
            <div><FieldLabel text="Full Message (SI)" /><textarea style={{ ...textareaStyle, minHeight: 180 }} value={form.message_si} onChange={e => set("message_si", e.target.value)} /></div>
          </div>
        )}
        {langTab === "ta" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel text="Full Name (TA)" /><input style={inputStyle} value={form.name_ta} onChange={e => set("name_ta", e.target.value)} /></div>
              <div><FieldLabel text="Title (TA)" /><input style={inputStyle} value={form.title_ta} onChange={e => set("title_ta", e.target.value)} /></div>
            </div>
            <div><FieldLabel text="Department (TA)" /><input style={inputStyle} value={form.department_ta} onChange={e => set("department_ta", e.target.value)} /></div>
            <div><FieldLabel text="Pull Quote (TA)" /><textarea style={textareaStyle} value={form.quote_ta} onChange={e => set("quote_ta", e.target.value)} /></div>
            <div><FieldLabel text="Full Message (TA)" /><textarea style={{ ...textareaStyle, minHeight: 180 }} value={form.message_ta} onChange={e => set("message_ta", e.target.value)} /></div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 12, marginBottom: 16 }}>
          <div>
            <FieldLabel text="Photo" />
            {/* FIXED: Removed token prop as uploadImage handles it internally */}
            <ImageUploadButton onUploaded={(path) => set("image_path", path)} />
            {form.image_path && <p style={{ fontSize: 11, color: "#4ade80", marginTop: 4, marginBottom: 0, display: "flex", alignItems: "center", gap: 4 }}><Check size={11} /> Set</p>}
          </div>
          <div><FieldLabel text="Initials override (e.g. SJK)" /><input style={inputStyle} value={form.initials} onChange={e => set("initials", e.target.value)} placeholder="Auto if blank" /></div>
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

// ── OfficialForm ──────────────────────────────────────────────────────────────
function OfficialForm({ initial = {}, onSave, onCancel }) {
  const [langTab, setLangTab] = useState("en");
  const empty = {
    role_en: "", role_si: "", role_ta: "",
    name_en: "", name_si: "", name_ta: "",
    ministry_en: "", ministry_si: "", ministry_ta: "",
    phone: "", fax: "", image_path: "",
    is_active: true, sort_order: 0,
  };
  const [form, setForm] = useState({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <FormCard>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {initial.name_en ? "Edit Official" : "New Official"}
      </p>
      <ErrorBox message={error} />
      <form onSubmit={async e => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try { await onSave(form); }
        catch (err) { setError(err.message); }
        finally { setSaving(false); }
      }}>
        <LangTabs active={langTab} onChange={setLangTab} />

        {langTab === "en" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel text="Role (EN)" /><input style={inputStyle} value={form.role_en} onChange={e => set("role_en", e.target.value)} placeholder="e.g. Minister" required /></div>
              <div><FieldLabel text="Full Name (EN)" /><input style={inputStyle} value={form.name_en} onChange={e => set("name_en", e.target.value)} required /></div>
            </div>
            <div><FieldLabel text="Ministry (EN)" /><input style={inputStyle} value={form.ministry_en} onChange={e => set("ministry_en", e.target.value)} /></div>
          </div>
        )}
        {langTab === "si" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel text="Role (SI)" /><input style={inputStyle} value={form.role_si} onChange={e => set("role_si", e.target.value)} /></div>
              <div><FieldLabel text="Full Name (SI)" /><input style={inputStyle} value={form.name_si} onChange={e => set("name_si", e.target.value)} /></div>
            </div>
            <div><FieldLabel text="Ministry (SI)" /><input style={inputStyle} value={form.ministry_si} onChange={e => set("ministry_si", e.target.value)} /></div>
          </div>
        )}
        {langTab === "ta" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel text="Role (TA)" /><input style={inputStyle} value={form.role_ta} onChange={e => set("role_ta", e.target.value)} /></div>
              <div><FieldLabel text="Full Name (TA)" /><input style={inputStyle} value={form.name_ta} onChange={e => set("name_ta", e.target.value)} /></div>
            </div>
            <div><FieldLabel text="Ministry (TA)" /><input style={inputStyle} value={form.ministry_ta} onChange={e => set("ministry_ta", e.target.value)} /></div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><FieldLabel text="Phone" /><input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+94 11 2 423 771" /></div>
          <div><FieldLabel text="Fax" /><input style={inputStyle} value={form.fax} onChange={e => set("fax", e.target.value)} placeholder="+94 11 2 328 899" /></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 12, marginBottom: 16 }}>
          <div>
            <FieldLabel text="Photo" />
            <ImageUploadButton onUploaded={(path) => set("image_path", path)} />
            {form.image_path && <p style={{ fontSize: 11, color: "#4ade80", marginTop: 4, marginBottom: 0, display: "flex", alignItems: "center", gap: 4 }}><Check size={11} /> Set</p>}
          </div>
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
          <SaveButton loading={saving} isEdit={!!initial.name_en} />
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </FormCard>
  );
}

// ── DirectorGeneralSection ────────────────────────────────────────────────────
function DirectorGeneralSection() {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const reload = () => {
    setLoading(true);
    setError("");
    aboutService.getAllDirectorGenerals("en")
      .then(setRecords)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SuccessBox message={success} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <User size={17} color="#3b82f6" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Director General</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditing(null); }}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          <Plus size={13} /> New
        </button>
      </div>

      {showNew && (
        <DGForm
          onSave={async (form) => {
            // FIXED: Removed manual token passing
            await aboutService.createDirectorGeneral(toGqlDg(form));
            setShowNew(false);
            flash("Created successfully.");
            reload();
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {records.length === 0 && !showNew && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 32 }}>No record yet. Create one above.</p>
      )}

      {records.map(rec => (
        <div key={rec.id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{rec.name}</p>
              <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{rec.title}</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => { setEditing(editing?.id === rec.id ? null : rec); setShowNew(false); }}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer", color: "#60a5fa" }}>
                <Pencil size={12} />
              </button>
              <button onClick={() => setDeleting(rec)}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer", color: "#f87171" }}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          {editing?.id === rec.id && (
            <div style={{ padding: "0 20px 16px" }}>
              <DGForm
                initial={{
                  name_en: rec.nameEn,         name_si: rec.nameSi ?? "",       name_ta: rec.nameTa ?? "",
                  title_en: rec.titleEn,       title_si: rec.titleSi ?? "",     title_ta: rec.titleTa ?? "",
                  department_en: rec.departmentEn ?? "", department_si: rec.departmentSi ?? "", department_ta: rec.departmentTa ?? "",
                  quote_en: rec.quoteEn ?? "", quote_si: rec.quoteSi ?? "",     quote_ta: rec.quoteTa ?? "",
                  message_en: rec.messageEn ?? "", message_si: rec.messageSi ?? "", message_ta: rec.messageTa ?? "",
                  image_path: rec.imagePath ?? "", initials: rec.initials ?? "", is_active: rec.isActive,
                }}
                onSave={async (form) => {
                  // FIXED: Removed manual token passing
                  await aboutService.updateDirectorGeneral(rec.id, toGqlDg(form));
                  setEditing(null);
                  flash("Updated successfully.");
                  reload();
                }}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}
        </div>
      ))}

      {deleting && (
        <ConfirmDelete label={deleting.name}
          onConfirm={async () => {
            try {
              // FIXED: Removed manual token passing
              await aboutService.deleteDirectorGeneral(deleting.id);
              setDeleting(null);
              flash("Deleted.");
              reload();
            } catch (e) { setError(e.message); setDeleting(null); }
          }}
          onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

// ── MinistryOfficialsSection ──────────────────────────────────────────────────
function MinistryOfficialsSection() {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [showNew, setShowNew]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const reload = () => {
    setLoading(true);
    setError("");
    aboutService.getAllMinistryOfficials("en")
      .then(setOfficials)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SuccessBox message={success} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={17} color="#3b82f6" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Ministry Officials</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditing(null); }}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          <Plus size={13} /> New Official
        </button>
      </div>

      {showNew && (
        <OfficialForm
          onSave={async (form) => {
            // FIXED: Removed manual token passing
            await aboutService.createMinistryOfficial(toGqlOfficial(form));
            setShowNew(false);
            flash("Official created.");
            reload();
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {officials.length === 0 && !showNew && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 32 }}>No officials yet.</p>
      )}

      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {["Role", "Name", "Phone", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {officials.map(off => (
              <React.Fragment key={off.id}>
                <tr style={{ borderBottom: "1px solid #1e293b", background: editing?.id === off.id ? "#172033" : "transparent" }}>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{off.roleEn}</td>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{off.nameEn}</td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8", fontSize: 12 }}>{off.phone || "—"}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: off.isActive ? "#1a2e1a" : "#1f1215", color: off.isActive ? "#4ade80" : "#f87171", border: "1px solid " + (off.isActive ? "#14532d" : "#7f1d1d") }}>
                      {off.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditing(editing?.id === off.id ? null : off); setShowNew(false); }}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => setDeleting(off)}
                        style={{ height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>Delete</button>
                    </div>
                  </td>
                </tr>
                {editing?.id === off.id && (
                  <tr>
                    <td colSpan={5} style={{ padding: "12px 16px", background: "#172033" }}>
                      <OfficialForm
                        initial={{
                          role_en: off.roleEn,         role_si: off.roleSi ?? "",       role_ta: off.roleTa ?? "",
                          name_en: off.nameEn,         name_si: off.nameSi ?? "",       name_ta: off.nameTa ?? "",
                          ministry_en: off.ministryEn ?? "", ministry_si: off.ministrySi ?? "", ministry_ta: off.ministryTa ?? "",
                          phone: off.phone ?? "",      fax: off.fax ?? "",
                          image_path: off.imagePath ?? "", is_active: off.isActive, sort_order: off.sortOrder,
                        }}
                        onSave={async (form) => {
                          // FIXED: Removed manual token passing
                          await aboutService.updateMinistryOfficial(off.id, toGqlOfficial(form));
                          setEditing(null);
                          flash("Updated.");
                          reload();
                        }}
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
        <ConfirmDelete label={deleting.nameEn}
          onConfirm={async () => {
            try {
              // FIXED: Removed manual token passing
              await aboutService.deleteMinistryOfficial(deleting.id);
              setDeleting(null);
              flash("Deleted.");
              reload();
            } catch (e) { setError(e.message); setDeleting(null); }
          }}
          onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
const ABOUT_TABS = [
  { id: "dg",       label: "Director General",  icon: User  },
  { id: "ministry", label: "Ministry Officials", icon: Users },
];

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState("dg");

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh", padding: "32px 24px" }} className="mt-10 rounded-lg">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", gap: 4, background: "#1e293b", borderRadius: 10, padding: 4, marginBottom: 28, width: "fit-content" }}>
        {ABOUT_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer", transition: "all 0.15s", background: activeTab === tab.id ? "#2563eb" : "transparent", color: activeTab === tab.id ? "#fff" : "#64748b" }}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab === "dg"       && <DirectorGeneralSection   />}
      {activeTab === "ministry" && <MinistryOfficialsSection />}
    </div>
  );
}