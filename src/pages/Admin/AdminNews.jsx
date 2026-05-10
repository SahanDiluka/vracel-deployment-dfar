import React, { useEffect, useState, useRef } from "react";
import { newsService } from "../../services/news_service";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" },
];

export default function AdminNews() {
  const [items, setItems]         = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [topic, setTopic]         = useState("");
  const [description, setDesc]    = useState("");
  const [language, setLanguage]   = useState("en");
  const [picture, setPicture]     = useState(null);
  const [preview, setPreview]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const fileRef                   = useRef();

  const load = async () => {
    try {
      setItems(await newsService.getAll());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTopic(item.topic);
    setDesc(item.description ?? "");
    setLanguage(item.language ?? "en");
    setPicture(null);
    setPreview(item.pictureUrl);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCancel = () => {
    setEditingId(null);
    setTopic("");
    setDesc("");
    setLanguage("en");
    setPicture(null);
    setPreview(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await newsService.update(editingId, { topic, description, picture, language });
      } else {
        await newsService.create({ topic, description, picture, language });
      }
      handleCancel();
      await load();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      await newsService.delete(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const langLabel = (code) => LANGUAGES.find(l => l.value === code)?.label ?? code;

  return (
    <div className="max-w-4xl mt-6 mx-auto p-6" style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh" }}>
      <style>{`
        .n-input {
          width: 100%; padding: 0 12px; font-size: 13px;
          border: 1px solid #334155; border-radius: 8px; outline: none;
          background: #1e293b; color: #e2e8f0; height: 38px;
          transition: border-color 0.15s; box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        .n-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .n-input::placeholder { color: #475569; }
        .n-select {
          width: 100%; padding: 0 12px; font-size: 13px;
          border: 1px solid #334155; border-radius: 8px; outline: none;
          background: #1e293b; color: #e2e8f0; height: 38px;
          transition: border-color 0.15s; box-sizing: border-box;
          font-family: 'Inter', sans-serif; cursor: pointer;
        }
        .n-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .n-select option { background: #1e293b; color: #e2e8f0; }
        .n-textarea {
          width: 100%; padding: 10px 12px; font-size: 13px;
          border: 1px solid #334155; border-radius: 8px; outline: none;
          background: #1e293b; color: #e2e8f0;
          transition: border-color 0.15s; box-sizing: border-box;
          font-family: 'Inter', sans-serif; resize: vertical; min-height: 100px;
        }
        .n-textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .n-textarea::placeholder { color: #475569; }
        .n-btn { height: 36px; padding: 0 16px; font-size: 13px; font-weight: 500; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
        .n-btn-primary  { background: #2563eb; color: #fff; }
        .n-btn-primary:hover { background: #1d4ed8; }
        .n-btn-primary:disabled { background: #1e3a5f; color: #60a5fa; cursor: not-allowed; }
        .n-btn-secondary { background: #0f172a; color: #94a3b8; border: 1px solid #334155; }
        .n-btn-secondary:hover { background: #1e293b; }
        .n-btn-edit   { background: #172033; color: #60a5fa; border: 1px solid #1e3a5f; }
        .n-btn-edit:hover { background: #1e3a5f; }
        .n-btn-delete { background: #1f1215; color: #f87171; border: 1px solid #7f1d1d; }
        .n-btn-delete:hover { background: #2d1a1a; }
        .file-label {
          display: inline-flex; align-items: center; gap: 6px;
          height: 36px; padding: 0 14px; font-size: 13px; font-weight: 500;
          border: 1px solid #334155; border-radius: 8px; cursor: pointer;
          background: #1e293b; color: #94a3b8; transition: all 0.15s;
        }
        .file-label:hover { background: #172033; border-color: #3b82f6; color: #60a5fa; }
        * { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", fontFamily: "'Merriweather', serif", margin: 0 }}>
          News — Admin
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
          {editingId ? "Edit news item" : "Add new item"}
        </p>

        {/* Topic + Language row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12, marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Topic *</p>
            <input
              className="n-input"
              type="text"
              placeholder="e.g. Sustainable Fishing Initiative Launched"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Language *</p>
            <select
              className="n-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              required
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Description</p>
          <textarea
            className="n-textarea"
            placeholder="News description..."
            value={description}
            onChange={e => setDesc(e.target.value)}
          />
        </div>

        {/* Picture upload */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Picture</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label className="file-label">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {picture ? picture.name : "Choose image"}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </label>

            {preview && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={preview} alt="preview" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
                <button type="button"
                  onClick={() => { setPicture(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            )}

            {editingId && !picture && (
              <p style={{ fontSize: 11, color: "#475569" }}>Leave blank to keep current</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="n-btn n-btn-primary" disabled={loading}>
            {loading ? "Saving…" : editingId ? "Update item" : "Add item"}
          </button>
          {editingId && (
            <button type="button" className="n-btn n-btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", margin: 0 }}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#475569", fontSize: 13 }}>
            No news yet. Add one above.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Picture", "Topic", "Language", "Description", "Actions"].map(h => (
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
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9", maxWidth: 180 }}>
                    {item.topic}
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
                  <td style={{ padding: "10px 16px", color: "#64748b", maxWidth: 260 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="n-btn n-btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="n-btn n-btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
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