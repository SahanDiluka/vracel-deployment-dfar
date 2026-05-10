// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { divisionService } from "../services/division_service";
// import { useSelector } from "react-redux";
// import { selectLanguage } from "../languageSlice";

// // Cycle of accent colours for the solid tiles
// const TILE_COLORS = [
//   "#E8674A", // coral-red
//   "#F0A830", // amber
//   "#2BAE72", // green
//   "#29AECE", // teal-blue
//   "#7B5EA7", // purple
//   "#E85D75", // rose
// ];

// // Simple fish/water icon for fisheries context
// function DivisionIcon() {
//   return (
//     <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 opacity-80" xmlns="http://www.w3.org/2000/svg">
//       <path d="M6 24C6 24 12 10 24 10C36 10 42 24 42 24C42 24 36 38 24 38C12 38 6 24 6 24Z"
//             stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.15"/>
//       <circle cx="30" cy="20" r="2.5" fill="white"/>
//       <path d="M42 24L48 18M42 24L48 30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
//       <path d="M18 24C18 24 20 20 24 20C28 20 30 24 30 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//     </svg>
//   );
// }

// export default function ServicesSection() {
//   const [divisions, setDivisions] = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const language                  = useSelector(selectLanguage);
//   const navigate                  = useNavigate();

//   useEffect(() => {
//     setLoading(true);
//     divisionService
//       .getAll(language)
//       .then(setDivisions)
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [language]);

//   const heading =
//     language === "si" ? "අපගේ අංශ ගවේෂණය කරමු"
//     : language === "ta" ? "நமது பிரிவுகளை ஆராய்வோம்"
//     : "Let's Explore Our Divisions";

//   const clickLabel =
//     language === "si" ? "ක්ලික් කරන්න"
//     : language === "ta" ? "கிளிக் செய்யவும்"
//     : "Click Here";

//   // Each division gets two tiles: [color-tile, photo-tile]
//   // We flatten them into a single array and render in a 4-col grid
//   const tiles = loading
//     ? [...Array(12)].map((_, i) => ({ type: "skeleton", id: i }))
//     : divisions.flatMap((division, i) => [
//         {
//           type: "color",
//           id:   `${division.id}-color`,
//           title: division.topic,
//           intro: division.intro,
//           color: TILE_COLORS[i % TILE_COLORS.length],
//           path:  `/divisions/${division.id}`,
//         },
//         {
//           type:  "photo",
//           id:    `${division.id}-photo`,
//           title: division.topic,
//           image: division.pictureUrl,
//           path:  `/divisions/${division.id}`,
//         },
//       ]);
// const FONT_MAP = {
//   en: "font-sans",
//   si: "font-sinhala",
//   ta: "font-tamil",
// }
//   return (
//     <section className={`bg-[#084b9d] py-16 px-6 ${FONT_MAP[language]}`}>
//       <style>{`
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .tile { animation: fadeSlideUp 0.45s ease-out forwards; opacity: 0; }
//       `}</style>

