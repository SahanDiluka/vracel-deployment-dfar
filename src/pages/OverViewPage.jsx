import React from "react";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import Breadcrumb from "../components/Breadcrumb";

const content = {
  en: {
    bannerSub: "About Us",
    bannerTitle: "Overview",
    vision: {
      title: "Our Vision",
      description: "To provide an optimum contribution to the national economy through strengthening the socio–economic status of the fisher communities while maintaining the fisheries and aquatic resources in a sustainable manner.",
    },
    mission: {
      title: "Our Mission",
      description: "To provide an optimum contribution to the national economy through strengthening the socio–economic status of the fisher communities while maintaining the fisheries and aquatic resources in a sustainable manner.",
    },
    welcomeTitle: "Welcome to the Department of Fisheries and Aquatic Resources",
    paragraphs: [
      "The fisheries industry is a key sector in Sri Lanka which is capable of making a greater contribution towards the GDP of the country. The sector fulfills the requirements of nutritional intake of the people while constituting livelihood of about 2 million population. The Department of Fisheries and Aquatic Resources is the main institute that holds the responsibility for development and management of fisheries sector during different period of time through various methodologies.",
      "Currently, the attention of the Department is mainly focused on directing fisher folks towards a responsible fisheries industry in compliance with international conventions, laws and rules. Nevertheless, a host of activities and programmes aiming at developing the socio-economic status of fisher folk were launched in the year under review and it is expected to improve the capability of fisher folk to exploit high quality fish harvest by means of upgrading their living standard.",
      "In addition, one of the main roles of the Department is to protect and regulate the regenerating but limited fisheries and aquatic resources for future generation through proper management of fishing fleet and fishing gear.",
    ],
  },
  si: {
    bannerSub: "අප ගැන",
    bannerTitle: "දළ විශ්ලේෂණය",
    vision: {
      title: "අපගේ දැක්ම",
      description: "ධීවර හා ජලජ සම්පත් තිරසාර ලෙස පවත්වාගෙන යමින් ධීවර ප්‍රජාවේ සමාජ-ආර්ථික තත්ත්වය ශක්තිමත් කිරීම තුළින් ජාතික ආර්ථිකයට ප්‍රශස්ත දායකත්වයක් ලබා දීම.",
    },
    mission: {
      title: "අපගේ මෙහෙවර",
      description: "ධීවර හා ජලජ සම්පත් තිරසාර ලෙස පවත්වාගෙන යමින් ධීවර ප්‍රජාවේ සමාජ-ආර්ථික තත්ත්වය ශක්තිමත් කිරීම තුළින් ජාතික ආර්ථිකයට ප්‍රශස්ත දායකත්වයක් ලබා දීම.",
    },
    welcomeTitle: "ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුවට\nසාදරයෙන් පිළිගනිමු",
    paragraphs: [
      "ධීවර කර්මාන්තය ශ්‍රී ලංකාවේ ප්‍රධාන අංශයක් වන අතර, රටේ දළ දේශීය නිෂ්පාදිතයට (GDP) වැඩි දායකත්වයක් ලබා දීමේ හැකියාව ඇත. මෙම අංශය ජනතාවගේ පෝෂණ අවශ්‍යතා සපුරාලන අතරම ජනගහනයෙන් ආසන්න වශයෙන් මිලියන 2ක් සඳහා ජීවනෝපාය සලසා දේ. ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුව විවිධ ක්‍රමවේද ඔස්සේ ධීවර අංශයේ සංවර්ධනය හා කළමනාකරණය සඳහා වගකීම දරන ප්‍රධාන ආයතනයයි.",
      "වර්තමානයේ දෙපාර්තමේන්තුවේ අවධානය ප්‍රධාන වශයෙන් යොමු වී ඇත්තේ ජාත්‍යන්තර සම්මුතීන්, නීති හා රෙගුලාසිවලට අනුකූලව ධීවරයන් වගකිව යුතු ධීවර කර්මාන්තයකට යොමු කිරීම කෙරෙහිය. ධීවරයන්ගේ සමාජ-ආර්ථික තත්ත්වය නඟා සිටුවීමේ ක්‍රියාකාරකම් හා වැඩසටහන් ගණනාවක් ක්‍රියාත්මක කරනු ලැබ ඇති අතර, ජීවන මට්ටම නැංවීම ඔස්සේ ධීවරයන්ට උසස් තත්ත්වයේ මසුන් ඇල්ලීමේ ධාරිතාව වර්ධනය කිරීමට අපේක්ෂා කෙරේ.",
      "එසේම, යලි ජනනය වන නමුත් සීමිත ධීවර හා ජලජ සම්පත් ආරක්ෂා කිරීම හා නියාමනය කිරීම මෙන්ම, ධීවර නෞකා හා ධීවර උපකරණ නිසි ලෙස කළමනාකරණය කිරීම ද දෙපාර්තමේන්තුවේ ප්‍රධාන කාර්යභාරයන් අතර වේ.",
    ],
  },
  ta: {
    bannerSub: "எங்களைப் பற்றி",
    bannerTitle: "கண்ணோட்டம்",
    vision: {
      title: "எங்கள் தொலைநோக்கு",
      description: "மீன்வளம் மற்றும் நீர்வாழ் வளங்களை நிலையான முறையில் பராமரிக்கும் அதே வேளை, மீனவ சமூகங்களின் சமூக-பொருளாதார நிலையை மேம்படுத்துவதன் மூலம் தேசிய பொருளாதாரத்திற்கு உகந்த பங்களிப்பை வழங்குதல்.",
    },
    mission: {
      title: "எங்கள் நோக்கம்",
      description: "மீன்வளம் மற்றும் நீர்வாழ் வளங்களை நிலையான முறையில் பராமரிக்கும் அதே வேளை, மீனவ சமூகங்களின் சமூக-பொருளாதார நிலையை மேம்படுத்துவதன் மூலம் தேசிய பொருளாதாரத்திற்கு உகந்த பங்களிப்பை வழங்குதல்.",
    },
    welcomeTitle: "மீன்வளம் மற்றும் நீர்வாழ் வளங்கள்\nதிணைக்களத்திற்கு வரவேற்கிறோம்",
    paragraphs: [
      "மீன்வளத் துறை இலங்கையின் முக்கிய துறையாகும், இது நாட்டின் மொத்த உள்நாட்டு உற்பத்தியில் (GDP) அதிக பங்களிப்பை வழங்கும் திறன் கொண்டது. இந்தத் துறை மக்களின் ஊட்டச்சத்து தேவைகளை நிறைவேற்றுவதோடு, சுமார் 20 லட்சம் மக்களுக்கு வாழ்வாதாரத்தையும் வழங்குகிறது. மீன்வளம் மற்றும் நீர்வாழ் வளங்கள் திணைக்களம், பல்வேறு காலகட்டங்களில் பல்வேறு முறைகளில் மீன்வளத் துறையின் மேம்பாடு மற்றும் நிர்வாகத்திற்கான பொறுப்பை வகிக்கும் முக்கிய நிறுவனமாகும்.",
      "தற்போது, திணைக்களத்தின் கவனம் முக்கியமாக சர்வதேச மரபுகள், சட்டங்கள் மற்றும் விதிகளுக்கு இணங்க மீனவர்களை பொறுப்பான மீன்வளத் துறையை நோக்கி வழிநடத்துவதில் செலுத்தப்படுகிறது. மீனவர்களின் சமூக-பொருளாதார நிலையை மேம்படுத்துவதை நோக்கமாகக் கொண்ட பல நடவடிக்கைகளும் திட்டங்களும் தொடங்கப்பட்டுள்ளன.",
      "மேலும், மீண்டும் உற்பத்தியாகும் ஆனால் வரையறுக்கப்பட்ட மீன்வளம் மற்றும் நீர்வாழ் வளங்களை எதிர்கால தலைமுறைக்காக பாதுகாத்து ஒழுங்குபடுத்துவதும், மீன்பிடி கப்பல்கள் மற்றும் மீன்பிடி கருவிகளை சரியான முறையில் நிர்வகிப்பதும் திணைக்களத்தின் முக்கிய பணிகளில் ஒன்றாகும்.",
    ],
  },
};

