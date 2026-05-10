import React from "react";
import HeroImage from "../assets/HeroImage4.jpg";
import { selectLanguage } from "../languageSlice";
import { useSelector } from "react-redux";

export default function HeroSection() {
  const language = useSelector(selectLanguage);

  const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
 };

  const desc = {
    en: "The Department of Fisheries and Aquatic Resources manages and regulates marine fisheries in Sri Lanka. It promotes sustainable fishing, supports fishing communities, conserves marine resources, and oversees fish processing and export. The fisheries sector is important for the country's economy and food security.",
    si: "ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුව ශ්‍රී ලංකාවේ සමුද්‍ර ධීවර කටයුතු කළමනාකරණය සහ නියාමනය කරයි. එය තිරසාර මසුන් ඇල්ලීම ප්‍රවර්ධනය කරයි, ධීවර ප්‍රජාවන්ට සහාය වේ, සමුද්‍ර සම්පත් සංරක්ෂණය කරයි, සහ මත්ස්‍ය සැකසුම් සහ අපනයනය අධීක්ෂණය කරයි.",
    ta: "மீன்வளம் மற்றும் நீர்வளங்கள் திணைக்களம் இலங்கையின் கடல் மீன்வளத்தை நிர்வகித்து ஒழுங்குபடுத்துகிறது. அது நிலையான மீன்பிடிப்பை ஊக்குவிக்கிறது, மீனவ சமூகங்களுக்கு ஆதரவளிக்கிறது, கடல் வளங்களைப் பாதுகாக்கிறது.",
  };

  const learnMore = language === "si" ? "තවත් හදාරන්න"
                  : language === "ta" ? "மேலும் அறிக"
                  : "Learn More";

  const stats = [
    { value: "15",   label: language === "si" ? "දිස්ත්‍රික්"      : language === "ta" ? "மாவட்டங்கள்"             : "Districts"      },
    { value: "150K+", label: language === "si" ? "ධීවරයන්"          : language === "ta" ? "மீனவர்கள்"               : "Fishermen"      },
    { value: "800+",   label: language === "si" ? "ගොඩබෑමේ ස්ථාන"   : language === "ta" ? "தரையிறங்கும் இடங்கள்"   : "Landing Sites"  },
  ];

  return (
    <section className="relative bg-[#0A2F5C] overflow-hidden py-16 px-6 ">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeSlideUp 0.6s ease-out 0.0s  both; }
        .anim-2 { animation: fadeSlideUp 0.6s ease-out 0.15s both; }
        .anim-3 { animation: fadeSlideUp 0.6s ease-out 0.3s  both; }
        .anim-4 { animation: fadeSlideUp 0.6s ease-out 0.45s both; }
      `}</style>

      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Glowing orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#1A73C8]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-[#1A73C8]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image side */}
            <div className="relative h-56 md:h-auto min-h-[260px] overflow-hidden">
              <img
                src={HeroImage}
                alt="Fisheries"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />

              {/* Badge */}
              <div className={`absolute top-4 left-4 bg-[#1A73C8] text-white text-[10px] font-bold
                              uppercase tracking-widest px-3 py-1 rounded-full shadow-lg ${FONT_MAP[language]}`}>
                {language === "si" ? "ශ්‍රී ලංකාව" : language === "ta" ? "இலங்கை" : "Sri Lanka"}
              </div>
            </div>

            {/* Text side — white background */}
            <div className="bg-white p-8 md:p-10 flex flex-col justify-center gap-6">

              {/* Eyebrow */}
              <div className="anim-1 flex items-center gap-2">
                <div className="w-6 h-px bg-[#1A73C8]" />
                <span className={`text-[#1A73C8] text-xs font-bold uppercase tracking-widest ${FONT_MAP[language]}`}>
                  {language === "si" ? "දෙපාර්තමේන්තුව ගැන"
                    : language === "ta" ? "திணைக்களம் பற்றி"
                    : "About the Department"}
                </span>
              </div>

              {/* Description */}
              <p className={`anim-2 text-sm text-gray-600 leading-relaxed ${FONT_MAP[language]}`}>
                {desc[language] ?? desc.en}
              </p>

              {/* Stats row */}
              <div className="anim-3 grid grid-cols-3 gap-3">
                {stats.map((s, i) => (
                  <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center
                                          hover:bg-blue-100 transition-colors duration-200">
                    <p className={`text-[#0A2F5C] font-extrabold text-lg leading-none ${FONT_MAP[language]}`}>
                      {s.value}
                    </p>
                    <p className={`text-gray-500 text-[8px] mt-1 leading-tight ${FONT_MAP[language]}`}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}