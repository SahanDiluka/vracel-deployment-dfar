import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { divisionService } from "../services/division_service";
import Breadcrumb from "../components/Breadcrumb";
import {
  ScrollText,
  TrendingUp,
  BadgeCheck,
  Ship,
  Monitor,
  SearchCheck,
  Banknote,
  Users,
  ClipboardList,
} from "lucide-react";

const divisionIcons = [
  ScrollText,
  TrendingUp,
  BadgeCheck,
  Ship,
  Monitor,
  SearchCheck,
  Banknote,
  Users,
  ClipboardList,
];

const uiText = {
  en: {
    bannerSub: "Head Office",
    bannerTitle: "Divisions",
    introCount: (n) => <><strong className="text-gray-800 font-semibold">{n || 9} specialized divisions</strong></>,
    intro: (count) => <>The Head Office of the Department of Fisheries and Aquatic Resources comprises {count}. Each responsible for a distinct area of fisheries governance, development, and administration across Sri Lanka.</>,
    learnMore: "Learn more",
  },
  si: {
    bannerSub: "ප්‍රධාන කාර්යාලය",
    bannerTitle: "අංශ",
    introCount: (n) => <><strong className="text-gray-800 font-semibold">{n || 9} විශේෂිත අංශ</strong></>,
    intro: (count) => <>ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුවේ ප්‍රධාන කාර්යාලය {count} වලින් සමන්විත වන අතර, එක් එක් අංශය ශ්‍රී ලංකාවේ ධීවර පාලනය, සංවර්ධනය හා පරිපාලනයේ විශේෂිත ක්ෂේත්‍රයක් සඳහා වගකිව යුතුය.</>,
    learnMore: "තව දැනගන්න",
  },
  ta: {
    bannerSub: "தலைமை அலுவலகம்",
    bannerTitle: "பிரிவுகள்",
    introCount: (n) => <><strong className="text-gray-800 font-semibold">{n || 9} சிறப்பு பிரிவுகள்</strong></>,
    intro: (count) => <>மீன்வளம் மற்றும் நீர்வாழ் வளங்கள் திணைக்களத்தின் தலைமை அலுவலகம் {count} கொண்டுள்ளது, ஒவ்வொன்றும் இலங்கை முழுவதும் மீன்வளம் நிர்வாகம், மேம்பாடு மற்றும் நிர்வாகத்தின் தனித்துவமான பகுதிக்கு பொறுப்பாகும்.</>,
    learnMore: "மேலும் அறிக",
  },
};

const shuffled = [...Array(divisionIcons.length).keys()].sort(() => Math.random() - 0.5);
function getIcon(index) {
  const Icon = divisionIcons[shuffled[index % divisionIcons.length]];
  return <Icon size={28} strokeWidth={1.6} color="#185FA5" />;
}

export default function DivisionsPage() {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);
  const language = useSelector(selectLanguage);
  const t = uiText[language] ?? uiText.en;

  useEffect(() => {
    divisionService.getAll(language).then(setDivisions).catch(console.error);
  }, [language])

  const HEADING_FONT_MAP = {
  en: "'Noto Sans', sans-serif",
  si: "'Noto Sans Sinhala', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
};

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <style>{`
        .div-heading { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        .div-body    { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.09);
        }
        .card-hover:hover .division-num {
          background: #185FA5;
          color: white;
          border-color: #185FA5;
        }
        .card-hover:hover .icon-wrap {
          background: #5fa3e7;
        }
        .card-hover:hover .icon-wrap svg {
          color: white !important;
        }
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
        <div className="relative z-10 py-16 flex flex-col items-center justify-center gap-3">
          {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em] div-body">
            {t.bannerSub}
          </p> */}
          <Breadcrumb section="About Us" />
          <h1 className="div-heading text-4xl md:text-5xl font-black text-white tracking-tight">
            {t.bannerTitle}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
        </div>
      </div>

      <main className="flex-1 div-body">

        {/* Intro strip */}
        <section className="bg-white border-b border-gray-100 py-10 px-6">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="w-1 h-10 bg-[#185FA5] rounded-full shrink-0" />
            <p className="text-[0.9rem] text-gray-600 leading-[1.9]">
              {t.intro(t.introCount(divisions.length))}
            </p>
          </div>
        </section>

        {/* Division cards grid */}
        <section className="py-14 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divisions.map((div, i) => (
              <div
                key={div.id}
                className="fade-up card-hover bg-white rounded-2xl border border-gray-200/80 px-6 py-7 flex flex-col gap-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Icon + number row */}
                <div className="flex items-center justify-between">
                  <div className="icon-wrap w-16 h-16 rounded-2xl bg-[#E6F1FB] flex items-center justify-center transition-colors duration-300">
                    {getIcon(i)}
                  </div>
                  <span className="division-num w-8 h-8 rounded-full border-2 border-[#B5D4F4] text-[#185FA5] text-xs font-bold flex items-center justify-center transition-all duration-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-8 h-0.5 bg-[#378ADD] rounded-full" />

                {/* Topic */}
                <h2 className="div-heading text-sm font-bold text-gray-900 leading-snug">
                  {div.topic}
                </h2>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-[1.85] flex-1">
                  {div.description || "—"}
                </p>

                <button
                  onClick={() => navigate(`/divisions/${div.id}`)}
                  className="text-xs font-semibold text-[#185FA5] hover:text-[#0A2F5C] transition-colors flex items-center gap-1 mt-auto"
                >
                  {t.learnMore}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}