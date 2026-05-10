import React, { useEffect, useState, useRef } from "react";
import { quickAccessService } from "../../services/home_quickacsess";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" },
];

const langLabel = (code) => LANGUAGES.find(l => l.value === code)?.label ?? code;

export default function AdminQuickAccess() {
  const [items, setItems]           = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [name, setName]             = useState("");
  const [link, setLink]             = useState("");
  const [language, setLanguage]     = useState("en");
  const [icon, setIcon]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [nameError, setNameError]   = useState("");
  const fileRef                     = useRef();

  const load = async () => {
    try {
      const data = await quickAccessService.getAll();
      setItems(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIcon(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setLink(item.link);
    setLanguage(item.language ?? "en");
    setIcon(null);
    setPreview(item.iconUrl);
    setError("");
    setNameError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setLink("");
    setLanguage("en");
    setIcon(null);
    setPreview(null);
    setError("");
    setNameError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (val.length > 30) {
      setNameError("Title must be 30 characters or less");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length > 30) {
      setNameError("Title must be 30 characters or less");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await quickAccessService.update(editingId, { name, link, icon, language });
      } else {
        await quickAccessService.create({ name, link, icon, language });
      }
      handleCancel();
      await load();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await quickAccessService.delete(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6" style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh" }}>
      <style>{`
        .qa-input {
          width: 100%; height: 38px; padding: 0 12px; font-size: 13px;
          border: 1px solid #334155; border-radius: 8px; outline: none;
          background: #1e293b; color: #e2e8f0; transition: border-color 0.15s;
          box-sizing: border-box; font-family: 'Inter', sans-serif;
        }
        .qa-input::placeholder { color: #475569; }
        .qa-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .qa-input.error { border-color: #f87171; }
        .qa-select {
          width: 100%; height: 38px; padding: 0 12px; font-size: 13px;
          border: 1px solid #334155; border-radius: 8px; outline: none;
          background: #1e293b; color: #e2e8f0; transition: border-color 0.15s;
          box-sizing: border-box; font-family: 'Inter', sans-serif; cursor: pointer;
        }
        .qa-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .qa-select option { background: #1e293b; color: #e2e8f0; }
        .qa-btn { height: 36px; padding: 0 16px; font-size: 13px; font-weight: 500; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
        .qa-btn-primary   { background: #2563eb; color: #fff; }
        .qa-btn-primary:hover   { background: #1d4ed8; }
        .qa-btn-primary:disabled { background: #1e3a5f; color: #60a5fa; cursor: not-allowed; }
        .qa-btn-secondary { background: #0f172a; color: #94a3b8; border: 1px solid #334155; }
        .qa-btn-secondary:hover { background: #1e293b; }
        .qa-btn-edit   { background: #172033; color: #60a5fa; border: 1px solid #1e3a5f; }
        .qa-btn-edit:hover { background: #1e3a5f; }
        .qa-btn-delete { background: #1f1215; color: #f87171; border: 1px solid #7f1d1d; }
        .qa-btn-delete:hover { background: #2d1a1a; }
        .file-label {
          display: inline-flex; align-items: center; gap: 6px;
          height: 36px; padding: 0 14px; font-size: 13px; font-weight: 500;
          border: 1px solid #334155; border-radius: 8px; cursor: pointer;
          background: #1e293b; color: #94a3b8; transition: all 0.15s;
        }
        .file-label:hover { background: #172033; border-color: #3b82f6; color: #60a5fa; }
        * { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-track { background: #0f172a; }
        *::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", fontFamily: "'Merriweather', serif" }}>
          Quick Home Access — Admin
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
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {editingId ? "Edit item" : "Add new item"}
        </p>

        {/* Row 1 — name + link + language */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 12, marginBottom: 12 }}>

          {/* Name with char counter */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ position: "relative" }}>
              <input
                className={`qa-input ${nameError ? "error" : ""}`}
                type="text" placeholder="Title"
                value={name} onChange={handleNameChange}
                maxLength={35} required
              />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: name.length > 30 ? "#f87171" : "#475569", pointerEvents: "none" }}>
                {name.length}/30
              </span>
            </div>
            {nameError && <p style={{ fontSize: 11, color: "#f87171", margin: 0 }}>{nameError}</p>}
          </div>

          <input
            className="qa-input"
            type="text" placeholder="Link (e.g. /services/departure)"
            value={link} onChange={e => setLink(e.target.value)} required
          />

          <select className="qa-select" value={language} onChange={e => setLanguage(e.target.value)} required>
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* File row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <label className="file-label">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {icon ? icon.name : "Choose icon"}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleIconChange} />
          </label>

          {preview && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={preview} alt="preview" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 6, border: "1px solid #334155" }} />
              <button type="button" onClick={() => { setIcon(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                Remove
              </button>
            </div>
          )}

          {editingId && !icon && (
            <p style={{ fontSize: 11, color: "#475569" }}>Leave blank to keep current icon</p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="qa-btn qa-btn-primary" disabled={loading || !!nameError}>
            {loading ? "Saving…" : editingId ? "Update item" : "Add item"}
          </button>
          {editingId && (
            <button type="button" className="qa-btn qa-btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8" }}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#475569", fontSize: 13 }}>
            No items yet. Add one above.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Icon", "Title", "Language", "Link", "Actions"].map(h => (
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
                    <img src={item.iconUrl} alt={item.name} style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 6, border: "1px solid #334155" }} />
                  </td>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>
                    {item.name}
                  </td>
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
                  <td style={{ padding: "10px 16px", color: "#3b82f6", fontFamily: "monospace", fontSize: 12 }}>
                    {item.link}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="qa-btn qa-btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="qa-btn qa-btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
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