// src/pages/LinkTablePage.jsx
import { useParams } from "react-router-dom";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { useLinkTablePage } from "../hooks/information_hook";
import { FileText, ExternalLink, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import Breadcrumb from "../components/Breadcrumb";
export default function LinkTablePage() {
  const { slug } = useParams();
  const { page, loading, error } = useLinkTablePage(slug);
  const language = useSelector(selectLanguage);
    const HEADING_FONT_MAP = {
  en: "'Noto Sans', sans-serif",
  si: "'Noto Sans Sinhala', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
};
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <style>{`
        .lt-heading { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        .lt-body    { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .row-hover:hover { background: #EBF4FF; }
      `}</style>

      <AppBar />

      {loading ? (
        <PageLoader />
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 lt-body">
          Failed to load page.
        </div>
      ) : !page ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 lt-body">
          Page not found.
        </div>
      ) : (
        <>
          {/* Banner */}
          <div className="relative bg-[#185FA5] overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)",
              }}
            />
            <div className="relative z-10 py-16 flex flex-col items-center justify-center gap-3">
              {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em] lt-body">
                DFAR
              </p> */}
              <Breadcrumb section="Information" />
              <h1 className="lt-heading text-4xl md:text-5xl font-black text-white tracking-tight text-center px-4">
                {page.header}
              </h1>
              <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
            </div>
          </div>

          <main className="flex-1 lt-body py-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Table card */}
              <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.07)] border border-gray-100 overflow-hidden fade-up">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#185FA5] text-white">
                      <th className="px-6 py-4 text-left font-semibold tracking-wide w-12">#</th>
                      <th className="px-6 py-4 text-left font-semibold tracking-wide">Name</th>
                      <th className="px-6 py-4 text-right font-semibold tracking-wide">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.rows.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                          No items yet.
                        </td>
                      </tr>
                    )}
                    {page.rows.map((row, i) => {
                      const href = row.pdfUrl || row.url || "#";
                      const isPdf = !!row.pdfUrl;
                      return (
                        <tr
                          key={row.id}
                          className={`row-hover border-t border-gray-100 transition-colors fade-up`}
                          style={{ animationDelay: `${i * 0.04}s` }}
                        >
                          <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-medium flex items-center gap-2">
                            <FileText size={15} className="text-[#378ADD] shrink-0" />
                            {row.name}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#185FA5] hover:text-[#0A2F5C] transition-colors"
                            >
                              {isPdf ? (
                                <>
                                  <Download size={13} />
                                  Download PDF
                                </>
                              ) : (
                                <>
                                  <ExternalLink size={13} />
                                  Open Link
                                </>
                              )}
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}