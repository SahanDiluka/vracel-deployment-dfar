import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { newsService } from "../services/news_service";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const language = useSelector(selectLanguage);
  const [error, setError] = useState("");

  useEffect(() => {
    newsService
      .getById(Number(id))
      .then(setNews)
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

  if (error || !news)
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <AppBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-sm">News item not found.</p>
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#B5D4F4] text-xs font-semibold mb-6 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
          <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            News
          </p>
          <h1 className="detail-heading text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-2xl">
            {news.topic}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-4" />
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        {/* Card */}
        <div className="fade-up bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Image — full width on mobile, top of card */}
          {news.pictureUrl && (
            <div className="w-full">
              <img
                src={news.pictureUrl}
                alt={news.topic}
                className="w-full h-56 sm:h-72 md:h-80 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-7 bg-[#185FA5] rounded-full shrink-0" />
              <h2 className="detail-heading text-base sm:text-lg font-bold text-gray-800">
                Description
              </h2>
            </div>
            <div className="text-sm text-gray-600 leading-[1.95] max-w-3xl flex flex-col gap-2">
              {news.description
                ? news.description
                    .split("\n")
                    .map((line, i) => <p key={i}>{line}</p>)
                : "—"}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
