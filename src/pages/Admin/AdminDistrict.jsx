import React, { useEffect, useState, useRef } from "react";
import { districtService } from "../../services/district_service";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: 38, padding: "0 12px", fontSize: 13,
  border: "1px solid #334155", borderRadius: 8, outline: "none",
  background: "#1e293b", color: "#e2e8f0", transition: "border-color 0.15s",
  boxSizing: "border-box", fontFamily: "'Inter', sans-serif",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };
const textareaStyle = { ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", minHeight: 70 };

function FieldLabel({ text }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 0 }}>
      {text}
    </p>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 8,
      border: "none", cursor: "pointer", transition: "all 0.15s",
      background: active ? "#2563eb" : "transparent",
      color: active ? "#fff" : "#64748b",
    }}>
      {label}
    </button>
  );
}

// ── District form ─────────────────────────────────────────────────────────────
const DISTRICT_EMPTY = {
  area: "", areaWide: "", activeFishermen: "", fisheriesFamilies: "",
  multidayBoats: "", smallFiberGlassBoats: "", mechanizedTraditional: "",
  nonMechanizedTraditional: "", odayBoats: "", beachSeinBoats: "",
  landingSites: "", googleMapsLink: "", active: true, image: null,
  // ── NEW ──────────────────────
  adImage: null, nameEn: "", nameSi: "", nameTa: "",
  // ─────────────────────────────
};

