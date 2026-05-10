import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { quickAccessService } from "../services/home_quickacsess";

export default function QuickAccess() {
  const [quickLinks, setQuickLinks] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const language                    = useSelector(selectLanguage);

  useEffect(() => {
    setLoading(true);
    quickAccessService.getAll(language)
      .then(setQuickLinks)
      .catch(e => { console.error(e); setError("Failed to load quick access links."); })
      .finally(() => setLoading(false));
  }, [language]);

  const visitLabel = language === "si" ? "පිවිසෙන්න"
                   : language === "ta" ? "வருகை"
                   : "Visit";

  if (loading) return (
    <section className="bg-gray-100 py-14 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 rounded-2xl overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300" />
            <div className="p-5 flex flex-col items-center gap-3">
              <div className="w-32 h-3 rounded-full bg-gray-300" />
              <div className="w-24 h-8 rounded-full bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (error) return (
    <section className="bg-gray-100 py-14 px-6">
      <div className="max-w-5xl mx-auto text-center text-sm text-red-500">{error}</div>
    </section>
  );

  if (quickLinks.length === 0) return null;

  const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
  }
  return (
    <section className={`bg-gray-100 py-14 px-6 ${FONT_MAP[language]}`}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qa-card { animation: fadeSlideUp 0.5s ease-out both; }
      `}</style>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quickLinks.map((item, i) => (
          <div
            key={item.id}
            className="qa-card group relative rounded-2xl overflow-hidden shadow-md
                       hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Full bleed image */}
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src={item.iconUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient fade into bottom bar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>

            {/* Bottom bar — matches image vibe with a dark translucent strip */}
            <div className="relative bg-[#0A2F5C] px-5 py-4 flex items-center justify-between gap-3">
              {/* Name */}
              <p className="text-sm font-bold text-white leading-snug flex-1">
                {item.name}
              </p>

              {/* Visit button */}
              <a
                href={item.link}
                className="shrink-0 px-5 py-1.5 bg-[#1A73C8] hover:bg-white hover:text-[#0A2F5C]
                           text-white text-xs font-bold rounded-full border border-transparent
                           hover:border-[#0A2F5C] transition-all duration-200
                           hover:scale-105 active:scale-95"
              >
                {visitLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}