const visionIcon = (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
    <circle cx="32" cy="32" r="28" stroke="#93C5FD" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="18" stroke="#60A5FA" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="9"  stroke="#3B82F6" strokeWidth="2.5" />
    <path d="M32 14 C38 20,44 26,38 34 C34 40,26 40,22 34 C16 26,22 18,32 14Z"
      stroke="#3B82F6" strokeWidth="2" fill="#DBEAFE" opacity="0.6" />
    <circle cx="32" cy="32" r="4" fill="#3B82F6" />
  </svg>
);

const missionIcon = (
  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
    <path d="M12 44 C12 28, 24 16, 32 12 C40 16, 52 28, 52 44" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 44 C20 32, 26 22, 32 18 C38 22, 44 32, 44 44" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="12" x2="32" y2="52" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="12" y1="44" x2="52" y2="44" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="32" cy="44" r="4" fill="#3B82F6"/>
  </svg>
);

export default function OverViewPage() {
  const language = useSelector(selectLanguage);
  const t = content[language] ?? content.en;
  const HEADING_FONT_MAP = {
  en: "'Noto Sans', sans-serif",
  si: "'Noto Sans Sinhala', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
};
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <style>{`
        .overview-heading { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        .overview-body    { font-family: ${HEADING_FONT_MAP[language] || HEADING_FONT_MAP.en}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.25s both; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
      `}</style>

      <AppBar />

      {/* Banner */}
      <div className="relative bg-[#185FA5] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }}
        />
        <div className="relative z-10 py-16 flex flex-col items-center justify-center gap-3">
          {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em] overview-body">
            {t.bannerSub}
          </p> */}
          <Breadcrumb section="About Us" />
          <h1 className="overview-heading text-4xl md:text-5xl font-black text-white tracking-tight">
            {t.bannerTitle}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
        </div>
      </div>

      <main className="flex-1 overview-body">

        {/* Vision / Mission cards */}
        <section className="bg-[#f4f4f4] py-14 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: visionIcon,  ...t.vision,  cls: "fade-up-1" },
              { icon: missionIcon, ...t.mission, cls: "fade-up-2" },
            ].map((card, i) => (
              <div key={i} className={`card-hover bg-white rounded-2xl border border-gray-200/80 px-8 py-9 flex flex-col gap-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ${card.cls}`}>
                <div className="w-16 h-16 rounded-2xl bg-[#E6F1FB] flex items-center justify-center">
                  {card.icon}
                </div>
                <div className="w-8 h-0.5 bg-[#378ADD] rounded-full" />
                <h2 className="overview-heading text-lg font-bold text-gray-900">{card.title}</h2>
                <p className="text-sm text-gray-500 leading-[1.85]">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Welcome text block */}
        <section className="bg-white py-14 px-6 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 bg-[#185FA5] rounded-full" />
              <h2 className="overview-heading text-base font-bold text-gray-900 leading-snug whitespace-pre-line">
                {t.welcomeTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {t.paragraphs.map((p, i) => (
                <p key={i} className="text-[0.9rem] text-gray-600 leading-[1.9] pl-4 border-l-2 border-[#B5D4F4]">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

      </main>
             
      <Footer />
    </div>
  );
}