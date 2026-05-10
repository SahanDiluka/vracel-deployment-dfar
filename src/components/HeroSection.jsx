import React, { useState, useEffect, useRef } from "react";
import HeroImage from "../assets/HeroImage.jpg";
import HeroImage2 from "../assets/HeroImage2.jpg";
import HeroImage3 from "../assets/HeroImage3.jpg";
import HeroImage5 from "../assets/HeroImage5.jpg";
import { selectLanguage } from "../languageSlice";
import { useSelector } from "react-redux";

const images = [HeroImage, HeroImage2, HeroImage3, HeroImage5];

export default function HeroSection() {
  const language = useSelector(selectLanguage);
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const [loadedIndexes, setLoadedIndexes] = useState(new Set([0])); // only load first image initially

  const FONT_MAP = {
    en: "font-sans",
    si: "font-sinhala",
    ta: "font-tamil",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentRef.current + 1) % images.length;
      const upcoming = (next + 1) % images.length; // preload the one after next too

      setLoadedIndexes(prev => new Set([...prev, next, upcoming]));

      currentRef.current = next;
      setCurrent(next);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`relative w-full h-[480px] overflow-hidden ${FONT_MAP[language]}`}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title { animation: fadeUp 0.8s ease-out both; }
        .hero-line  { animation: fadeUp 0.8s ease-out 0.2s both; }
      `}</style>

      {/* Background Images */}
      {images.map((img, i) => (
        <img
          key={i}
          src={loadedIndexes.has(i) ? img : undefined} // no src = no network request
          alt="Fishing boats"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
        className="bg-gradient-to-b from-black/60 via-black/40 to-black/70"
      />

      {/* Content */}
      <div
        style={{ position: "relative", zIndex: 3 }}
        className="h-full flex flex-col items-center justify-center text-center px-6"
      >
        <div className="hero-line w-12 h-0.5 bg-[#1A73C8] mb-4 rounded-full" />

        <h1
          key={`title-${language}-${current}`}
          className="hero-title text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg max-w-3xl"
        >
          {language === "en"
            ? "Welcome to the Department of Fisheries and Aquatic Resources by sahan"
            : language === "si"
            ? "ධීවර හා ජලජ සම්පත් දෙපාර්තමේන්තුවට සාදරයෙන් පිළිගනිමු"
            : language === "ta"
            ? "மீன்வளம் மற்றும் நீர்வாழ் வளங்கள் துறைக்கு நல்வரவு."
            : "Welcome to the Department of Fisheries and Aquatic Resources"}
        </h1>

        <div className="hero-line w-20 h-0.5 bg-white/40 mt-5 rounded-full" />
      </div>

      {/* Dot indicators */}
      <div
        style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}
        className="flex items-center gap-2"
      >
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              // also load the clicked image if not already loaded
              setLoadedIndexes(prev => new Set([...prev, i]));
              currentRef.current = i;
              setCurrent(i);
            }}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 9999,
              background: i === current ? "white" : "rgba(255,255,255,0.4)",
              transition: "all 0.3s",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}