import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { districtService } from "../services/district_service";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

const ui = {
  en: {
    bannerSub: "District Office",
    back: "Back",
    statsTitle: "Fisheries Statistics",
    locationTitle: "Location",
    imageTitle: "District Office",
    officersTitle: "Officers",
    adTitle: "Assistant Director",
    openMaps: "Open in Google Maps",
    noMap: "No map available",
    notFound: "District not found.",
    goBack: "Go back",
    nameLabel: "Name",
    positionLabel: "Position",
    stats: {
      areaWide: "Area (km²)",
      activeFishermen: "Active Fishermen",
      fisheriesFamilies: "Fisheries Families",
      multidayBoats: "Multiday Boats",
      smallFiberGlassBoats: "Small Fiber Glass Boats",
      mechanizedTraditional: "Mechanized Traditional",
      nonMechanizedTraditional: "Non-Mechanized Traditional",
      odayBoats: "IDAY Boats",
      beachSeinBoats: "Beach Seine Boats",
      landingSites: "Landing Sites",
    },
    tableHeaders: [
      "Officer in Charge",
      "Position",
      "FI/FO Division",
      "Contact",
    ],
  },
  si: {
    bannerSub: "දිස්ත්‍රික් කාර්යාලය",
    back: "ආපසු",
    statsTitle: "ධීවර සංඛ්‍යාලේඛන",
    locationTitle: "පිහිටීම",
    imageTitle: "දිස්ත්‍රික් රූපය",
    officersTitle: "නිලධාරීන්",
    adTitle: "සහකාර අධ්‍යක්ෂක",
    openMaps: "Google Maps හි විවෘත කරන්න",
    noMap: "සිතියමක් නොමැත",
    notFound: "දිස්ත්‍රික්කය හමු නොවීය.",
    goBack: "ආපසු යන්න",
    nameLabel: "නම",
    positionLabel: "තනතුර",
    stats: {
      areaWide: "වර්ගඵලය (km²)",
      activeFishermen: "සක්‍රිය ධීවරයන්",
      fisheriesFamilies: "ධීවර පවුල්",
      multidayBoats: "බහු දින බෝට්ටු",
      smallFiberGlassBoats: "කුඩා ෆයිබර් ග්ලාස් බෝට්ටු",
      mechanizedTraditional: "යාන්ත්‍රික සාම්ප්‍රදායික",
      nonMechanizedTraditional: "යාන්ත්‍රික නොවන සාම්ප්‍රදායික",
      odayBoats: "IDAY බෝට්ටු",
      beachSeinBoats: "වෙරළ සීන් බෝට්ටු",
      landingSites: "ගොඩබෑමේ ස්ථාන",
    },
    tableHeaders: ["භාර නිලධාරියා", "තනතුර", "FI/FO ප්‍රදේශය", "දුරකථනය"],
  },
  ta: {
    bannerSub: "மாவட்ட அலுவலகம்",
    back: "பின்செல்",
    statsTitle: "மீன்வள புள்ளிவிவரங்கள்",
    locationTitle: "இருப்பிடம்",
    imageTitle: "மாவட்ட படம்",
    officersTitle: "அதிகாரிகள்",
    adTitle: "உதவி இயக்குனர்",
    openMaps: "Google Maps இல் திற",
    noMap: "வரைபடம் இல்லை",
    notFound: "மாவட்டம் கண்டுபிடிக்கப்படவில்லை.",
    goBack: "திரும்பு",
    nameLabel: "பெயர்",
    positionLabel: "பதவி",
    stats: {
      areaWide: "பரப்பளவு (km²)",
      activeFishermen: "செயலில் உள்ள மீனவர்கள்",
      fisheriesFamilies: "மீனவ குடும்பங்கள்",
      multidayBoats: "பல நாள் படகுகள்",
      smallFiberGlassBoats: "சிறிய நார்க்கண்ணாடி படகுகள்",
      mechanizedTraditional: "இயந்திரமயமான பாரம்பரியம்",
      nonMechanizedTraditional: "இயந்திரமற்ற பாரம்பரியம்",
      odayBoats: "IDAY படகுகள்",
      beachSeinBoats: "கடற்கரை வலை படகுகள்",
      landingSites: "தரையிறங்கும் இடங்கள்",
    },
    tableHeaders: ["பொறுப்பாகவுள்ள அலுவலர்", "பதவி", "FI/FO பிரிவு", "தொடர்பு"],
  },
};

