import React, { useState, useEffect } from "react";
import SriLanka from "@svg-maps/sri-lanka";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { districtService } from "../services/district_service";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
function getDistrictFill(id, hoveredId, selectedId, hasData) {
  if (id === selectedId) return "#0A2F5C";
  if (id === hoveredId) return "#378ADD";
  if (hasData) return "#85B7EB";
  return "#C8DFF5";
}

export default function MapOfSriLanka() {
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);

  // Always English for slug matching — never breaks the SVG map
  const [districts, setDistricts] = useState([]);
  // Translated version for display only
  const [translatedDistricts, setTranslatedDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Load English districts once for slug matching
  useEffect(() => {
    districtService
      .getAll("en", true)
      .then(setDistricts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load translated districts separately for display
  useEffect(() => {
    if (language === "en") {
      setTranslatedDistricts([]);
      return;
    }
    districtService
      .getAll(language, true)
      .then(setTranslatedDistricts)
      .catch(console.error);
  }, [language]);

  // Always use English area for SVG slug matching
 const districtBySlug = Object.fromEntries(
  districts.map((d) => [d.area.split(" ")[0].toLowerCase(), d]),
);

  // Get translated name for a district by id
  const getDisplayName = (id) => {
    if (language === "en" || translatedDistricts.length === 0) {
      return districts.find((d) => d.id === id)?.area ?? "";
    }
    return (
      translatedDistricts.find((d) => d.id === id)?.area ??
      districts.find((d) => d.id === id)?.area ??
      ""
    );
  };

  const getDistrict = (locationId) =>
    districtBySlug[locationId.replace(/-/g, "")] ?? null;

  const handleMouseEnter = (e, location) => {
    setHoveredId(location.id);
    const d = getDistrict(location.id);
    if (d) {
      const svgRect = e.currentTarget.closest("svg").getBoundingClientRect();
      setTooltip({
        x: e.clientX - svgRect.left + 12,
        y: e.clientY - svgRect.top - 10,
        district: d,
      });
    }
  };

  const handleMouseMove = (e, location) => {
    if (!getDistrict(location.id)) return;
    const svgRect = e.currentTarget.closest("svg").getBoundingClientRect();
    setTooltip((prev) =>
      prev
        ? {
            ...prev,
            x: e.clientX - svgRect.left + 12,
            y: e.clientY - svgRect.top - 10,
          }
        : null,
    );
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setTooltip(null);
  };

  const handleClick = (location) => {
    const d = getDistrict(location.id);
    if (!d) return;
    setSelectedId(location.id);
    setTooltip(null);
    navigate(`/districts/${d.id}`);
  };

  const selectedDistrict = selectedId ? getDistrict(selectedId) : null;
   const HEADING_FONT_MAP = {
  en: "'Noto Sans', sans-serif",
  si: "'Noto Sans Sinhala', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
};
  return (
    <div
      className="min-h-screen flex flex-col bg-[#f4f4f4]"
      style={{ fontFamily: `${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}` }}
    >
      <style>{`
        .dg-heading { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .district-path { transition: fill 0.18s ease; }
        .office-item { transition: background 0.15s; border-left: 3px solid transparent; }
        .office-item:hover { background: #E6F1FB; }
        .office-item.active { background: #E6F1FB; border-left-color: #185FA5; }
      `}</style>

      <AppBar />

      {/* Banner */}
      <div className="relative bg-[#185FA5] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative z-10 py-16 flex flex-col items-center justify-center gap-3">
          {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em]">
            {language === "si"
              ? " නිලධාරීන්"
              : language === "ta"
                ? " அதிகாரிகள்"
                : "Officers"}
          </p> */}
          <Breadcrumb section="About Us" />
          <h1 className="dg-heading text-4xl md:text-5xl font-black text-white tracking-tight">
            {language == "si"
              ? " දිස්ත්රික් කාර්යාල"
              : language === "ta"
                ? " மாவட்ட அலுவலகங்கள்"
                : "District Offices"}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
        </div>
      </div>

      <main className="flex-1">
        {/* Legend */}
        <section className="bg-white border-b border-gray-100 py-6 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-[#185FA5] rounded-full shrink-0" />
              <p className="text-[0.9rem] text-gray-600 leading-relaxed">
                {language == "si"
                  ? "ධීවර දත්ත බැලීමට උද්දීපනය කළ දිස්ත්‍රික්කයක් මත ක්ලික් කරන්න."
                  : language === "ta"
                    ? "மீன்வளத் தரவைக் காண சிறப்பிக்கப்பட்ட மாவட்டத்தின் மீது கிளிக் செய்யவும்."
                    : "Click on a highlighted district to view its fisheries data."}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {(language == "si"
                ? [
                    { color: "#C8DFF5", label: "දත්ත නැත" },
                    { color: "#85B7EB", label: "කාර්යාලය ඇත" },
                    
                  ]
                : language === "ta"
                  ? [
                      { color: "#C8DFF5", label: "தரவு இல்லை" },
                      { color: "#85B7EB", label: "அலுவலகம் உள்ளது" },
                      
                    ]
                  : [
                      { color: "#C8DFF5", label: "No data" },
                      { color: "#85B7EB", label: "Has office" },
                      
                    ]
              ).map((l) => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-sm inline-block border border-white/40"
                    style={{ background: l.color }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Map + Sidebar */}
        <section className="py-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Map */}
            <div
              className="flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 relative"
              style={{ minHeight: 520 }}
            >
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: 16,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      border: "3px solid #B5D4F4",
                      borderTopColor: "#185FA5",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <p
                    style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}
                  >
                    Loading districts…
                  </p>
                </div>
              )}
              <svg
                viewBox={SriLanka.viewBox}
                style={{ width: "100%", height: "100%" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {SriLanka.locations.map((location) => {
                  const d = getDistrict(location.id);
                  return (
                    <path
                      key={location.id}
                      id={location.id}
                      d={location.path}
                      className="district-path"
                      fill={getDistrictFill(
                        location.id,
                        hoveredId,
                        selectedId,
                        !!d,
                      )}
                      stroke="#fff"
                      strokeWidth="0.8"
                      cursor={d ? "pointer" : "default"}
                      onMouseEnter={(e) => handleMouseEnter(e, location)}
                      onMouseMove={(e) => handleMouseMove(e, location)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(location)}
                    />
                  );
                })}
              </svg>

              {/* Tooltip — shows translated name */}
              {tooltip && (
                <div
                  style={{
                    position: "absolute",
                    left: tooltip.x,
                    top: tooltip.y,
                    background: "#fff",
                    border: "0.5px solid #B5D4F4",
                    borderRadius: 8,
                    padding: "8px 12px",
                    pointerEvents: "none",
                    zIndex: 20,
                    minWidth: 180,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <p
                    style={{ fontWeight: 600, fontSize: 12, color: "#0A2F5C" }}
                  >
                    {getDisplayName(tooltip.district.id)}
                  </p>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                    {tooltip.district.activeFishermen?.toLocaleString()} active
                    fishermen
                  </p>
                  <p style={{ fontSize: 11, color: "#185FA5", marginTop: 4 }}>
                    Click to view details →
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar — shows translated names */}
            <div className="lg:w-64 bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-2xl font-medium text-gray-900"> {language == "si" ? "දිස්ත්රික්ක" : language == "ta" ? "மாவட்டங்கள்" : "Districts"}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loading ? "Loading…" : `${districts.length} loaded`}
                </p>
              </div>
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 32,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        border: "2.5px solid #B5D4F4",
                        borderTopColor: "#185FA5",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  </div>
                ) : (
                  districts.map((d) => (
                    <div
                      key={d.id}
                      className={`office-item px-4 py-3 border-b border-gray-100 cursor-pointer ${selectedDistrict?.id === d.id ? "active" : ""}`}
                      onClick={() => navigate(`/districts/${d.id}`)}
                    >
                      <p className="text-xs font-bold text-gray-900">
                        {getDisplayName(d.id)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {d.activeFishermen?.toLocaleString()} fishermen
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Selected district card — shows translated name */}
        {selectedDistrict && (
          <section className="pb-10 px-6">
            <div className="max-w-5xl mx-auto fade-up">
              <div className="bg-[#0A2F5C] rounded-2xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-[#85B7EB] text-xs font-semibold uppercase tracking-widest mb-1">
                    Selected District
                  </p>
                  <h3 className="dg-heading text-lg font-bold text-white">
                    {getDisplayName(selectedDistrict.id)}
                  </h3>
                  <p className="text-[#B5D4F4] text-sm mt-1">
                    {selectedDistrict.activeFishermen?.toLocaleString()} active
                    fishermen · {selectedDistrict.landingSites} landing sites
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/districts/${selectedDistrict.id}`)}
                  className="shrink-0 bg-[#1A73C8] hover:bg-[#185FA5] transition-colors text-white text-sm font-semibold px-6 py-3 rounded-xl"
                >
                  View Full Details →
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
