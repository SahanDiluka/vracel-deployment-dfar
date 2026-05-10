// src/pages/NormalPage.jsx
import { useParams } from "react-router-dom";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { useNormalPage } from "../hooks/information_hook";
import { ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Breadcrumb from "../components/Breadcrumb";

export default function NormalPage() {
  const { slug } = useParams();
  const { page, loading, error } = useNormalPage(slug);
  const HEADING_FONT_MAP = {
    en: "'Noto Sans', sans-serif",
    si: "'Noto Sans Sinhala', sans-serif",
    ta: "'Noto Sans Tamil', sans-serif",
  };
  const language = useSelector(selectLanguage);
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <style>{`
        .np-heading { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        .np-body    { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
      `}</style>

      <AppBar />

      {loading ? (
        <PageLoader />
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 np-body">
          Failed to load page.
        </div>
      ) : !page ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 np-body">
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
              {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em] np-body">
                DFAR
              </p> */}
              <Breadcrumb section="Information" />
              <h1 className="np-heading text-4xl md:text-5xl font-black text-white tracking-tight text-center px-4">
                {page.header}
              </h1>
              <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
            </div>
          </div>

          <main className="flex-1 np-body">
            {/* Intro description */}
            <section className="bg-white border-b border-gray-100 py-10 px-6 fade-up">
              <div className="max-w-4xl mx-auto flex items-start gap-3">
                <div className="w-1 h-full min-h-[2.5rem] bg-[#185FA5] rounded-full shrink-0 mt-1" />

                <div className="text-[0.9rem] text-gray-600 leading-[1.9]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => (
                        <strong className="font-bold text-[#0A2F5C]">
                          {children}
                        </strong>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-[1.1rem] font-semibold text-[#0A2F5C] mt-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="w-full border-collapse text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-[#0A2F5C] text-white">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-gray-200">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-blue-50 transition-colors">
                          {children}
                        </tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2 text-left font-semibold text-[0.85rem]">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 text-gray-600">{children}</td>
                      ),
                    }}
                  >
                    {page.description}
                  </ReactMarkdown>
                </div>
              </div>
            </section>

            {/* Second header + image */}
            {(page.secondHeader || page.imageUrl) && (
              <section className="py-14 px-6">
                <div className="max-w-4xl mx-auto">
                  {page.secondHeader && (
                    <h2
                      className="np-heading text-2xl md:text-2xl font-bold text-gray-900 mb-1 fade-up"
                      style={{ animationDelay: "0.15s" }}
                    >
                      {page.secondHeader}
                    </h2>
                  )}

                  {page.imageUrl && (
                    <div
                      className="fade-up rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.1)] mb-8"
                      style={{ animationDelay: "0.25s" }}
                    >
                      <img
                        src={page.imageUrl}
                        alt={page.secondHeader || page.header}
                        className="w-full object-cover max-h-[420px]"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* CTA Button */}
            {page.buttonUrl && page.buttonLabel && (
              <section
                className="flex pb-14 px-6 fade-up items-center"
                style={{ animationDelay: "0.35s" }}
              >
                <div className="max-w-4xl mx-auto">
                  <a
                    href={page.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center  gap-2 bg-[#185FA5] hover:bg-[#0A2F5C] text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-colors shadow-lg shadow-blue-200"
                  >
                    <ExternalLink size={15} />
                    {page.buttonLabel}
                  </a>
                </div>
              </section>
            )}
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}
