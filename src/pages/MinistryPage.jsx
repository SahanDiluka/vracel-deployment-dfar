// src/pages/MinistryPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { aboutService } from "../services/ministry_service";
import Breadcrumb from "../components/Breadcrumb";

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
    </svg>
  );
}

function FaxIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5a2 2 0 00-2 2v4a2 2 0 002 2h1v8a2 2 0 002 2h8a2 2 0 002-2v-8h1a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H8v-2h4v2zm0-4H8v-2h4v2zm4 4h-2v-6H8V9h8v8zm2-8h-1V5H7v4H6V5h13v4z" />
    </svg>
  );
}

function AvatarPlaceholder({ name, accent }) {
  const initials = (name || "")
    .split(" ")
    .filter(w => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join("");
  return (
    <div className="w-full h-full flex items-center justify-center"
         style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}30)` }}>
      <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg"
           style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
        {initials || "?"}
      </div>
    </div>
  );
}

function OfficialCard({ role, name, ministry, phone, fax, imageUrl, accent = "#185FA5", index = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden
                 shadow-[0_4px_24px_rgba(0,0,0,0.07)] card-hover fade-in
                 flex flex-col flex-1 min-w-[260px]"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Photo — left on sm+, top on mobile */}
      <div className="w-full h-52 relative overflow-hidden shrink-0">
        {imageUrl
          ? <img src={imageUrl} alt={name}
                 className="w-full h-full object-contain bg-gray-50" />
          : <AvatarPlaceholder name={name} accent={accent} />
        }
        {/* Role badge overlaid on image */}
        
      </div>
      <div className="flex justify-center mt-2">
          <span className="text-[15px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow"
                style={{ background: `${accent}dd` }}>
            {role}
          </span>
        </div>
      {/* Info — right side */}
      <div className="flex flex-col justify-center px-6 py-6 gap-3 flex-1">
        <div>
          <h2 className="official-name text-lg font-bold text-gray-900 leading-snug">{name}</h2>
          {ministry && (
            <p className="text-xs text-gray-400 leading-relaxed mt-1">{ministry}</p>
          )}
        </div>

        <div className="w-10 h-0.5 rounded-full" style={{ background: accent }} />

        <div className="flex flex-col gap-2">
          {phone && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                   style={{ background: accent }}>
                <PhoneIcon />
              </div>
              <span className="text-sm text-gray-600 font-medium">{phone}</span>
            </div>
          )}
          {fax && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                   style={{ background: `${accent}90` }}>
                <FaxIcon />
              </div>
              <span className="text-sm text-gray-500">{fax}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-1 min-w-[260px] h-80 bg-gray-200 rounded-2xl animate-pulse flex flex-col overflow-hidden">
      <div className="w-full h-52 bg-gray-300 shrink-0" />
      <div className="flex-1 p-5 flex flex-col gap-3 justify-center">
        <div className="h-3 bg-gray-300 rounded-full w-1/3" />
        <div className="h-5 bg-gray-300 rounded-full w-2/3" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      </div>
    </div>
  );
}

export default function MinistryPage() {
  const language = useSelector(selectLanguage);
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    aboutService
      .getAllMinistryOfficials(language, true)
      .then(setOfficials)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [language]);
  const HEADING_FONT_MAP = {
  en: "'Noto Sans', sans-serif",
  si: "'Noto Sans Sinhala', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
};
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <style>{`
        .official-name { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        * { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.6s ease both; opacity: 0; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 24px 48px rgba(0,0,0,0.11); }
      `}</style>

      <AppBar />

      {/* Banner */}
      <div className="relative bg-[#185FA5] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: "repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)" }} />
        <div className="relative z-10 py-16 flex flex-col items-center gap-3">
          {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em]">
            {language === "si" ? "අපි ගැන" : language === "ta" ? "எங்களைப் பற்றி" : "About Us"}
          </p> */}
          <Breadcrumb section="About Us" />
          <h1 className="official-name text-4xl md:text-5xl font-black text-white tracking-tight">
            {language === "si" ? "අමාත්යාංශය" : language === "ta" ? "அமைச்சகம்" : "Ministry"}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
        </div>
      </div>

      <main className="flex-1 py-14 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row flex-wrap gap-5">
          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="flex items-center justify-center py-24 text-red-400">
              Failed to load officials.
            </div>
          ) : officials.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              No officials found.
            </div>
          ) : (
            officials.map((official, i) => (
              <OfficialCard
                key={official.id}
                index={i}
                role={official.role}
                name={official.name}
                ministry={official.ministry}
                phone={official.phone}
                fax={official.fax}
                imageUrl={official.imageUrl}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}