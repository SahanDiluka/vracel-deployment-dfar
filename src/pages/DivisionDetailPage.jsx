import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { divisionService } from "../services/division_service";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { selectLanguage } from "../languageSlice";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DivisionDetailPage() {
  const language = useSelector(selectLanguage);
  const { id } = useParams();
  const navigate = useNavigate();
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    divisionService
      .getById(Number(id))
      .then(setDivision)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (error || !division)
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <AppBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-sm">
            Division not found.{" "}
            {language === "si"
              ? " අංශය හමු නොවීය."
              : language === "ta"
                ? " பிரிவு காணப்படவில்லை."
                : "Division not found."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-[#185FA5] underline"
          >
            Go back
          </button>
        </div>
        <Footer />
      </div>
    );

  const FONT_MAP = {
    en: "font-sans",
    si: "font-sinhala",
    ta: "font-tamil",
  };
  const HEADING_FONT_MAP = {
    en: "'Noto Sans', sans-serif",
    si: "'Noto Sans Sinhala', sans-serif",
    ta: "'Noto Sans Tamil', sans-serif",
  };
  return (
    <div
      className={`min-h-screen flex flex-col bg-[#f4f4f4] ${FONT_MAP[language] || FONT_MAP.en}`}
    >
      <style>{`
        .detail-heading { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      <AppBar />

      {/* Banner */}
      <div className="relative bg-[#185FA5] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
          {/* Back button */}
          {/* <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#B5D4F4] text-xs font-semibold mb-6 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {language === "si" ? " ආපසු" : language === "ta" ? " மீண்டும்" : " Back"}
          </button>
          <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            {language === "si" ? " අංශය" : language === "ta" ? " பிரிவு" : "Division"}
          </p> */}
          {/* {Breadcrumb} */}
          <nav className="hidden md:flex items-center gap-2 text-sm py-3 px-1">
            {/* Home — always first */}
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-300 hover:underline"
            >
              <FaHome className="text-sm" />
              Home
            </Link>

            <>
              <FaChevronRight className="text-gray-300 text-xs" />
              <span className="text-gray-300 font-semibold capitalize">
                About Us
              </span>
            </>

            {/* Last segment */}

            <>
              <FaChevronRight className="text-gray-300 text-xs" />
              <span className="text-gray-300 font-semibold capitalize">
                Divisions
              </span>
            </>
          </nav>
          <h1 className="detail-heading text-3xl md:text-4xl font-black text-white leading-tight">
            {division.topic}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-4" />
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col gap-10">
        {/* Image + Intro */}
        <div className="fade-up grid grid-cols-1 md:grid-cols-1 gap-8 items-start">
          {/* Image */}

          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-[#185FA5] rounded-full" />
              <h2 className="detail-heading text-lg font-bold text-gray-800">
                {language === "si"
                  ? " හැඳින්වීම"
                  : language === "ta"
                    ? " அறிமுகம்"
                    : "Introduction"}
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-[1.9] whitespace-pre-line">
              {division.intro || "—"}
            </p>
          </div>
          {division.image1Url && (
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <img
                src={division.image1Url}
                alt={division.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Intro */}
        </div>

        {/* Details */}
        <div
          className="fade-up bg-white rounded-2xl border border-gray-200 px-8 py-8 shadow-sm"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-8 bg-[#185FA5] rounded-full" />
            <h2 className="detail-heading text-lg font-bold text-gray-800">
              {division.title}
            </h2>
          </div>
          <section className="bg-white border-b border-gray-100 py-1 px-6 fade-up">
              <div className="max-w-4xl mx-auto flex items-start gap-3">

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
                     {division.details || "—"}
                  </ReactMarkdown>
                </div>
              </div>
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
