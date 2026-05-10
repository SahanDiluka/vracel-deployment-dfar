// src/pages/AdminPanel.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { cmsService } from "../../services/information_service";
import {
  Plus, Pencil, Trash2, Upload, X, Check,
  ChevronDown, ChevronRight, Loader2, Table2,
  AlignLeft, Link as LinkIcon, FileText, CheckCircle, XCircle,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// TOAST SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 1000,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", borderRadius: 10, minWidth: 280, maxWidth: 380,
          pointerEvents: "all", cursor: "default",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          border: `1px solid ${t.type === "success" ? "#14532d" : "#7f1d1d"}`,
          background: t.type === "success" ? "#0f2318" : "#1a0a0a",
          animation: "slideIn 0.2s ease",
        }}>
          {t.type === "success"
            ? <CheckCircle size={16} color="#4ade80" style={{ flexShrink: 0 }} />
            : <XCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />}
          <span style={{
            fontSize: 13, color: t.type === "success" ? "#86efac" : "#fca5a5",
            flex: 1, lineHeight: 1.4,
          }}>{t.message}</span>
          <button onClick={() => onRemove(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 2,
            color: t.type === "success" ? "#4ade80" : "#f87171", flexShrink: 0,
            display: "flex", alignItems: "center",
          }}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const add = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);
  const success = useCallback((msg) => add(msg, "success"), [add]);
  const error   = useCallback((msg) => add(msg, "error"),   [add]);
  return { toasts, remove, success, error };
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED STYLES
// ══════════════════════════════════════════════════════════════════════════════

const inputStyle = {
  width: "100%", height: 38, padding: "0px 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
  boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };
const textareaStyle = {
  ...inputStyle, height: "200px", padding: "10px 12px",
  resize: "vertical", minHeight: 70,
};

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function FieldLabel({ text }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 600, color: "#64748b",
      textTransform: "uppercase", letterSpacing: "0.08em",
      marginBottom: 4, marginTop: 0,
    }}>{text}</p>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 8,
      border: "none", cursor: "pointer", transition: "all 0.15s",
      background: active ? "#2563eb" : "transparent",
      color: active ? "#fff" : "#64748b",
    }}>{label}</button>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#1f1215", border: "1px solid #7f1d1d",
      borderRadius: 8, padding: "10px 14px", marginBottom: 16,
      fontSize: 13, color: "#f87171",
    }}>{message}</div>
  );
}

function SaveButton({ loading, isEdit }) {
  return (
    <button type="submit" disabled={loading} style={{
      height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500,
      background: loading ? "#1e3a5f" : "#2563eb",
      color: loading ? "#60a5fa" : "#fff",
      border: "none", borderRadius: 8,
      cursor: loading ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      {loading
        ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
        : <Check size={13} />}
      {loading ? "Saving…" : isEdit ? "Update" : "Save"}
    </button>
  );
}

function CancelButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500,
      background: "#0f172a", color: "#94a3b8",
      border: "1px solid #334155", borderRadius: 8, cursor: "pointer",
    }}>Cancel</button>
  );
}

const LANG_TABS = [
  { code: "en", label: "EN 🇬🇧" },
  { code: "si", label: "SI 🇱🇰" },
  { code: "ta", label: "TA 🇱🇰" },
];

