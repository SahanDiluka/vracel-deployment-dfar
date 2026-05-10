import React, { useEffect, useState, useRef } from "react";
import { divisionService } from "../../services/division_service";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" },
];

const EMPTY = {
  topic: "", title: "", description: "",
  link: "", intro: "", details: "",
  language: "en",
  picture: null, image1: null,
};

function ImageUpload({ label, file, preview, onFile, onClear, keepHint }) {
  const ref = useRef();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", fontSize: 13, fontWeight: 500, border: "1px solid #334155", borderRadius: 8, cursor: "pointer", background: "#1e293b", color: "#94a3b8", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#60a5fa"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {file ? file.name : "Choose image"}
          <input ref={ref} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files[0]; if (f) onFile(f); }} />
        </label>

        {preview && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={preview} alt="preview" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
            <button type="button" onClick={() => { onClear(); if (ref.current) ref.current.value = ""; }}
              style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
              Remove
            </button>
          </div>
        )}

        {keepHint && !file && (
          <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Leave blank to keep current</p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", height: 38, padding: "0 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
};

const textareaStyle = {
  ...inputStyle, height: "auto", padding: "10px 12px",
  resize: "vertical", minHeight: 80,
};

const selectStyle = {
  ...inputStyle, cursor: "pointer",
};

function FieldLabel({ text }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 0 }}>
      {text}
    </p>
  );
}

const langLabel = (code) => LANGUAGES.find(l => l.value === code)?.label ?? code;

export default function AdminDivisions() {
  const [items, setItems]         = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [fields, setFields]       = useState(EMPTY);
  const [previews, setPreviews]   = useState({ picture: null, image1: null });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const load = async () => {
    try {
      setItems(await divisionService.getAll());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const setField   = (key, val) => setFields(f => ({ ...f, [key]: val }));
  const setImage   = (key, file) => {
    setField(key, file);
    setPreviews(p => ({ ...p, [key]: URL.createObjectURL(file) }));
  };
  const clearImage = (key) => {
    setField(key, null);
    setPreviews(p => ({ ...p, [key]: null }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFields({
      topic: item.topic, title: item.title ?? "",
      description: item.description ?? "", link: item.link ?? "",
      intro: item.intro ?? "", details: item.details ?? "",
      language: item.language ?? "en",
      picture: null, image1: null,
    });
    setPreviews({ picture: item.pictureUrl, image1: item.image1Url });
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setFields(EMPTY);
    setPreviews({ picture: null, image1: null });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await divisionService.update(editingId, fields);
      } else {
        await divisionService.create(fields);
      }
      handleCancel();
      await load();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this division?")) return;
    try {
      await divisionService.delete(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const focusStyle = `
    input:focus, textarea:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
    input::placeholder, textarea::placeholder { color: #475569; }
    select option { background: #1e293b; color: #e2e8f0; }
    * { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
    *::-webkit-scrollbar { width: 6px; } *::-webkit-scrollbar-track { background: #0f172a; } *::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  `;

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6" style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh" }}>
      <style>{focusStyle}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", fontFamily: "'Merriweather', serif", margin: 0 }}>
          Divisions — Admin
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {editingId ? "Edit division" : "Add new division"}
        </p>

        {/* Row 1 — topic + title + language */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 12, marginBottom: 12 }}>
          <div>
            <FieldLabel text="Topic *" />
            <input style={inputStyle} type="text" placeholder="e.g. Fisheries Management"
              value={fields.topic} onChange={e => setField("topic", e.target.value)} required />
          </div>
          <div>
            <FieldLabel text="Title *" />
            <input style={inputStyle} type="text" placeholder="e.g. Fisheries Management Division"
              value={fields.title} onChange={e => setField("title", e.target.value)} required />
          </div>
          <div>
            <FieldLabel text="Language *" />
            <select style={selectStyle} value={fields.language} onChange={e => setField("language", e.target.value)} required>
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 — description */}
        <div style={{ marginBottom: 12 }}>
          <FieldLabel text="Description" />
          <textarea style={textareaStyle} placeholder="Short description shown on cards..."
            value={fields.description} onChange={e => setField("description", e.target.value)} />
        </div>

        {/* Row 3 — intro + details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <FieldLabel text="Intro" />
            <textarea style={{ ...textareaStyle, minHeight: 100 }}
              placeholder="Introduction paragraph for the detail page..."
              value={fields.intro} onChange={e => setField("intro", e.target.value)} />
          </div>
          <div>
            <FieldLabel text="Details" />
            <textarea style={{ ...textareaStyle, minHeight: 100 }}
              placeholder="Full body content..."
              value={fields.details} onChange={e => setField("details", e.target.value)} />
          </div>
        </div>

        {/* Row 4 — images */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <ImageUpload label="Card picture" file={fields.picture} preview={previews.picture}
            onFile={f => setImage("picture", f)} onClear={() => clearImage("picture")} keepHint={!!editingId} />
          <ImageUpload label="Detail page image" file={fields.image1} preview={previews.image1}
            onFile={f => setImage("image1", f)} onClear={() => clearImage("image1")} keepHint={!!editingId} />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading} style={{
            height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500,
            background: loading ? "#1e3a5f" : "#2563eb", color: loading ? "#60a5fa" : "#fff",
            border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.15s",
          }}>
            {loading ? "Saving…" : editingId ? "Update division" : "Add division"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{
              height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500,
              background: "#0f172a", color: "#94a3b8", border: "1px solid #334155",
              borderRadius: 8, cursor: "pointer", transition: "background 0.15s",
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", margin: 0 }}>
            {items.length} division{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#475569", fontSize: 13 }}>
            No divisions yet. Add one above.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Picture", "Topic", "Title", "Language", "Description", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} style={{
                  borderBottom: i < items.length - 1 ? "1px solid #1e293b" : "none",
                  background: editingId === item.id ? "#172033" : "transparent",
                  transition: "background 0.15s",
                }}>
                  <td style={{ padding: "10px 16px" }}>
                    {item.pictureUrl
                      ? <img src={item.pictureUrl} alt={item.topic} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
                      : <div style={{ width: 44, height: 44, borderRadius: 6, background: "#0f172a", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#334155" strokeWidth="1.5"/>
                            <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                    }
                  </td>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{item.topic}</td>
                  <td style={{ padding: "10px 16px", color: "#cbd5e1", maxWidth: 160 }}>{item.title}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      display: "inline-block", padding: "2px 10px", borderRadius: 20,
                      fontSize: 11, fontWeight: 600,
                      background: item.language === "en" ? "#172033" : item.language === "si" ? "#1a2e1a" : "#2a1f0e",
                      color: item.language === "en" ? "#60a5fa" : item.language === "si" ? "#4ade80" : "#fb923c",
                      border: `1px solid ${item.language === "en" ? "#1e3a5f" : item.language === "si" ? "#14532d" : "#7c2d12"}`,
                    }}>
                      {langLabel(item.language)}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#64748b", maxWidth: 200 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(item)} style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}