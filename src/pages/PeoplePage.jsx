// src/pages/PeoplePage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { peopleService } from "../services/people_service";
import Breadcrumb from "../components/Breadcrumb";

const ACCENT = "#1A4FA3";
const ACCENT2 = "#E8611A";

function initials(name = "") {
  return name
    .split(" ")
    .filter((w) => /\S/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function AvatarFallback({ name }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT2}22)`,
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}
      >
        {initials(name) || "?"}
      </div>
    </div>
  );
}
function MemberModal({ member, onClose }) {
  const [imgErr, setImgErr] = useState(false);
  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden w-full max-w-md"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full p-1 text-white"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          ✕
        </button>

        <div className="flex flex-col">
          {/* Image */}
          <div
            className="w-full flex items-center justify-center mt-20"
            style={{ height: "260px" }}
          >
            {member.imageUrl && !imgErr ? (
              <img
                className="rounded-lg object-cover object-top"
                src={member.imageUrl}
                alt={member.name}
                onError={() => setImgErr(true)}
                style={{
                  width: "60%",
                  height: "auto",
                }}
              />
            ) : (
              <AvatarFallback name={member.name} />
            )}
          </div>

          {/* Info panel */}
          <div className="p-5 flex flex-col gap-3 mt-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{member.name}</h2>
              <p className="text-sm font-medium" style={{ color: "#185FA5" }}>
                {member.position}
              </p>
            </div>

            <div className="border-t pt-3 flex flex-col gap-2 text-sm text-gray-700">
              {member.email && (
                <div className="flex items-center gap-2">
                  <span style={{ color: "#93c5fd" }}>✉</span>
                  <span>{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2">
                  <span style={{ color: "#93c5fd" }}>📞</span>
                  <span>{member.phone}</span>
                </div>
              )}
              {member.email && (
                <div className="flex items-center gap-2">
                  <span style={{ color: "#93c5fd" }}>🏢</span>
                  <span>{member.email}</span>
                </div>
              )}

              {member.description && (
                <div className="overflow-y-auto max-h-24">
                  <p className="text-gray-500 text-xs leading-relaxed mt-1">
                    Description:
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-1 break-words whitespace-pre-wrap">
                    {member.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function MemberCard({ member, index, onClick }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="member-card cursor-pointer flex flex-col rounded-2xl overflow-hidden transition-all hover:shadow-2xl"
      style={{
        animationDelay: `${index * 0.07}s`,
        boxShadow: "0 4px 24px rgba(26,79,163,0.30)",
      }}
      onClick={() => onClick(member)}
    >
      <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 hover:scale-110">
        <div className="w-full ">
          {member.imageUrl && !imgErr ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              onError={() => setImgErr(true)}
              className="w-full object-cover object-top"
            />
          ) : (
            <AvatarFallback name={member.name} />
          )}
        </div>

        {/* Blue info panel — sits ON TOP of the image at the bottom */}
        <div className=" px-8 pt-10 pb-4 flex flex-col bg-[#185FA5]">
          {/* <div className="w-7 h-0.5 rounded-full" style={{ background: "rgba(147,197,253,0.5)" }} /> */}
          <div className=" absolute left-0 bottom-0 right-0 px-5 py-3 flex flex-col items-start gap-1">
            <h3 className="font-bold text-white leading-snug text-sm tracking-wide">
              {member.name}
            </h3>
            <p
              className="text-xs font-medium leading-snug"
              style={{ color: "#93c5fd" }}
            >
              {member.position}
            </p>
          </div>
        </div>
      </div>
      {/* Full image — no height restriction */}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-100 rounded-3xl overflow-hidden animate-pulse">
      <div
        className="w-full"
        style={{ paddingBottom: "100%", background: "#e5e7eb" }}
      />
      <div className="p-5 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      </div>
    </div>
  );
}

export default function PeoplePage() {
  const language = useSelector(selectLanguage);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    peopleService
      .getAllPeopleTopics(language, true)
      .then(setTopics)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [language]);

  const bannerLabel =
    {
      si: "ජනතාව",
      ta: "மக்கள்",
      en: "Our People",
    }[language] || "Our People";

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F6FA]"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .member-card { animation: fadeUp 0.5s ease both; opacity:0; }
        .section-title { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <AppBar />

      {/* Hero banner */}
      <div className="relative bg-[#185FA5] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative z-10 py-16 flex flex-col items-center gap-3">
          {/* <p className="text-[#B5D4F4] text-xs font-semibold uppercase tracking-[0.25em]">
            DFAR
          </p> */}
          <Breadcrumb />
          <h1 className="official-name text-4xl md:text-5xl font-black text-white tracking-tight">
            {language === "si"
              ? "අපි ගැන"
              : language === "ta"
                ? "எங்களைப் பற்றி"
                : "Contact Details"}
          </h1>
          <div className="w-12 h-1 bg-white/40 rounded-full mt-1" />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24 text-red-400">
              Failed to load people.
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              No content available.
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {topics.map((topic) => (
                <section key={topic.id}>
                  {/* Section heading */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="w-1.5 h-10 rounded-full"
                      style={{ background: ACCENT }}
                    />
                    <h2 className="section-title text-2xl md:text-3xl font-black text-gray-900">
                      {topic.title}
                    </h2>
                    {/* <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {topic.members.length} {topic.members.length === 1 ? "Person" : "People"}
                    </span> */}
                  </div>

                  {/* Member grid */}
                  {topic.members.length === 0 ? (
                    <p className="text-gray-400 text-sm pl-5">
                      No members in this section.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                      {topic.members.map((member, i) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          index={i}
                          onClick={setSelectedMember}
                        />
                      ))}
                      <MemberModal
                        member={selectedMember}
                        onClose={() => setSelectedMember(null)}
                      />
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
