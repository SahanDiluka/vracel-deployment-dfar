import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { newsService } from "../services/news_service";
import { selectLanguage, setLanguage } from "../languageSlice";
import { useSelector } from "react-redux";
const GAP = 24;

function getSlideWidth() {
  if (typeof window === "undefined") return "85%";
  if (window.innerWidth >= 1024) return `calc((100% - ${GAP * 2}px) / 3)`;
  if (window.innerWidth >= 640) return `calc((100% - ${GAP}px) / 2)`;
  return "85%";
}

function NewsCard({ id, topic, pictureUrl, description }) {
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full ">
      <div className="px-4 pt-5 pb-3">
        <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3">
          {topic}
        </h3>
        <img
          src={pictureUrl}
          alt={topic}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      <div className="px-5 pb-5 mt-auto pt-3">
        <button
          onClick={() => navigate(`/news/${id}`)}
          className="inline-block px-6 py-2 bg-[#1A73C8] hover:bg-[#0d4a84] text-white text-xs font-bold rounded-full transition-colors"
        >
          {language === "si" ? " තවත් කියවන්න" : language === "ta" ? " மேலும் படிக்க" : " Read More"}
        </button>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [slideWidth, setSlideWidth] = useState(getSlideWidth);
  const [loading, setLoading] = useState(true);
  // inside your component:
  const language = useSelector(selectLanguage);

  useEffect(() => {
    setLoading(true);
    newsService
      .getbyLanhguage(language)
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [language]); // re-fetches automatically when language changes

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  React.useEffect(() => {
    const handleResize = () => {
      setSlideWidth(getSlideWidth());
      emblaApi?.reInit();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("init", onInit);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
    onInit();
    return () => {
      emblaApi.off("init", onInit);
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index) => emblaApi && emblaApi.scrollTo(index);

  const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
}

  return (
    <section className={`bg-gray-100 py-14 px-6 ${FONT_MAP[language]}`}>
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {language === "si" ? "පුවත්" : language === "ta" ? "செய்தி" : "News"}
        </h2>
        {loading && (
        <div className="max-w-6xl mx-auto space-y-4">

          <div style={{ display: "flex", gap: `${GAP}px`, overflow: "hidden" }}>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                style={{ flex: `0 0 ${slideWidth}`, minWidth: 0 }}
                className="animate-pulse"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="px-4 pt-5 pb-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-40 bg-gray-300 rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                    </div>
                  </div>
                  <div className="px-5 pb-5 mt-auto pt-3">
                    <div className="h-8 bg-blue-500 rounded-full w-24 mx-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        <div ref={emblaRef} style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: `${GAP}px` }}>
            {news.map((item) => (
              <div
                key={item.id}
                style={{ flex: `0 0 ${slideWidth}`, minWidth: 0 }}
              >
                <NewsCard {...item} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === i ? "bg-[#1A73C8] w-6" : "bg-gray-300 w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
