// src/pages/RegulationsPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { regulationService } from "../services/regulation_service";
import Breadcrumb from "../components/Breadcrumb";

// ── i18n ──────────────────────────────────────────────────────────────────────
const T = {
  en: {
    banner_sub: "DFAR",
    banner_title: "Regulations",
    col_name: "Regulation Name", col_number: "Number",
    col_date: "Date", col_pdf: "Download",
    no_rows: "No regulations available.",
    no_topics: "No regulation categories found.",
    err: "Failed to load regulations.",
    download: "Download PDF",
  },
  si: {
    banner_sub: "DFAR",
    banner_title: "රෙගුලාසි",
    col_name: "රෙගුලාසි නාමය", col_number: "අංකය",
    col_date: "දිනය", col_pdf: "බාගැනීම",
    no_rows: "රෙගුලාසි නොමැත.", no_topics: "කාණ්ඩ නොමැත.",
    err: "රෙගුලාසි පූරණය අසාර්ථකයි.", download: "PDF බාගන්න",
  },
  ta: {
    banner_sub: "DFAR",
    banner_title: "ஒழுங்குவிதிகள்",
    col_name: "ஒழுங்குவிதி பெயர்", col_number: "எண்",
    col_date: "தேதி", col_pdf: "பதிவிறக்கம்",
    no_rows: "ஒழுங்குவிதிகள் இல்லை.", no_topics: "வகைகள் இல்லை.",
    err: "ஒழுங்குவிதிகள் ஏற்றுவதில் பிழை.", download: "PDF பதிவிறக்கம்",
  },
};

const FONT = {
  en: "'Noto Sans', sans-serif",
  si: "'Noto Sans Sinhala', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
};

// ── tiny icons ────────────────────────────────────────────────────────────────
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#185FA5]/40 shrink-0">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       className="w-10 h-10 opacity-50">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonBlock() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-blue-200 rounded-full" />
        <div className="h-6 w-48 bg-blue-100 rounded-lg" />
      </div>
      <div className="rounded-2xl overflow-hidden border border-gray-200">
        {/* Header — desktop only */}
        <div className="hidden md:block h-10 bg-[#185FA5]/80" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-4 md:px-6 py-4 border-b border-gray-100 last:border-0 bg-white space-y-2 md:space-y-0 md:flex md:gap-4">
            <div className="h-4 bg-gray-200 rounded flex-1" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-full md:w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Topic block ───────────────────────────────────────────────────────────────