//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="mb-10 tile" style={{ animationDelay: "0ms" }}>
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-8 h-0.5 bg-[#1A73C8]" />
//             <p className="text-[#1A73C8] text-xs font-bold uppercase tracking-widest">
//               {language === "si" ? "අංශ" : language === "ta" ? "பிரிவுகள்" : "Divisions"}
//             </p>
//           </div>
//           <h2 className="text-2xl md:text-3xl font-black text-white">{heading}</h2>
//         </div>

//         {/* Tile grid — 4 columns */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
//           {tiles.map((tile, i) => {
//             const delay = `${i * 60}ms`;

//             if (tile.type === "skeleton") {
//               return (
//                 <div
//                   key={tile.id}
//                   className="aspect-square animate-pulse"
//                   style={{ background: i % 2 === 0 ? "#0a3d6b" : "#0c4880" }}
//                 />
//               );
//             }

//             if (tile.type === "color") {
//               return (
//                 <div
//                   key={tile.id}
//                   className="tile aspect-square flex flex-col items-center justify-center
//                              gap-3 p-5 cursor-pointer group relative overflow-hidden"
//                   style={{ background: tile.color, animationDelay: delay }}
//                   onClick={() => navigate(tile.path)}
//                 >
//                   {/* subtle radial highlight */}
//                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                        style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.12), transparent 70%)" }} />
//                   <DivisionIcon />
//                   <p className="text-white font-bold text-sm text-center leading-snug line-clamp-3 z-10">
//                     {tile.title}
//                   </p>
//                   {tile.intro && (
//                     <p className="hidden md:block text-white/70 text-[10px] text-center leading-relaxed line-clamp-2 z-10">
//                       {tile.intro}
//                     </p>
//                   )}
//                 </div>
//               );
//             }

//             // photo tile
//             return (
//               <div
//                 key={tile.id}
//                 className="tile aspect-square relative overflow-hidden cursor-pointer group"
//                 style={{ animationDelay: delay }}
//                 onClick={() => navigate(tile.path)}
//               >
//                 <img
//                   src={tile.image}
//                   alt={tile.title}
//                   className="absolute inset-0 w-full h-full object-cover
//                              group-hover:scale-110 transition-transform duration-500"
//                 />
//                 {/* dark overlay */}
//                 <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

//                 {/* Click Here badge */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="px-4 py-1.5 bg-black/50 group-hover:bg-black/70
//                                    text-white text-xs font-bold rounded-full
//                                    border border-white/40
//                                    transition-all duration-300 group-hover:scale-105">
//                     {clickLabel}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </section>
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { divisionService } from "../services/division_service";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import {
  FaFish,
  FaChartLine,
  FaCheckCircle,
  FaShip,
  FaLaptopCode,
  FaGavel,
  FaMoneyBillWave,
  FaBuilding,
  FaSearch,
} from "react-icons/fa";

const TILE_COLORS = ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff"];

const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
};

const divisionIcons = [
  <FaFish className="text-[#1A73C8] text-2xl" />,
  <FaChartLine className="text-[#1A73C8] text-2xl" />,
  <FaCheckCircle className="text-[#1A73C8] text-2xl" />,
  <FaShip className="text-[#1A73C8] text-2xl" />,
  <FaLaptopCode className="text-[#1A73C8] text-2xl" />,
  <FaGavel className="text-[#1A73C8] text-2xl" />,
  <FaMoneyBillWave className="text-[#1A73C8] text-2xl" />,
  <FaBuilding className="text-[#1A73C8] text-2xl" />,
  <FaSearch className="text-[#1A73C8] text-2xl" />,
];
function DivisionIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 24C6 24 12 10 24 10C36 10 42 24 42 24C42 24 36 38 24 38C12 38 6 24 6 24Z"
            stroke="#1A73C8" strokeWidth="2.5" fill="#1A73C8" fillOpacity="0.1"/>
      <circle cx="30" cy="20" r="2.5" fill="#1A73C8"/>
      <path d="M42 24L48 18M42 24L48 30" stroke="#1A73C8" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M18 24C18 24 20 20 24 20C28 20 30 24 30 24" stroke="#1A73C8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Truncates long text to first sentence or 120 chars
function shortIntro(text) {
  if (!text) return "";
  const first = text.split(/[.!?]/)[0].trim();
  return first.length > 100 ? first.slice(0, 117) + "…" : first + ".";
}

