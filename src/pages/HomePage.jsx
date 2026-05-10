import React, { useEffect, useRef } from "react";
import AppBar from "../components/AppBar";
import HeroSection from "../components/HeroSection";
import QuickAccess from "../components/QuickAccess";
import ServicesSection from "../components/ServicesSection";
import NewsSection from "../components/NewsSection";
import DfarInfo from "../components/DfarInfo";
import Footer from "../components/Footer";
import YoutubeCard from "../components/YoutubeCard";

function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible"); // reset when out of view
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
function RevealSection({ children, delay = 0 }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className="reveal-section"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <style>{`
        .reveal-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .reveal-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <AppBar />
      <main className="flex-1">
        {/* HeroSection has its own animation, no wrap needed */}
        <HeroSection />

        <RevealSection delay={0}>
          <DfarInfo />
        </RevealSection>

        <RevealSection delay={100}>
          <QuickAccess />
        </RevealSection>

        {/* <RevealSection delay={0}>
          <NewsSection />
        </RevealSection> */}

        <RevealSection delay={0}>
          <ServicesSection />
        </RevealSection>

         <RevealSection delay={0}>
          <YoutubeCard />
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
}