function LangTabs({ active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4, background: "#0f172a",
      borderRadius: 10, padding: 4, width: "fit-content", marginBottom: 16,
    }}>
      {LANG_TABS.map(t => (
        <button key={t.code} onClick={() => onChange(t.code)} type="button" style={{
          padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 7,
          border: "none", cursor: "pointer", transition: "all 0.15s",
          background: active === t.code ? "#2563eb" : "transparent",
          color: active === t.code ? "#fff" : "#64748b",
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// File input resets after each pick so same file can be re-uploaded
function FileUploadButton({ label, accept, onUploaded, onError, type = "pdf" }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const ref = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be picked again
    setLoading(true);
    try {
      const result = type === "pdf"
        ? await cmsService.uploadPdf(file)
        : await cmsService.uploadImage(file);
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
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={handleFile} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={loading}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, height: 34,
          padding: "0 14px", fontSize: 12, fontWeight: 500,
          color: "#60a5fa", background: "#172033",
          border: "1px solid #1e3a5f", borderRadius: 8, cursor: "pointer",
        }}
      >
        {loading
          ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
          : done ? <Check size={12} /> : <Upload size={12} />}
        {done ? "Uploaded!" : label}
      </button>
    </>
  );
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 50, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#1e293b", border: "1px solid #334155",
        borderRadius: 16, padding: 24, width: "100%", maxWidth: 360,
      }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>
          Delete "{label}"?
        </p>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{
            height: 34, padding: "0 16px", fontSize: 13,
            background: "#0f172a", color: "#94a3b8",
            border: "1px solid #334155", borderRadius: 8, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            height: 34, padding: "0 16px", fontSize: 13, fontWeight: 600,
            background: "#7f1d1d", color: "#fca5a5",
            border: "1px solid #991b1b", borderRadius: 8, cursor: "pointer",
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, onAdd, addLabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={17} color="#3b82f6" />
        <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{title}</p>
      </div>
      <button onClick={onAdd} style={{
        display: "flex", alignItems: "center", gap: 6, height: 34,
        padding: "0 14px", fontSize: 12, fontWeight: 600,
        background: "#2563eb", color: "#fff",
        border: "none", borderRadius: 8, cursor: "pointer",
      }}>
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}

function FormCard({ children }) {
  return (
    <div style={{
      background: "#1e293b", border: "1px solid #334155",
      borderRadius: 12, padding: "20px 24px", marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function TableCard({ count, noun, children }) {
  return (
    <div style={{
      background: "#1e293b", border: "1px solid #334155",
      borderRadius: 12, overflow: "hidden",
    }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #334155" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#64748b", margin: 0 }}>
          {count} {noun}{count !== 1 ? "s" : ""}
        </p>
      </div>
      {children}
    </div>
  );
}

function Th({ children }) {
  return (
    <th style={{
      padding: "10px 16px", textAlign: "left", fontWeight: 600,
      color: "#475569", fontSize: 11, textTransform: "uppercase",
      letterSpacing: "0.08em", borderBottom: "1px solid #334155",
    }}>{children}</th>
  );
}

function Td({ children, mono = false }) {
  return (
    <td style={{
      padding: "10px 16px", color: "#94a3b8",
      fontFamily: mono ? "monospace" : "inherit",
      fontSize: mono ? 12 : 13,
    }}>{children}</td>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <td style={{ padding: "10px 16px" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onEdit} style={{
          height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500,
          background: "#172033", color: "#60a5fa",
          border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer",
        }}>Edit</button>
        <button onClick={onDelete} style={{
          height: 30, padding: "0 12px", fontSize: 12, fontWeight: 500,
          background: "#1f1215", color: "#f87171",
          border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer",
        }}>Delete</button>
      </div>
    </td>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 48, color: "#475569", gap: 8,
    }}>
      <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading…
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROW FORM — top-level component (never defined inside another component)
// This is the KEY fix: defining it inside LinkTableSection caused React to
// destroy and recreate it on every parent re-render, resetting all state
// including the pdf_path after upload.
// ══════════════════════════════════════════════════════════════════════════════

function RowForm({ pageId, initial, onSave, onCancel, toast }) {
  const [langTab, setLangTab] = useState("en");
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState(() => ({
    page_id: pageId,
    name_en: "", name_si: "", name_ta: "",
    url: "", pdf_path: "", sort_order: 0,
    ...(initial || {}),
  }));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      background: "#172033", border: "1px solid #1e3a5f",
      borderRadius: 10, padding: "16px 20px", marginBottom: 12,
    }}>
      <LangTabs active={langTab} onChange={setLangTab} />
      <form onSubmit={async e => {
        e.preventDefault();
        setSaving(true);
        try { await onSave(form); }
        finally { setSaving(false); }
      }}>

        {/* Localised name */}
        <div style={{ marginBottom: 12 }}>
          {langTab === "en" && (
            <><FieldLabel text="Name (EN)" />
            <input style={inputStyle} value={form.name_en} onChange={e => set("name_en", e.target.value)} required /></>
          )}
          {langTab === "si" && (
            <><FieldLabel text="Name (SI)" />
            <input style={inputStyle} value={form.name_si} onChange={e => set("name_si", e.target.value)} /></>
          )}
          {langTab === "ta" && (
            <><FieldLabel text="Name (TA)" />
            <input style={inputStyle} value={form.name_ta} onChange={e => set("name_ta", e.target.value)} /></>
          )}
        </div>

        {/* URL */}
        <div style={{ marginBottom: 12 }}>
          <FieldLabel text="URL (leave blank if uploading PDF)" />
          <input
            style={inputStyle}
            value={form.url}
            placeholder="https://..."
            onChange={e => {
              set("url", e.target.value);
              if (e.target.value) set("pdf_path", "");
            }}
          />
        </div>

        {/* PDF upload */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "#475569" }}>or</span>
          <FileUploadButton
            label="Upload PDF"
            accept=".pdf,application/pdf"
            type="pdf"
            onUploaded={(path) => {
              // functional update guarantees we write to the latest state
              setForm(f => ({ ...f, pdf_path: path, url: "" }));
              toast.success("PDF uploaded successfully.");
            }}
            onError={toast.error}
          />
          {form.pdf_path && (
            <span style={{
              fontSize: 11, color: "#4ade80",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Check size={11} />
              {form.pdf_path.split("/").pop()}
              <button
                type="button"
                onClick={() => set("pdf_path", "")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#f87171", display: "flex", alignItems: "center",
                  padding: 0, marginLeft: 2,
                }}
              ><X size={11} /></button>
            </span>
          )}
        </div>

        {/* Sort order */}
        <div style={{ marginBottom: 16, width: 120 }}>
          <FieldLabel text="Sort Order" />
          <input
            style={inputStyle}
            type="number"
            value={form.sort_order}
            onChange={e => set("sort_order", +e.target.value)}
          />
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
// LINK TABLE PAGES SECTION
// ══════════════════════════════════════════════════════════════════════════════

function LinkTableSection({ toast }) {
  const [pages, setPages]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [expanded, setExpanded]         = useState(null);
  const [editingPage, setEditingPage]   = useState(null);
  const [editingRow, setEditingRow]     = useState(null);
  const [deletingPage, setDeletingPage] = useState(null);
  const [deletingRow, setDeletingRow]   = useState(null);
  const [showNewPage, setShowNewPage]   = useState(false);
  const [showNewRow, setShowNewRow]     = useState(null);
  const [langTab, setLangTab]           = useState("en");
  const [error, setError]               = useState("");

  const reload = () => {
    setLoading(true);
    cmsService.getAllLinkTablePages("en")
      .then(setPages)
      .catch(e => { setError(e.message); toast.error(e.message); })
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  // PageForm is safe inside LinkTableSection — no file upload state to lose
  function PageForm({ initial = {}, onSave, onCancel }) {
    const [form, setForm] = useState({
      nav_label_en: "", nav_label_si: "", nav_label_ta: "",
      header_en: "", header_si: "", header_ta: "",
      slug: "", is_active: true, sort_order: 0, ...initial,
    });
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
      <FormCard>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {initial.nav_label_en ? "Edit page" : "New page"}
        </p>
        <form onSubmit={async e => { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }}>
          <LangTabs active={langTab} onChange={setLangTab} />

          {langTab === "en" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><FieldLabel text="Nav Label (EN)" /><input style={inputStyle} value={form.nav_label_en} onChange={e => set("nav_label_en", e.target.value)} placeholder="e.g. Publications" required /></div>
              <div><FieldLabel text="Page Header (EN)" /><input style={inputStyle} value={form.header_en} onChange={e => set("header_en", e.target.value)} required /></div>
            </div>
          )}
          {langTab === "si" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><FieldLabel text="Nav Label (SI)" /><input style={inputStyle} value={form.nav_label_si} onChange={e => set("nav_label_si", e.target.value)} /></div>
              <div><FieldLabel text="Page Header (SI)" /><input style={inputStyle} value={form.header_si} onChange={e => set("header_si", e.target.value)} /></div>
            </div>
          )}
          {langTab === "ta" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><FieldLabel text="Nav Label (TA)" /><input style={inputStyle} value={form.nav_label_ta} onChange={e => set("nav_label_ta", e.target.value)} /></div>
              <div><FieldLabel text="Page Header (TA)" /><input style={inputStyle} value={form.header_ta} onChange={e => set("header_ta", e.target.value)} /></div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 12, marginBottom: 16 }}>
            <div><FieldLabel text="Slug" /><input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="e.g. publications" required /></div>
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
            <SaveButton loading={saving} isEdit={!!initial.nav_label_en} />
            <CancelButton onClick={onCancel} />
          </div>
        </form>
      </FormCard>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SectionHeader
        icon={Table2}
        title="Link Table Pages"
        onAdd={() => { setShowNewPage(true); setEditingPage(null); }}
        addLabel="New Page"
      />

      {showNewPage && (
        <PageForm
          onSave={async (form) => {
            try { await cmsService.createLinkTablePage(form); toast.success("Page created."); setShowNewPage(false); reload(); }
            catch (e) { toast.error(e.message); }
          }}
          onCancel={() => setShowNewPage(false)}
        />
      )}

      {pages.length === 0 && !showNewPage && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 32 }}>
          No pages yet. Create one above.
        </p>
      )}

      {pages.map(page => (
        <div key={page.id} style={{
          background: "#1e293b", border: "1px solid #334155",
          borderRadius: 12, marginBottom: 12, overflow: "hidden",
        }}>
          {/* Page header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <button
              type="button"
              onClick={() => setExpanded(expanded === page.id ? null : page.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}
            >
              {expanded === page.id
                ? <ChevronDown size={15} color="#3b82f6" />
                : <ChevronRight size={15} color="#475569" />}
              {page.navLabelEn}
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>/{page.slug}</span>
              {!page.isActive && (
                <span style={{ fontSize: 10, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 20, padding: "1px 8px" }}>
                  inactive
                </span>
              )}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => { setEditingPage(editingPage?.id === page.id ? null : page); setShowNewPage(false); }}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#172033", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer", color: "#60a5fa" }}
              ><Pencil size={12} /></button>
              <button
                onClick={() => setDeletingPage(page)}
                style={{ height: 28, width: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer", color: "#f87171" }}
              ><Trash2 size={12} /></button>
            </div>
          </div>

          {/* Inline page edit */}
          {editingPage?.id === page.id && (
            <div style={{ padding: "0 20px 16px" }}>
              <PageForm
                initial={{
                  nav_label_en: page.navLabelEn, nav_label_si: page.navLabelSi, nav_label_ta: page.navLabelTa,
                  header_en: page.headerEn, header_si: page.headerSi, header_ta: page.headerTa,
                  slug: page.slug, is_active: page.isActive, sort_order: page.sortOrder,
                }}
                onSave={async (form) => {
                  try { await cmsService.updateLinkTablePage(page.id, form); toast.success("Page updated."); setEditingPage(null); reload(); }
                  catch (e) { toast.error(e.message); }
                }}
                onCancel={() => setEditingPage(null)}
              />
            </div>
          )}

          {/* Expanded rows */}
          {expanded === page.id && (
            <div style={{ borderTop: "1px solid #334155", padding: "16px 20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
                <thead>
                  <tr style={{ background: "#0f172a" }}>
                    <Th>#</Th><Th>Name (EN)</Th><Th>Link / PDF</Th><Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {page.rows.map((row, i) => (
                    // React.Fragment with key = correct way to group sibling <tr> elements
                    // Using <tbody key> caused nested <tbody> which browsers silently drop
                    <React.Fragment key={row.id}>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        <Td><span style={{ color: "#475569" }}>{i + 1}</span></Td>
                        <td style={{ padding: "10px 16px", fontWeight: 500, color: "#e2e8f0" }}>{row.nameEn}</td>
                        <Td>
                          {row.pdfPath
                            ? <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#4ade80" }}>
                                <FileText size={11} /> PDF
                              </span>
                            : <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <LinkIcon size={11} />
                                <span style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                                  {row.url}
                                </span>
                              </span>
                          }
                        </Td>
                        <ActionButtons
                          onEdit={() => setEditingRow(editingRow?.id === row.id ? null : row)}
                          onDelete={() => setDeletingRow(row)}
                        />
                      </tr>

                      {/* Inline row edit */}
                      {editingRow?.id === row.id && (
                        <tr>
                          <td colSpan={4} style={{ padding: 0, background: "#0f1f33" }}>
                            <div style={{ padding: "12px 16px" }}>
                              <RowForm
                                key={row.id}
                                pageId={page.id}
                                toast={toast}
                                initial={{
                                  name_en: row.nameEn,
                                  name_si: row.nameSi ?? "",
                                  name_ta: row.nameTa ?? "",
                                  url: row.url ?? "",
                                  pdf_path: row.pdfPath ?? "",
                                  sort_order: row.sortOrder,
                                }}
                                onSave={async (form) => {
                                  try {
                                    const { page_id, ...d } = form;
                                    await cmsService.updateLinkTableRow(row.id, d);
                                    toast.success("Row updated.");
                                    setEditingRow(null); reload();
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

              {/* New row form — rendered below the table, never inside it */}
              {showNewRow === page.id ? (
                <RowForm
                  key={`new-${page.id}`}
                  pageId={page.id}
                  toast={toast}
                  initial={null}
                  onSave={async (form) => {
                    try { await cmsService.createLinkTableRow(form); toast.success("Row added."); setShowNewRow(null); reload(); }
                    catch (e) { toast.error(e.message); }
                  }}
                  onCancel={() => setShowNewRow(null)}
                />
              ) : (
                <button
                  onClick={() => setShowNewRow(page.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}
                >
                  <Plus size={13} /> Add Row
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {deletingPage && (
        <ConfirmDelete
          label={deletingPage.navLabelEn}
          onConfirm={async () => {
            try { await cmsService.deleteLinkTablePage(deletingPage.id); toast.success("Page deleted."); setDeletingPage(null); reload(); }
            catch (e) { toast.error(e.message); setDeletingPage(null); }
          }}
          onCancel={() => setDeletingPage(null)}
        />
      )}
      {deletingRow && (
        <ConfirmDelete
          label={deletingRow.nameEn}
          onConfirm={async () => {
            try { await cmsService.deleteLinkTableRow(deletingRow.id); toast.success("Row deleted."); setDeletingRow(null); reload(); }
            catch (e) { toast.error(e.message); setDeletingRow(null); }
          }}
          onCancel={() => setDeletingRow(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NORMAL PAGES SECTION
// ══════════════════════════════════════════════════════════════════════════════

function NormalPagesSection({ toast }) {
  const [pages, setPages]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [langTab, setLangTab]   = useState("en");
  const [error, setError]       = useState("");

  const reload = () => {
    setLoading(true);
    cmsService.getAllNormalPages("en")
      .then(setPages)
      .catch(e => { setError(e.message); toast.error(e.message); })
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  function PageForm({ initial = {}, onSave, onCancel }) {
    const empty = {
      nav_label_en: "", nav_label_si: "", nav_label_ta: "",
      header_en: "", header_si: "", header_ta: "",
      description_en: "", description_si: "", description_ta: "",
      second_header_en: "", second_header_si: "", second_header_ta: "",
      image_path: "", button_label_en: "", button_label_si: "", button_label_ta: "",
      button_url: "", slug: "", is_active: true, sort_order: 0,
    };
    const [form, setForm] = useState({ ...empty, ...initial });
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    

    return (
      <FormCard>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {initial.nav_label_en ? "Edit page" : "New page"}
        </p>
        <form onSubmit={async e => { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }}>
          <LangTabs active={langTab} onChange={setLangTab} />

          {langTab === "en" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><FieldLabel text="Nav Label (EN)" /><input style={inputStyle} value={form.nav_label_en} onChange={e => set("nav_label_en", e.target.value)} required /></div>
                <div><FieldLabel text="Header (EN)" /><input style={inputStyle} value={form.header_en} onChange={e => set("header_en", e.target.value)} required /></div>
              </div>
              <div><FieldLabel text="Description (EN)" /><textarea style={textareaStyle} value={form.description_en} onChange={e => set("description_en", e.target.value)} required /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><FieldLabel text="Second Header (EN)" /><textarea style={textareaStyle} value={form.second_header_en} onChange={e => set("second_header_en", e.target.value)} /></div>
                <div><FieldLabel text="Button Label (EN)" /><textarea style={textareaStyle} value={form.button_label_en} onChange={e => set("button_label_en", e.target.value)} /></div>
              </div>
            </div>
          )}
          {langTab === "si" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><FieldLabel text="Nav Label (SI)" /><input style={inputStyle} value={form.nav_label_si} onChange={e => set("nav_label_si", e.target.value)} /></div>
                <div><FieldLabel text="Header (SI)" /><input style={inputStyle} value={form.header_si} onChange={e => set("header_si", e.target.value)} /></div>
              </div>
              <div><FieldLabel text="Description (SI)" /><textarea style={textareaStyle} value={form.description_si} onChange={e => set("description_si", e.target.value)} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><FieldLabel text="Second Header (SI)" /><input style={inputStyle} value={form.second_header_si} onChange={e => set("second_header_si", e.target.value)} /></div>
                <div><FieldLabel text="Button Label (SI)" /><input style={inputStyle} value={form.button_label_si} onChange={e => set("button_label_si", e.target.value)} /></div>
              </div>
            </div>
          )}
          {langTab === "ta" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><FieldLabel text="Nav Label (TA)" /><input style={inputStyle} value={form.nav_label_ta} onChange={e => set("nav_label_ta", e.target.value)} /></div>
                <div><FieldLabel text="Header (TA)" /><input style={inputStyle} value={form.header_ta} onChange={e => set("header_ta", e.target.value)} /></div>
              </div>
              <div><FieldLabel text="Description (TA)" /><textarea style={textareaStyle} value={form.description_ta} onChange={e => set("description_ta", e.target.value)} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><FieldLabel text="Second Header (TA)" /><input style={inputStyle} value={form.second_header_ta} onChange={e => set("second_header_ta", e.target.value)} /></div>
                <div><FieldLabel text="Button Label (TA)" /><input style={inputStyle} value={form.button_label_ta} onChange={e => set("button_label_ta", e.target.value)} /></div>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><FieldLabel text="Button URL" /><input style={inputStyle} value={form.button_url} onChange={e => set("button_url", e.target.value)} placeholder="https://..." /></div>
            <div>
              <FieldLabel text="Page Image" />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileUploadButton
                  label="Upload Image" accept="image/*" type="image"
                  onUploaded={(path) => { set("image_path", path); toast.success("Image uploaded."); }}
                  onError={toast.error}
                />
                {form.image_path && (
                  <span style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
                    <Check size={11} /> Image set
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 12, marginBottom: 16 }}>
            <div><FieldLabel text="Slug" /><input style={inputStyle} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="e.g. fisheries-management" required /></div>
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
            <SaveButton loading={saving} isEdit={!!initial.nav_label_en} />
            <CancelButton onClick={onCancel} />
          </div>
        </form>
      </FormCard>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SectionHeader
        icon={AlignLeft}
        title="Normal Pages"
        onAdd={() => { setShowNew(true); setEditing(null); }}
        addLabel="New Page"
      />

      {showNew && (
        <PageForm
          onSave={async (form) => {
            try { await cmsService.createNormalPage(form); toast.success("Page created."); setShowNew(false); reload(); }
            catch (e) { toast.error(e.message); }
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {pages.length === 0 && !showNew && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 32 }}>No pages yet.</p>
      )}

      <TableCard count={pages.length} noun="page">
        {pages.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <Th>Nav Label</Th><Th>Slug</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <React.Fragment key={page.id}>
                  <tr style={{ borderBottom: "1px solid #1e293b", background: editing?.id === page.id ? "#172033" : "transparent" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{page.navLabelEn}</td>
                    <Td>/{page.slug}</Td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 10px", borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                        background: page.isActive ? "#1a2e1a" : "#1f1215",
                        color: page.isActive ? "#4ade80" : "#f87171",
                        border: `1px solid ${page.isActive ? "#14532d" : "#7f1d1d"}`,
                      }}>
                        {page.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <ActionButtons
                      onEdit={() => { setEditing(editing?.id === page.id ? null : page); setShowNew(false); }}
                      onDelete={() => setDeleting(page)}
                    />
                  </tr>
                  {editing?.id === page.id && (
                    <tr>
                      <td colSpan={4} style={{ padding: "12px 16px", background: "#172033" }}>
                        <PageForm
                          initial={{
                            nav_label_en: page.navLabelEn, nav_label_si: page.navLabelSi, nav_label_ta: page.navLabelTa,
                            header_en: page.headerEn, header_si: page.headerSi, header_ta: page.headerTa,
                            description_en: page.descriptionEn, description_si: page.descriptionSi, description_ta: page.descriptionTa,
                            second_header_en: page.secondHeaderEn, second_header_si: page.secondHeaderSi, second_header_ta: page.secondHeaderTa,
                            button_label_en: page.buttonLabelEn, button_label_si: page.buttonLabelSi, button_label_ta: page.buttonLabelTa,
                            button_url: page.buttonUrl, image_path: page.imagePath,
                            slug: page.slug, is_active: page.isActive, sort_order: page.sortOrder,
                          }}
                          onSave={async (form) => {
                            try { await cmsService.updateNormalPage(page.id, form); toast.success("Page updated."); setEditing(null); reload(); }
                            catch (e) { toast.error(e.message); }
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
        )}
      </TableCard>

      {deleting && (
        <ConfirmDelete
          label={deleting.navLabelEn}
          onConfirm={async () => {
            try { await cmsService.deleteNormalPage(deleting.id); toast.success("Page deleted."); setDeleting(null); reload(); }
            catch (e) { toast.error(e.message); setDeleting(null); }
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DIRECT LINK PAGES SECTION
// ══════════════════════════════════════════════════════════════════════════════

function DirectLinkSection({ toast }) {
  const [pages, setPages]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showNew, setShowNew]   = useState(false);
  const [langTab, setLangTab]   = useState("en");
  const [error, setError]       = useState("");

  const reload = () => {
    setLoading(true);
    cmsService.getAllDirectLinkPages("en")
      .then(setPages)
      .catch(e => { setError(e.message); toast.error(e.message); })
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  function PageForm({ initial = {}, onSave, onCancel }) {
    const [form, setForm] = useState({
      nav_label_en: "", nav_label_si: "", nav_label_ta: "",
      url: "", is_active: true, sort_order: 0, ...initial,
    });
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
      <FormCard>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {initial.nav_label_en ? "Edit link" : "New direct link"}
        </p>
        <form onSubmit={async e => { e.preventDefault(); setSaving(true); try { await onSave(form); } finally { setSaving(false); } }}>
          <LangTabs active={langTab} onChange={setLangTab} />
          <div style={{ marginBottom: 12 }}>
            {langTab === "en" && <><FieldLabel text="Nav Label (EN)" /><input style={inputStyle} value={form.nav_label_en} onChange={e => set("nav_label_en", e.target.value)} required /></>}
            {langTab === "si" && <><FieldLabel text="Nav Label (SI)" /><input style={inputStyle} value={form.nav_label_si} onChange={e => set("nav_label_si", e.target.value)} /></>}
            {langTab === "ta" && <><FieldLabel text="Nav Label (TA)" /><input style={inputStyle} value={form.nav_label_ta} onChange={e => set("nav_label_ta", e.target.value)} /></>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 12, marginBottom: 16 }}>
            <div><FieldLabel text="External URL" /><input style={inputStyle} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." required /></div>
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
            <SaveButton loading={saving} isEdit={!!initial.nav_label_en} />
            <CancelButton onClick={onCancel} />
          </div>
        </form>
      </FormCard>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBox message={error} />
      <SectionHeader
        icon={LinkIcon}
        title="Direct Link Pages"
        onAdd={() => { setShowNew(true); setEditing(null); }}
        addLabel="New Link"
      />

      {showNew && (
        <PageForm
          onSave={async (form) => {
            try { await cmsService.createDirectLinkPage(form); toast.success("Link created."); setShowNew(false); reload(); }
            catch (e) { toast.error(e.message); }
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {pages.length === 0 && !showNew && (
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, padding: 32 }}>No direct links yet.</p>
      )}

      <TableCard count={pages.length} noun="link">
        {pages.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <Th>Nav Label</Th><Th>URL</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <React.Fragment key={page.id}>
                  <tr style={{ borderBottom: "1px solid #1e293b", background: editing?.id === page.id ? "#172033" : "transparent" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{page.navLabelEn}</td>
                    <td style={{ padding: "10px 16px", maxWidth: 300 }}>
                      <span style={{ color: "#3b82f6", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                        {page.url}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 10px", borderRadius: 20,
                        fontSize: 11, fontWeight: 600,
                        background: page.isActive ? "#1a2e1a" : "#1f1215",
                        color: page.isActive ? "#4ade80" : "#f87171",
                        border: `1px solid ${page.isActive ? "#14532d" : "#7f1d1d"}`,
                      }}>
                        {page.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <ActionButtons
                      onEdit={() => { setEditing(editing?.id === page.id ? null : page); setShowNew(false); }}
                      onDelete={() => setDeleting(page)}
                    />
                  </tr>
                  {editing?.id === page.id && (
                    <tr>
                      <td colSpan={4} style={{ padding: "12px 16px", background: "#172033" }}>
                        <PageForm
                          initial={{
                            nav_label_en: page.navLabelEn, nav_label_si: page.navLabelSi, nav_label_ta: page.navLabelTa,
                            url: page.url, is_active: page.isActive, sort_order: page.sortOrder,
                          }}
                          onSave={async (form) => {
                            try { await cmsService.updateDirectLinkPage(page.id, form); toast.success("Link updated."); setEditing(null); reload(); }
                            catch (e) { toast.error(e.message); }
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
        )}
      </TableCard>

      {deleting && (
        <ConfirmDelete
          label={deleting.navLabelEn}
          onConfirm={async () => {
            try { await cmsService.deleteDirectLinkPage(deleting.id); toast.success("Link deleted."); setDeleting(null); reload(); }
            catch (e) { toast.error(e.message); setDeleting(null); }
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id: "table",  label: "Link Table Pages", icon: Table2 },
  { id: "normal", label: "Normal Pages",     icon: AlignLeft },
  { id: "direct", label: "Direct Links",     icon: LinkIcon },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("table");
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

      {/* Centered content */}
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>
            Information Pages Management
          </h2>
        </div>

        <div style={{ display: "flex", gap: 4, background: "#1e293b", borderRadius: 10, padding: 4, marginBottom: 28, width: "fit-content" }}>
          {TABS.map(tab => (
            <Tab key={tab.id} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
        </div>

        {activeTab === "table"  && <LinkTableSection  toast={toast} />}
        {activeTab === "normal" && <NormalPagesSection toast={toast} />}
        {activeTab === "direct" && <DirectLinkSection  toast={toast} />}
      </div>
    </div>
  );
}