export default function ServicesSection() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const language                  = useSelector(selectLanguage);
  const navigate                  = useNavigate();

  useEffect(() => {
    setLoading(true);
    divisionService
      .getAll(language)
      .then(setDivisions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [language]);

  const heading =
    language === "si" ? "අපගේ අංශ ගවේෂණය කරමු"
    : language === "ta" ? "நமது பிரிவுகளை ஆராய்வோம்"
    : "Let's Explore Our Divisions";

  const clickLabel =
    language === "si" ? "ක්ලික් කරන්න"
    : language === "ta" ? "கிளிக் செய்யவும்"
    : "Click Here";

  // Each division = 2 tiles (color + photo)
  // 6-column grid = 3 divisions per row
  const tiles = loading
    ? [...Array(12)].map((_, i) => ({ type: "skeleton", id: i }))
    : divisions.flatMap((division, i) => [
        {
          type:  "color",
          id:    `${division.id}-color`,
          title: division.topic,
          intro: shortIntro(division.intro),
          color: TILE_COLORS[i % TILE_COLORS.length],
          path:  `/divisions/${division.id}`,
        },
        {
          type:  "photo",
          id:    `${division.id}-photo`,
          title: division.topic,
          image: division.pictureUrl,
          path:  `/divisions/${division.id}`,
        },
      ]);

  return (
    <section className={`bg-[#084b9d] py-16 px-6 ${FONT_MAP[language]}`}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tile { animation: fadeSlideUp 0.45s ease-out forwards; opacity: 0; }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 tile" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-[#1A73C8]" />
            <p className="text-[#1A73C8] text-xs font-bold uppercase tracking-widest">
              {language === "si" ? "අංශ" : language === "ta" ? "பிரிவுகள்" : "Divisions"}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">{heading}</h2>
        </div>

        {/* Grid — 6 cols = 3 divisions per row (2 tiles each) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
          {tiles.map((tile, i) => {
            const delay = `${i * 50}ms`;

            if (tile.type === "skeleton") {
              return (
                <div
                  key={tile.id}
                  className="aspect-square animate-pulse"
                  style={{ background: i % 2 === 0 ? "#0a3d6b" : "#0c4880" }}
                />
              );
            }

            if (tile.type === "color") {
              return (
                <div
                  key={tile.id}
                  className="tile aspect-square flex flex-col items-start justify-center
                             gap-2 p-4 cursor-pointer group relative overflow-hidden
                             border-[3px] border-[#1A73C8]"
                  style={{ background: tile.color, animationDelay: delay }}
                  onClick={() => navigate(tile.path)}
                >
                  {/* hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "radial-gradient(circle at center, rgba(26,115,200,0.08), transparent 70%)" }}
                  />

                  {/* icon top-left */}
                  <div className="absolute top-3 left-3 mb-4">
                    {divisionIcons[i % divisionIcons.length]}
                  </div>

                  {/* text bottom — same padding/height as photo tile bottom area */}
                  <div className="flex flex-col w-full mb-4" style={{ minHeight: "52px" }}>
                    <p className="text-[#0A2F5C] font-bold text-[11px] md:text-[16px] leading-snug line-clamp-2 mb-1">
                      {tile.title}
                    </p>
                    {tile.intro && (
                      <p className="text-[#1A73C8] text-[9px] md:text-[12px] line-clamp-3">
                        {tile.intro}
                      </p>
                    )}
                  </div>

                  {/* bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1A73C8]
                                  scale-x-0 group-hover:scale-x-100
                                  transition-transform duration-300 origin-left" />
                </div>
              );
            }

            // photo tile
            return (
              <div
                key={tile.id}
                className="tile aspect-square relative overflow-hidden cursor-pointer group"
                style={{ animationDelay: delay }}
                onClick={() => navigate(tile.path)}
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="absolute inset-0 w-full h-full object-cover
                             group-hover:scale-110 transition-transform duration-500"
                />

                {/* gradient overlay — stronger at bottom */}
                <div className="absolute inset-0"
                     style={{ background: "linear-gradient(to top, rgba(4,35,74,0.85) 0%, rgba(4,35,74,0.2) 50%, transparent 100%)" }} />

                {/* title + button at bottom — same p-3 as color tile */}
                <div className="absolute bottom-0 left-0 right-0 p-3" style={{ minHeight: "52px" }}>
                  <p className="text-white font-bold text-[11px] md:text-[16px]
                                leading-snug line-clamp-2 mb-1">
                    {tile.title}
                  </p>
                  <span className="inline-block px-3 py-1 bg-white/15
                                   group-hover:bg-white/30
                                   text-white text-[9px] md:text-[10px] font-bold
                                   rounded-full border border-white/30
                                   transition-all duration-300 group-hover:scale-105
                                   backdrop-blur-sm">
                    {clickLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}