// src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { footerService } from "../services/footer_service";

// ── Platform → icon + colour map ─────────────────────────────────────────────
const PLATFORM_MAP = {
  facebook:  { icon: <FaFacebookF  size={15} />, bg: "#1877F2", label: "Facebook"   },
  twitter:   { icon: <FaXTwitter   size={15} />, bg: "#000000", label: "Twitter / X" },
  youtube:   { icon: <FaYoutube    size={15} />, bg: "#FF0000", label: "YouTube"     },
  linkedin:  { icon: <FaLinkedinIn size={15} />, bg: "#0A66C2", label: "LinkedIn"    },
  instagram: { icon: <FaInstagram  size={15} />, bg: "#E1306C", label: "Instagram"   },
};
const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
 };
export default function Footer() {
  const language = useSelector(selectLanguage);
  // console.log("Selected language in Footer:", language);

  const [relatedLinks, setRelatedLinks] = useState([]);
  const [socialLinks,  setSocialLinks]  = useState([]);

  useEffect(() => {
    footerService.getRelatedLinks(language, true).then(setRelatedLinks).catch(console.error);
  }, [language]);

  useEffect(() => {
    footerService.getSocialLinks(true).then(setSocialLinks).catch(console.error);
  }, []);

  return (
    <footer className={`bg-[#042C53] text-white px-6 py-12 mt-6 ${FONT_MAP[language]}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Get in Touch — static, not editable */}
        <div>
          <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-white">
            {language === "si" ? "සම්බන්ධ වන්න" : language === "ta" ? "தொடர்பு கொள்ளவும்" : "Get in Touch"}
          </h4>
          <div className="flex items-start gap-2.5 text-sm text-[#B5D4F4] mb-3">
            <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#378ADD]" />
            <span>
              {language === "si" ? "ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුව, නව ලේකම් කාර්යාලය, මාලිගාවත්ත, කොළඹ 10." :
               language === "ta" ? "மீன்வளம் மற்றும் நீர்வாழ் வளங்கள் திணைக்களம், புது செயலகம், மாலிகாவத்தை, கொழும்பு 10." : 
               " Department of Fisheries and Aquatic Resources, New Secretariat,Maligawatte, Colombo 10."}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-[#B5D4F4] mb-2">
            <EnvelopeIcon className="w-4 h-4 shrink-0 text-[#378ADD]" />
            <a href="mailto:info@fisheriesdept.gov.lk" className="hover:text-white transition-colors underline underline-offset-2">
              info@fisheriesdept.gov.lk
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-[#B5D4F4]">
            <PhoneIcon className="w-4 h-4 shrink-0 text-[#378ADD]" />
            <span>0112 446 183</span>
          </div>
        </div>

        {/* Related Links — dynamic */}
        <div>
          <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-white">
            {language === "si" ? "අදාළ සබැඳි" : language === "ta" ? "தொடர்புடைய இணைப்புகள்" : "Related Links"}
          </h4>
          <ul className="flex flex-col gap-2">
            {relatedLinks.map(link => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#B5D4F4] hover:text-white transition-colors hover:underline underline-offset-2"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us — dynamic */}
        <div>
          <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-white">
            {language === "si" ? "සමාජ ජාල වල අපව අනුගමනය කරන්න" : language === "ta" ? "சமூக வலைத்தளங்களில் எங்களைப் பின்தொடருங்கள்" : "Follow Us"}
          </h4>
          <div className="flex gap-2.5 mb-6 flex-wrap">
            {socialLinks.map(s => {
              const meta = PLATFORM_MAP[s.platform] ?? { icon: null, bg: "#334155", label: s.platform };
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={meta.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ background: meta.bg }}
                >
                  {meta.icon}
                </a>
              );
            })}
          </div>

          {/* Map embed */}
          <div className="rounded-xl overflow-hidden border border-[#185FA5] h-28">
            <iframe
              title="Location Map"
              src="https://maps.google.com/maps?q=Department+of+Fisheries+and+Aquatic+Resources+Colombo&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#0C447C] text-center text-xs text-[#85B7EB]">
        © {new Date().getFullYear()} Department of Fisheries and Aquatic Resources, Sri Lanka. All rights reserved.
        <button onClick={() => (window.location.href = "/admin")} className="ml-5 text-transparent hover:text-[#85B7EB] transition-colors">
          @admin
        </button>
      </div>
    </footer>
  );
}