const StatCard = ({ label, value }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
      }}
    >
      {label}
    </p>
    <p style={{ fontSize: 22, fontWeight: 700, color: "#0A2F5C" }}>
      {value ?? "—"}
    </p>
  </div>
);
function AdCard({ district, language }) {
  const t = ui[language] ?? ui.en;

  const nameMap = {
    en: district.nameEn,
    si: district.nameSi,
    ta: district.nameTa,
  };
  const currentName = nameMap[language] || nameMap.en;

  // ── find the AD position to get contact number ──
  const adPosition = district.positions?.find(
    p => p.position?.toLowerCase() === "ad"
  );

  if (!district.adImageUrl && !currentName) return null;

  return (
    <div
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
      className="md:flex-row"
    >
      {/* ── Image side ── */}
      {district.adImageUrl && (
        <div
          style={{ position: "relative", flexShrink: 0, overflow: "hidden" }}
          className="w-full h-full md:w-52 md:h-full rounded-lg"
        >
          {/* <div style={{
            position: "absolute", top: 12, left: 12, zIndex: 2,
            background: "#185FA5", color: "#fff",
            fontSize: 9, fontWeight: 800, letterSpacing: "0.15em",
            padding: "3px 10px", borderRadius: 20,
            boxShadow: "0 2px 8px rgba(24,95,165,0.35)",
          }}>
            AD
          </div> */}
          <img
            src={district.adImageUrl}
            alt={district.area}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 10%", display: "block",
            }}
          />
        </div>
      )}

      {/* ── Info side ── */}
      {currentName && (
        <div style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "24px 2px", gap: 16, flex: 1, minHeight: 160,
        }}>
          {/* accent line + name */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 14 }}>
            <div style={{ width: 4, borderRadius: 4, background: "#185FA5", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#6b7280",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                {t.nameLabel}
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#0A2F5C", lineHeight: 1.3 }}>
                {currentName}
              </span>
            </div>
          </div>

          {/* position pill */}
          {t.adTitle && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#EFF6FF", border: "1px solid #BFDBFE",
              borderRadius: 8, padding: "6px 14px", alignSelf: "flex-start",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#185FA5", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#185FA5" }}>
                {t.adTitle}
              </span>
            </div>
          )}

          {/* ── contact number from AD position ── */}
          {adPosition?.number && (
            <a
              href={`tel:${adPosition.number}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                alignSelf: "flex-start",
                background: "#f0f9ff", border: "1px solid #bae6fd",
                borderRadius: 8, padding: "6px 14px",
                textDecoration: "none",
              }}
            >
              {/* phone icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                  fill="#185FA5"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#185FA5", fontFamily: "monospace" }}>
                {adPosition.number}
              </span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
export default function DistrictDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const t = ui[language] ?? ui.en;

  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    districtService
      .getById(Number(id), language)
      .then(setDistrict)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, language]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <AppBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#185FA5] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );

  if (error || !district)
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <AppBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-sm">{t.notFound}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-[#185FA5] underline"
          >
            {t.goBack}
          </button>
        </div>
        <Footer />
      </div>
    );

  const mapEmbedUrl = district.googleMapsLink ?? null;
  const FONT_MAP = { en: "font-sans", si: "font-sinhala", ta: "font-tamil" };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#f4f4f4] ${FONT_MAP[language] || FONT_MAP.en}`}
    >
      <style>{`
        .detail-heading { font-family: 'Merriweather', serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
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
        <div className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
          <nav className="hidden md:flex items-center gap-2 text-sm py-3 px-1">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-300 hover:underline"
            >
              <FaHome className="text-sm" /> Home
            </Link>
            <>
              <FaChevronRight className="text-gray-300 text-xs" />
              <span className="text-gray-300 font-semibold">About Us</span>
            </>
            <>
              <FaChevronRight className="text-gray-300 text-xs" />
              <span className="text-gray-300 font-semibold">District</span>
            </>
          </nav>
          <h1 className="detail-heading text-3xl md:text-4xl font-black text-white leading-tight">
            {district.area}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-4" />
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-10">
        {/* ── Ad + Name card ── */}
        <AdCard district={district} language={language} />

        {/* Stats grid */}
        <div className="fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-7 bg-[#185FA5] rounded-full" />
            <h2 className="detail-heading text-base font-bold text-gray-800">
              {t.statsTitle}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
              label={t.stats.areaWide}
              value={district.areaWide?.toLocaleString()}
            />
            <StatCard
              label={t.stats.activeFishermen}
              value={district.activeFishermen?.toLocaleString()}
            />
            <StatCard
              label={t.stats.fisheriesFamilies}
              value={district.fisheriesFamilies?.toLocaleString()}
            />
            <StatCard
              label={t.stats.multidayBoats}
              value={district.multidayBoats?.toLocaleString()}
            />
            <StatCard
              label={t.stats.smallFiberGlassBoats}
              value={district.smallFiberGlassBoats?.toLocaleString()}
            />
            <StatCard
              label={t.stats.mechanizedTraditional}
              value={district.mechanizedTraditional?.toLocaleString()}
            />
            <StatCard
              label={t.stats.nonMechanizedTraditional}
              value={district.nonMechanizedTraditional?.toLocaleString()}
            />
            <StatCard
              label={t.stats.odayBoats}
              value={district.odayBoats?.toLocaleString()}
            />
            <StatCard
              label={t.stats.beachSeinBoats}
              value={district.beachSeinBoats?.toLocaleString()}
            />
            <StatCard
              label={t.stats.landingSites}
              value={district.landingSites?.toLocaleString()}
            />
          </div>
        </div>

        {/* Map + Image row */}
        <div
          className="fade-up grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{ animationDelay: "0.1s" }}
        >
          {district.imageUrl && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-7 bg-[#185FA5] rounded-full" />
                <h2 className="detail-heading text-base font-bold text-gray-800">
                  {t.imageTitle}
                </h2>
              </div>
              <div
                className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                style={{ height: 300 }}
              >
                <img
                  src={district.imageUrl}
                  alt={district.area}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-7 bg-[#185FA5] rounded-full" />
              <h2 className="detail-heading text-base font-bold text-gray-800">
                {t.locationTitle}
              </h2>
            </div>
            <div
              className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
              style={{ height: 300 }}
            >
              {mapEmbedUrl ? (
                <iframe
                  title={`${district.area} map`}
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    fontSize: 13,
                  }}
                >
                  {t.noMap}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Officer positions */}
        {district.positions?.filter((p) => p.position?.toLowerCase() !== "ad")
          .length > 0 && (
          <div className="fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-7 bg-[#185FA5] rounded-full" />
              <h2 className="detail-heading text-base font-bold text-gray-800">
                {t.officersTitle}
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {t.tableHeaders.map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#6b7280",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {district.positions
                    .filter((p) => p.position?.toLowerCase() !== "ad")
                    .map((p, i, arr) => (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom:
                            i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: 500,
                            color: "#111827",
                          }}
                        >
                          {p.name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#374151" }}>
                          {p.position || "—"}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                          {p.subarea || "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {p.number ? (
                            <a
                              href={`tel:${p.number}`}
                              className="text-[#185FA5] hover:underline font-medium"
                            >
                              {p.number}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
