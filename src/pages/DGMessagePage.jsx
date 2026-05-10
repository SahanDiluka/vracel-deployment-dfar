// src/pages/DirectorPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { aboutService } from "../services/ministry_service";
import Breadcrumb from "../components/Breadcrumb";

const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-6 py-14 flex flex-col gap-6">
      <div className="h-48 bg-gray-200 rounded-2xl" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-5/6" />
      <div className="h-4 bg-gray-100 rounded w-4/6" />
    </div>
  );
}

// ── Avatar — shows image or gradient initials ─────────────────────────────────
function Avatar({ imageUrl, name, initials, size = "lg" }) {
  const dim = size === "lg" ? "w-36 h-48 text-3xl" : "w-10 h-12 text-sm";
  const auto = (name || "")
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join("");
  const label = initials || auto || "DG";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${dim} rounded-full object-cover object-top shadow-lg`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-black text-white shadow-lg`}
      style={{ background: "linear-gradient(135deg, #185FA5, #378ADD)" }}
    >
      {label}
    </div>
  );
}

export default function DirectorPage() {
  const language = useSelector(selectLanguage);
  const font = FONT_MAP[language] ?? "font-sans";

  const [dg, setDg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    aboutService
      .getDirectorGeneral(language)
      .then(setDg)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [language]);

  const paragraphs = dg?.message
    ? dg.message.split(/\n\n+/).filter(Boolean)
    : [];

  return (
    <div className={`min-h-screen flex flex-col bg-[#f4f4f4] ${font}`}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.25s both; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.4s both; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.55s both; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
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
              ? "අපි ගැන"
              : language === "ta"
              ? "எங்களைப் பற்றி"
              : "About Us"}
          </p> */}
          <Breadcrumb section="About us" /> 
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {dg?.title || "Director General"}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
        </div>
      </div>

      <main className="flex-1">
        {loading ? (
          <Skeleton />
        ) : error || !dg ? (
          <div className="flex-1 flex items-center justify-center py-24 text-gray-400">
            {error ? "Failed to load page." : "No content available."}
          </div>
        ) : (
          <>
            {/* Profile card */}
            <section className="bg-[#f4f4f4] py-14 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="fade-up-1 card-hover bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                  <div className="flex flex-col md:flex-row">

                    {/* Avatar panel */}
                    <div className="md:w-64 shrink-0 bg-[#E6F1FB] flex flex-col items-center justify-center py-10 px-6 gap-4">
                      <Avatar
                        imageUrl={dg.imageUrl}
                        name={dg.name}
                        initials={dg.initials}
                        size="lg"
                      />
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#0A2F5C] leading-snug">
                          {dg.name}
                        </p>
                        <p className="text-xs text-[#185FA5] font-semibold mt-1 uppercase tracking-widest">
                          {dg.title}
                        </p>
                        {dg.department && (
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {dg.department}
                          </p>
                        )}
                      </div>
                      <svg viewBox="0 0 80 16" className="w-16 h-4" fill="none">
                        <path
                          d="M0 8 C8 2,16 14,24 8 C32 2,40 14,48 8 C56 2,64 14,72 8 C76 5,78 6,80 8"
                          stroke="#378ADD"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Pull-quote panel */}
                    {dg.quote && (
                      <div className="flex-1 px-8 md:px-10 py-8 flex flex-col justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#E6F1FB] flex items-center justify-center mb-4">
                          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                            <path
                              d="M4 22 C4 14,8 9,15 7 L15 11 C11 13,9 16,9 19 L15 19 L15 27 L4 27 Z"
                              fill="#378ADD"
                            />
                            <path
                              d="M17 22 C17 14,21 9,28 7 L28 11 C24 13,22 16,22 19 L28 19 L28 27 L17 27 Z"
                              fill="#B5D4F4"
                            />
                          </svg>
                        </div>
                        <div className="w-8 h-0.5 bg-[#378ADD] rounded-full mb-4" />
                        <h2 className="text-base md:text-lg font-bold text-gray-900 leading-relaxed">
                          "{dg.quote}"
                        </h2>
                        <p className="text-xs text-[#185FA5] font-semibold uppercase tracking-widest mt-4">
                          {language === "si"
                            ? "අධ්‍යක්ෂ ජනරාල්තුමාගේ පණිවිඩය"
                            : language === "ta"
                            ? "இயக்குநர் ஜெனரலின் செய்தி"
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Message text */}
            {paragraphs.length > 0 && (
              <section className="bg-white py-14 px-6 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                  <div className="fade-up-2 flex items-center gap-3 mb-6">
                    <div className="w-1 h-10 bg-[#185FA5] rounded-full" />
                    <h2 className="text-base font-bold text-gray-900 leading-snug">
                      {language === "si"
                        ? "අධ්‍යක්ෂ ජනරාල්තුමාගේ පණිවිඩය"
                        : language === "ta"
                        ? "இயக்குநர் ஜெனரலின் செய்தி"
                        : "Message from the Director General"}
                    </h2>
                  </div>
                  <div className="fade-up-3 flex flex-col gap-6">
                    {paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="text-[0.9rem] text-gray-600 leading-[1.9] pl-4 border-l-2 border-[#B5D4F4]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Signature */}
                  {/* <div className="fade-up-4 mt-10 flex items-center gap-5 pl-4">
                    <Avatar
                      imageUrl={dg.imageUrl}
                      name={dg.name}
                      initials={dg.initials}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{dg.name}</p>
                      <p className="text-xs text-[#185FA5] font-medium mt-0.5">
                        {dg.title}
                      </p>
                      {dg.department && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {dg.department}
                        </p>
                      )}
                    </div>
                  </div> */}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}