function DistrictTab() {
  const [items, setItems]             = useState([]);
  const [editingId, setEditingId]     = useState(null);
  const [fields, setFields]           = useState(DISTRICT_EMPTY);
  const [preview, setPreview]         = useState(null);
  const [adPreview, setAdPreview]     = useState(null);   // ← NEW
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const fileRef                       = useRef();
  const adFileRef                     = useRef();          // ← NEW

  const load = async () => {
    try { setItems(await districtService.getAll()); }
    catch (e) { setError(e.message); }
  };

  useEffect(() => { load(); }, []);

  const setF = (k, v) => setFields(f => ({ ...f, [k]: v }));

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFields({
      area: item.area, areaWide: item.areaWide ?? "",
      activeFishermen: item.activeFishermen ?? "", fisheriesFamilies: item.fisheriesFamilies ?? "",
      multidayBoats: item.multidayBoats ?? "", smallFiberGlassBoats: item.smallFiberGlassBoats ?? "",
      mechanizedTraditional: item.mechanizedTraditional ?? "", nonMechanizedTraditional: item.nonMechanizedTraditional ?? "",
      odayBoats: item.odayBoats ?? "", beachSeinBoats: item.beachSeinBoats ?? "",
      landingSites: item.landingSites ?? "", googleMapsLink: item.googleMapsLink ?? "",
      active: item.active, image: null,
      // ── NEW ──────────────────────────────────────────────────────────────
      adImage: null,
      nameEn: item.nameEn ?? "", nameSi: item.nameSi ?? "", nameTa: item.nameTa ?? "",
      // ─────────────────────────────────────────────────────────────────────
    });
    setPreview(item.imageUrl);
    setAdPreview(item.adImageUrl ?? null);   // ← NEW
    setError("");
    if (fileRef.current) fileRef.current.value = "";
    if (adFileRef.current) adFileRef.current.value = "";  // ← NEW
  };

  const handleCancel = () => {
    setEditingId(null); setFields(DISTRICT_EMPTY);
    setPreview(null); setAdPreview(null); setError("");   // ← adPreview reset
    if (fileRef.current) fileRef.current.value = "";
    if (adFileRef.current) adFileRef.current.value = ""; // ← NEW
  };

  const num = (v) => v === "" ? null : Number(v);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const payload = {
        area: fields.area, areaWide: num(fields.areaWide),
        activeFishermen: num(fields.activeFishermen), fisheriesFamilies: num(fields.fisheriesFamilies),
        multidayBoats: num(fields.multidayBoats), smallFiberGlassBoats: num(fields.smallFiberGlassBoats),
        mechanizedTraditional: num(fields.mechanizedTraditional), nonMechanizedTraditional: num(fields.nonMechanizedTraditional),
        odayBoats: num(fields.odayBoats), beachSeinBoats: num(fields.beachSeinBoats),
        landingSites: num(fields.landingSites), googleMapsLink: fields.googleMapsLink || null,
        active: fields.active, image: fields.image,
        // ── NEW ──────────────────────────────────────────────────────────────
        adImage: fields.adImage,
        nameEn: fields.nameEn || null,
        nameSi: fields.nameSi || null,
        nameTa: fields.nameTa || null,
        // ─────────────────────────────────────────────────────────────────────
      };
      if (editingId) await districtService.update(editingId, payload);
      else           await districtService.create(payload);
      handleCancel(); await load();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this district?")) return;
    try { await districtService.delete(id); await load(); }
    catch (e) { setError(e.message); }
  };

  // ── Reusable image upload block ───────────────────────────────────────────
  const ImageUploadField = ({ label, fieldKey, previewSrc, setPreviewSrc, ref: fRef }) => (
    <div style={{ marginBottom: 12 }}>
      <FieldLabel text={label} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", fontSize: 13, fontWeight: 500, border: "1px solid #334155", borderRadius: 8, cursor: "pointer", background: "#1e293b", color: "#94a3b8" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {fields[fieldKey] ? fields[fieldKey].name : "Choose image"}
          <input ref={fRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => {
              const f = e.target.files[0];
              if (f) { setF(fieldKey, f); setPreviewSrc(URL.createObjectURL(f)); }
            }} />
        </label>
        {previewSrc && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={previewSrc} alt="preview" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
            <button type="button" onClick={() => { setF(fieldKey, null); setPreviewSrc(null); if (fRef.current) fRef.current.value = ""; }}
              style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
          </div>
        )}
        {editingId && !fields[fieldKey] && <p style={{ fontSize: 11, color: "#475569" }}>Leave blank to keep current</p>}
      </div>
    </div>
  );

  return (
    <div>
      {error && <div style={{ background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {editingId ? "Edit district" : "Add new district"}
        </p>

        {/* Row 1 — area + active */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12, marginBottom: 12 }}>
          <div>
            <FieldLabel text="Area Name *" />
            <input style={inputStyle} type="text" placeholder="e.g. Colombo" value={fields.area} onChange={e => setF("area", e.target.value)} required />
          </div>
          <div>
            <FieldLabel text="Active" />
            <select style={selectStyle} value={fields.active ? "true" : "false"} onChange={e => setF("active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* ── NEW: Multilingual names ───────────────────────────────────────── */}
        <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, marginTop: 0 }}>
           AD Name (Multilingual) 
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div>
              <FieldLabel text="Name — English" />
              <input style={inputStyle} type="text" placeholder="e.g. AD Name (Multilingual)"
                value={fields.nameEn} onChange={e => setF("nameEn", e.target.value)} />
            </div>
            <div>
              <FieldLabel text="Name — Sinhala (සිංහල)" />
              <input style={inputStyle} type="text" placeholder="e.g. AD Name (Multilingual)"
                value={fields.nameSi} onChange={e => setF("nameSi", e.target.value)} />
            </div>
            <div>
              <FieldLabel text="Name — Tamil (தமிழ்)" />
              <input style={inputStyle} type="text" placeholder="e.g. AD Name (Multilingual)"
                value={fields.nameTa} onChange={e => setF("nameTa", e.target.value)} />
            </div>
          </div>
        </div>
        {/* ─────────────────────────────────────────────────────────────────── */}

        {/* Row 2 — numeric stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
          {[
            ["areaWide",                "Area Wide (km²)"],
            ["activeFishermen",         "Active Fishermen"],
            ["fisheriesFamilies",       "Fisheries Families"],
            ["multidayBoats",           "Multiday Boats"],
            ["smallFiberGlassBoats",    "Small FG Boats"],
            ["mechanizedTraditional",   "Mechanized Trad."],
            ["nonMechanizedTraditional","Non-Mech. Trad."],
            ["odayBoats",               "ODAY Boats"],
            ["beachSeinBoats",          "Beach Seine Boats"],
            ["landingSites",            "Landing Sites"],
          ].map(([key, label]) => (
            <div key={key}>
              <FieldLabel text={label} />
              <input style={inputStyle} type="number" min="0" placeholder="0"
                value={fields[key]} onChange={e => setF(key, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Google Maps */}
        <div style={{ marginBottom: 12 }}>
          <FieldLabel text="Google Maps Link" />
          <textarea style={textareaStyle} placeholder="https://maps.google.com/..."
            value={fields.googleMapsLink} onChange={e => setF("googleMapsLink", e.target.value)} />
        </div>

        {/* ── Images side by side ───────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* District image */}
          <div>
            <FieldLabel text="District Image" />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", fontSize: 13, fontWeight: 500, border: "1px solid #334155", borderRadius: 8, cursor: "pointer", background: "#1e293b", color: "#94a3b8" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {fields.image ? fields.image.name : "Choose image"}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files[0]; if (f) { setF("image", f); setPreview(URL.createObjectURL(f)); } }} />
              </label>
              {preview && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={preview} alt="preview" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
                  <button type="button" onClick={() => { setF("image", null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                    style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </div>
              )}
              {editingId && !fields.image && <p style={{ fontSize: 11, color: "#475569" }}>Keep current</p>}
            </div>
          </div>

          {/* ── NEW: Ad image ─────────────────────────────────────────────── */}
          <div>
            <FieldLabel text="Ad Image" />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", fontSize: 13, fontWeight: 500, border: "1px solid #334155", borderRadius: 8, cursor: "pointer", background: "#1e293b", color: "#94a3b8" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {fields.adImage ? fields.adImage.name : "Choose ad image"}
                <input ref={adFileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files[0]; if (f) { setF("adImage", f); setAdPreview(URL.createObjectURL(f)); } }} />
              </label>
              {adPreview && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={adPreview} alt="ad preview" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
                  <button type="button" onClick={() => { setF("adImage", null); setAdPreview(null); if (adFileRef.current) adFileRef.current.value = ""; }}
                    style={{ fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </div>
              )}
              {editingId && !fields.adImage && <p style={{ fontSize: 11, color: "#475569" }}>Keep current</p>}
            </div>
          </div>
          {/* ─────────────────────────────────────────────────────────────── */}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading} style={{ height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500, background: loading ? "#1e3a5f" : "#2563eb", color: loading ? "#60a5fa" : "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Saving…" : editingId ? "Update" : "Add District"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{ height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", margin: 0 }}>{items.length} district{items.length !== 1 ? "s" : ""}</p>
        </div>
        {items.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#475569", fontSize: 13 }}>No districts yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Image", "Ad Image", "Area", "Names", "Fishermen", "Families", "Boats", "Landing Sites", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid #1e293b" : "none", background: editingId === item.id ? "#172033" : "transparent", transition: "background 0.15s" }}>
                  {/* District image */}
                  <td style={{ padding: "10px 16px" }}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.area} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid #334155" }} />
                      : <div style={{ width: 44, height: 44, borderRadius: 6, background: "#0f172a", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#334155" strokeWidth="1.5"/><path d="M3 16l5-5 4 4 3-3 6 6" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    }
                  </td>
                  {/* ── NEW: Ad image column ── */}
                  <td style={{ padding: "10px 16px" }}>
                    {item.adImageUrl
                      ? <img src={item.adImageUrl} alt="ad" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid #1e3a5f" }} />
                      : <div style={{ width: 44, height: 44, borderRadius: 6, background: "#0f172a", border: "1px dashed #334155", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 9, color: "#334155", fontWeight: 600 }}>AD</span>
                        </div>
                    }
                  </td>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{item.area}</td>
                  {/* ── NEW: Names column ── */}
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ fontSize: 12, color: "#e2e8f0" }}>{item.nameEn || "—"}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.nameSi || ""}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.nameTa || ""}</div>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{item.activeFishermen?.toLocaleString() ?? "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{item.fisheriesFamilies?.toLocaleString() ?? "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{((item.multidayBoats ?? 0) + (item.smallFiberGlassBoats ?? 0) + (item.mechanizedTraditional ?? 0) + (item.nonMechanizedTraditional ?? 0) + (item.odayBoats ?? 0) + (item.beachSeinBoats ?? 0)).toLocaleString()}</td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{item.landingSites ?? "—"}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: item.active ? "#1a2e1a" : "#1f1215", color: item.active ? "#4ade80" : "#f87171", border: `1px solid ${item.active ? "#14532d" : "#7f1d1d"}` }}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(item)} style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>Delete</button>
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

// ── District Position form (unchanged) ───────────────────────────────────────
const POS_EMPTY = { areaId: "", name: "", number: "", position: "", subarea: "" };

function PositionTab() {
  const [districts, setDistricts]     = useState([]);
  const [items, setItems]             = useState([]);
  const [editingId, setEditingId]     = useState(null);
  const [fields, setFields]           = useState(POS_EMPTY);
  const [filterArea, setFilterArea]   = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const loadDistricts = async () => {
    try { setDistricts(await districtService.getAll()); }
    catch (e) { setError(e.message); }
  };

  const loadPositions = async () => {
    try { setItems(await districtService.getAllPositions(filterArea ? Number(filterArea) : null)); }
    catch (e) { setError(e.message); }
  };

  useEffect(() => { loadDistricts(); }, []);
  useEffect(() => { loadPositions(); }, [filterArea]);

  const setF = (k, v) => setFields(f => ({ ...f, [k]: v }));

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFields({ areaId: item.areaId, name: item.name, number: item.number ?? "", position: item.position ?? "", subarea: item.subarea ?? "" });
    setError("");
  };

  const handleCancel = () => { setEditingId(null); setFields(POS_EMPTY); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { areaId: Number(fields.areaId), name: fields.name, number: fields.number || null, position: fields.position || null, subarea: fields.subarea || null };
      if (editingId) await districtService.updatePosition(editingId, payload);
      else           await districtService.createPosition(payload);
      handleCancel(); await loadPositions();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this position?")) return;
    try { await districtService.deletePosition(id); await loadPositions(); }
    catch (e) { setError(e.message); }
  };

  const districtName = (id) => districts.find(d => d.id === id)?.area ?? id;

  return (
    <div>
      {error && <div style={{ background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {editingId ? "Edit position" : "Add new position"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <FieldLabel text="District *" />
            <select style={selectStyle} value={fields.areaId} onChange={e => setF("areaId", e.target.value)} required>
              <option value="">Select district…</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.area}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel text="Officer Name *" />
            <input style={inputStyle} type="text" placeholder="e.g. K. A. Nimal Perera" value={fields.name} onChange={e => setF("name", e.target.value)} required />
          </div>
          <div>
            <FieldLabel text="Position / Title" />
            <input style={inputStyle} type="text" placeholder="e.g. District Fisheries Officer" value={fields.position} onChange={e => setF("position", e.target.value)} />
          </div>
          <div>
            <FieldLabel text="Contact Number" />
            <input style={inputStyle} type="text" placeholder="e.g. 0112-345678" value={fields.number} onChange={e => setF("number", e.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FieldLabel text="Sub Area / Office" />
            <input style={inputStyle} type="text" placeholder="e.g. Colombo Fort" value={fields.subarea} onChange={e => setF("subarea", e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading} style={{ height: 36, padding: "0 18px", fontSize: 13, fontWeight: 500, background: loading ? "#1e3a5f" : "#2563eb", color: loading ? "#60a5fa" : "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Saving…" : editingId ? "Update" : "Add Position"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{ height: 36, padding: "0 16px", fontSize: 13, fontWeight: 500, background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          )}
        </div>
      </form>

      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0, whiteSpace: "nowrap" }}>Filter by district:</p>
        <select style={{ ...selectStyle, width: 200 }} value={filterArea} onChange={e => setFilterArea(e.target.value)}>
          <option value="">All districts</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.area}</option>)}
        </select>
      </div>

      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", margin: 0 }}>{items.length} position{items.length !== 1 ? "s" : ""}</p>
        </div>
        {items.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#475569", fontSize: 13 }}>No positions yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["District", "Name", "Position", "Sub Area", "Contact", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid #1e293b" : "none", background: editingId === item.id ? "#172033" : "transparent" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f" }}>
                      {districtName(item.areaId)}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#f1f5f9" }}>{item.name}</td>
                  <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{item.position || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#64748b" }}>{item.subarea || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#3b82f6", fontFamily: "monospace", fontSize: 12 }}>{item.number || "—"}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(item)} style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 500, background: "#172033", color: "#60a5fa", border: "1px solid #1e3a5f", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 500, background: "#1f1215", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 6, cursor: "pointer" }}>Delete</button>
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

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminDistrict() {
  const [activeTab, setActiveTab] = useState("districts");

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6" style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a", minHeight: "100vh" }}>
      <style>{`
        input:focus, textarea:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        input::placeholder, textarea::placeholder { color: #475569; }
        select option { background: #1e293b; color: #e2e8f0; }
        * { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
        *::-webkit-scrollbar { width: 6px; } *::-webkit-scrollbar-track { background: #0f172a; } *::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 32, background: "#3b82f6", borderRadius: 4 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", fontFamily: "'Merriweather', serif", margin: 0 }}>
          Districts — Admin
        </h2>
      </div>

      <div style={{ display: "flex", gap: 4, background: "#1e293b", borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content" }}>
        <Tab label="Districts"         active={activeTab === "districts"} onClick={() => setActiveTab("districts")} />
        <Tab label="Officer Positions" active={activeTab === "positions"} onClick={() => setActiveTab("positions")} />
      </div>

      {activeTab === "districts" && <DistrictTab />}
      {activeTab === "positions" && <PositionTab />}
    </div>
  );
}