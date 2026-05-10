import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";

const VIDEO = {
  id: "Ns2p0jNQjho",
  channelUrl: "https://www.youtube.com/@departmentoffisheriessrila7760",
};

const TRANSLATIONS = {
  en: {
    sectionTitle: "Watch Our Latest Video",
    videoTitle: "Department of Fisheries and Aquatic Resources",
    description:
      "Learn about the Department of Fisheries and Aquatic Resources of Sri Lanka. We manage and regulate marine fisheries, promote sustainable fishing, support fishing communities, and conserve aquatic resources for future generations.",
    clickToPlay: "Click to play",
    visitChannel: "Visit Our Channel",
    youtube: "YouTube",
  },
  si: {
    sectionTitle: "අපගේ නවතම වීඩියෝව නරඹන්න",
    videoTitle: "ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුව",
    description:
      "ශ්‍රී ලංකාවේ ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුව ගැන දැනගන්න. අපි සමුද්‍ර ධීවර කර්මාන්තය කළමනාකරණය කරමු, තිරසාර ධීවර කර්මාන්තය දිරිගන්වමු, ධීවර ප්‍රජාවන්ට සහය දෙමු, සහ අනාගත පරම්පරාව සඳහා ජලජ සම්පත් ආරක්ෂා කරමු.",
    clickToPlay: "ක්ලික් කර ධාවනය කරන්න",
    visitChannel: "අපගේ නාලිකාවට පිවිසෙන්න",
    youtube: "යූටියුබ්",
  },
  ta: {
    sectionTitle: "எங்கள் சமீபத்திய வீடியோவை பாருங்கள்",
    videoTitle: "மீன்வளம் மற்றும் நீர்வாழ் வளங்கள் திணைக்களம்",
    description:
      "இலங்கையின் மீன்வளம் மற்றும் நீர்வாழ் வளங்கள் திணைக்களம் பற்றி அறிந்துகொள்ளுங்கள். கடல் மீன்பிடித் தொழிலை நிர்வகிக்கிறோம், நிலையான மீன்பிடிப்பை ஊக்குவிக்கிறோம், மீனவ சமூகங்களுக்கு ஆதரவளிக்கிறோம், எதிர்கால தலைமுறைகளுக்காக நீர்வாழ் வளங்களை பாதுகாக்கிறோம்.",
    clickToPlay: "இயக்க கிளிக் செய்யவும்",
    visitChannel: "எங்கள் சேனலை பார்வையிடவும்",
    youtube: "யூடியூப்",
  },
};

export default function YoutubeSection() {
  const [playing, setPlaying] = useState(false);

  // Reads from the same Redux store as Footer — no local language state needed
  const lang = useSelector(selectLanguage);

  // Fallback to "en" if an unrecognised language code is in the store
  const t = TRANSLATIONS[lang] ?? TRANSLATIONS.en;

  const thumbnailUrl = `https://img.youtube.com/vi/${VIDEO.id}/maxresdefault.jpg`;
  const embedUrl     = `https://www.youtube.com/embed/${VIDEO.id}?autoplay=1`;
  const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
  }

  return (
    <section className={`bg-gray-100 py-16 px-6 ${FONT_MAP[lang]}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5 bg-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">{t.sectionTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Video player */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-black">
            {playing ? (
              <iframe
                src={embedUrl}
                title={t.videoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setPlaying(true)}
              >
                <img
                  src={thumbnailUrl}
                  alt={t.videoTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500
                                  flex items-center justify-center shadow-2xl
                                  group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80
                               text-xs font-semibold tracking-wide">
                  {t.clickToPlay}
                </p>
              </div>
            )}
          </div>

          {/* Description side */}
          <div className="flex flex-col gap-5">

            {/* YouTube badge */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/>
                <path fill="#fff" d="M9.75 15.02V8.98L15.5 12z"/>
              </svg>
              <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{t.youtube}</span>
            </div>

            <h3 className="text-xl font-extrabold text-gray-800 leading-snug">
              {t.videoTitle}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              {t.description}
            </p>

            {/* Channel button */}
            <a
              href={VIDEO.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700
                         text-white text-sm font-bold rounded-full transition-all duration-200
                         hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/>
                <path fill="#fff" d="M9.75 15.02V8.98L15.5 12z"/>
              </svg>
              {t.visitChannel}
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}