function TopicBlock({ topic, t, index }) {
  return (
    <section className="mb-8 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>

      {/* Topic header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{
          width: "4px", minHeight: "2rem", alignSelf: "stretch",
          borderRadius: "999px", background: "#185FA5", flexShrink: 0
        }} />
        <h2 style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 700, color: "#1f2937", lineHeight: 1.35, margin: 0 }}>
          {topic.header}
        </h2>
      </div>

      {/* Table card */}
      <div style={{
        borderRadius: "16px", border: "1px solid #e5e7eb",
        boxShadow: "0 2px 20px rgba(24,95,165,0.06)", overflow: "hidden"
      }}>

        {/* ── Desktop column headers (hidden on mobile via CSS class) ── */}
        <div className="desktop-header reg-grid bg-[#185FA5] gap-4"
             style={{ padding: "12px 24px" }}>
          {[t.col_name, t.col_number, t.col_date, t.col_pdf].map((h, i) => (
            <span key={i} style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.12em", color: "#bfdbfe",
              textAlign: i === 0 ? "left" : i === 3 ? "right" : "center"
            }}>
              {h}
            </span>
          ))}
        </div>

        {/* ── Rows ── */}
        {topic.rows && topic.rows.length > 0 ? (
          topic.rows.map((row, ri) => (
            <div
              key={row.id}
              className="row-hover"
              style={{
                borderBottom: "1px solid #f3f4f6",
                background: "#fff" 
              }}
            >
              {/* ── Mobile card (shown on mobile, hidden on desktop) ── */}
              <div className="mobile-card" style={{ padding: "14px 16px", display: "none" }}>
                {/* Name */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                  <IconFile />
                  <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
                    {row.name}
                  </span>
                </div>

                {/* Number + Date */}
                <div className="mobile-meta">
                  <span className="mobile-badge">
                    {t.col_number}: <span>{row.number || "—"}</span>
                  </span>
                  <span className="mobile-badge">
                    {t.col_date}: <span>{row.date || "—"}</span>
                  </span>
                </div>

                {/* Download — full width */}
                {row.pdfUrl ? (
                  <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer"
                     className="mobile-dl-btn">
                    <IconDownload />
                    {t.download}
                  </a>
                ) : (
                  <span style={{ display: "block", textAlign: "center", fontSize: "12px", color: "#d1d5db", fontStyle: "italic", padding: "8px 0" }}>—</span>
                )}
              </div>

              {/* ── Desktop grid row (shown on desktop, hidden on mobile) ── */}
              <div className="desktop-row reg-grid gap-4"
                   style={{ padding: "16px 24px", alignItems: "center" }}>
                {/* Name */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ marginTop: "2px" }}><IconFile /></span>
                  <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: 500, lineHeight: 1.4 }}>
                    {row.name}
                  </span>
                </div>

                {/* Number */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{
                    fontSize: "13px", fontFamily: "monospace", color: "#4b5563",
                     padding: "2px 10px", borderRadius: "999px"
                  }}>
                    {row.number || "—"}
                  </span>
                </div>

                {/* Date */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{row.date || "—"}</span>
                </div>

                {/* PDF button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {row.pdfUrl ? (
                    <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:bg-blue-300"
                       style={{
                         display: "inline-flex", alignItems: "center", gap: "6px",
                         padding: "6px 16px", borderRadius: "8px", fontSize: "12px",
                         fontWeight: 600, color: "#185FA5",
                         textDecoration: "none", transition: "background 0.2s, box-shadow 0.2s, transform 0.1s"
                       }}
                       
                    >
                      <IconDownload />
                      {t.download}
                    </a>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#d1d5db", fontStyle: "italic", padding: "6px 16px" }}>—</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "40px 24px", textAlign: "center", fontSize: "14px", color: "#9ca3af", background: "#fff" }}>
            {t.no_rows}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegulationsPage() {
  const language = useSelector(selectLanguage);
  const t    = T[language] || T.en;
  const font = FONT[language] || FONT.en;

  const [topics,  setTopics]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    regulationService
      .getAllRegulationTopics(language, true)
      .then(setTopics)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9]" style={{ fontFamily: font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;600;700;800&family=Noto+Sans+Tamil:wght@400;600;700;800&display=swap');
        * { font-family: ${font}; box-sizing: border-box; }

        .row-hover { transition: background-color 0.15s ease; }
        .row-hover:hover { background-color: #eef4fc !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.55s ease both; opacity: 0; }

        /* ── Desktop table grid ── */
        .reg-grid {
          display: grid;
          grid-template-columns: 1fr 140px 130px 160px;
          align-items: center;
        }

        /* ── Mobile: hide desktop elements, show mobile ones ── */
        @media (max-width: 767px) {
          .desktop-header { display: none !important; }
          .desktop-row    { display: none !important; }
          .mobile-card    { display: block !important; }
        }

        /* ── Desktop: hide mobile elements, show desktop ones ── */
        @media (min-width: 768px) {
          .desktop-header { display: grid !important; }
          .desktop-row    { display: grid !important; }
          .mobile-card    { display: none !important; }
        }

        /* Mobile card internals */
        .mobile-meta { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 6px 0 10px; }
        .mobile-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; color: #9ca3af;
        }
        .mobile-badge span {
          font-size: 11px; font-weight: 500; text-transform: none; letter-spacing: 0;
          color: #4b5563; background: #f3f4f6;
          padding: 1px 8px; border-radius: 999px;
        }
        .mobile-dl-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 10px 16px; border-radius: 10px;
          font-size: 14px; font-weight: 600; color: #fff;
          background: #185FA5; text-decoration: none;
          transition: background 0.15s, transform 0.1s;
        }
        .mobile-dl-btn:active { background: #0f4a8a; transform: scale(0.98); }
      `}</style>

      <AppBar />

      {/* ── Banner ── */}
      <div className="relative bg-[#185FA5] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: "repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)" }} />
        <div className="relative z-10 py-10 sm:py-16 px-4 flex flex-col items-center gap-2 sm:gap-3">
          {/* <p className="text-[#B5D4F4] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
            {t.banner_sub}
          </p> */}
          <Breadcrumb section="Downloads" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight text-center leading-tight">
            {t.banner_title}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 py-8 sm:py-12 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonBlock key={i} />)
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-400">
              <IconAlert />
              <span className="text-sm">{t.err}</span>
            </div>
          ) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <IconFile />
              <span className="text-sm">{t.no_topics}</span>
            </div>
          ) : (
            topics.map((topic, i) => (
              <TopicBlock key={topic.id} topic={topic} t={t} index={i} />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}