import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectLanguage, setLanguage } from "../languageSlice";
import { useNavbar } from "../hooks/information_hook";
import { useDownloadNavbar } from "../hooks/download_hook";
import { useOfficerNavbar } from "../hooks/officer_hook";
import { useTenderNavbar } from "../hooks/tender_hook";
import logo from "../assets/logo.png";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧", full: "English" },
  { code: "si", label: "SI", flag: "🇱🇰", full: "සිංහල" },
  { code: "ta", label: "TA", flag: "🇱🇰", full: "தமிழ்" },
];

const FONT_MAP = {
  en: "font-sans",
  si: "font-sinhala",
  ta: "font-tamil",
};

const TRANSLATIONS = {
  en: {
    home: "Home",
    aboutUs: "About Us",
    overview: "Overview",
    ministry: "Ministry",
    directorGeneral: "Director General",
    divisions: "Divisions",
    districtOffices: "District Offices",
    information: "Information",
    download: "Downloads",
    officer: "Officer",
    callingForTender: "Calling For Tender",
    payOnline: "Pay Online",
    loginForOfficers: "Login For Officers",
    contactUs: "Contact Details",
    regulations: "Regulations",
    ByCatchRelease: "By Catch Release",
  },
  si: {
    home: "මුල් පිටුව",
    aboutUs: "අප ගැන",
    overview: "දළ විශ්ලේෂණය",
    ministry: "අමාත්‍යාංශය",
    directorGeneral: "අධ්‍යක්ෂ ජනරාල්",
    divisions: "අංශ",
    districtOffices: "දිස්ත්‍රික් කාර්යාල",
    information: "තොරතුරු",
    download: "බාගත කිරීම",
    officer: "නිලධාරී",
    callingForTender: "ටෙන්ඩර් කැඳවීම",
    payOnline: "මාර්ගගත ගෙවීම්",
    loginForOfficers: "නිලධාරීන් සඳහා පිවිසුම",
    contactUs: "අප අමතන්න",
    regulations: "නියාමන",
    ByCatchRelease: "අතුරු අස්වැන්න මුදාහැරීම",
  },
  ta: {
    home: "முகப்பு",
    aboutUs: "எங்களை பற்றி",
    overview: "மேலோட்டம்",
    ministry: "அமைச்சகம்",
    directorGeneral: "இயக்குநர் நாயகம்",
    divisions: "பிரிவுகள்",
    districtOffices: "மாவட்ட அலுவலகங்கள்",
    information: "தகவல்",
    download: "பதிவிறக்கம்",
    officer: "அதிகாரி",
    callingForTender: "ஏலம் கோருதல்",
    payOnline: "நிகழ்நிலை கொடுப்பனவு",
    loginForOfficers: "அதிகாரிகளுக்கான உள்நுழைவு",
    contactUs: "எங்களைப் பற்றி",
    regulations: "ஒழுங்குமுறைகள்",
    ByCatchRelease: "உபரி பிடித்தல்கள்",
  },
};

const useStaticPages = (t) => {
  return [
    { name: t.home, path: "/" },
    {
      name: t.aboutUs,
      children: [
        { name: t.overview, path: "/about/overview" },
        { name: t.ministry, path: "/about/ministry" },
        { name: t.directorGeneral, path: "/about/Director General" },
        { name: t.divisions, path: "/about/division" },
        { name: t.districtOffices, path: "/about/map" },
      ],
    },
    { name: t.contactUs, path: "/Contact Details" },
    { name: t.information, children: [
      {name:t.ByCatchRelease, path: "/bycatch-release"}
    ] },
    { name: t.download, children: [
        { name: t.regulations, path: "/regulations" }
      ] 
    },
    { name: t.officer, children: [] },
    {
      name: t.payOnline,
      children: [
        {
          name: t.payOnline,
          path: "https://msdfar.hynetz.com/payment/backend/web/payment/create",
        },
        {
          name: t.loginForOfficers,
          path: "https://msdfar.hynetz.com/payment/backend/web/login",
        },
      ],
    },
    { name: t.callingForTender, children: [] },
  ];
};

// ── Language Switcher ─────────────────────────────────────────────────────────
function LanguageSwitcher({ mobile = false }) {
  const dispatch = useDispatch();
  const current = useSelector(selectLanguage);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (code) => {
    dispatch(setLanguage(code));
    setOpen(false);
  };
  const active = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div ref={ref} className={`relative ${mobile ? "mt-2 w-fit" : "ml-3"}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 cursor-pointer hover:border-[#378ADD] hover:text-[#185FA5] transition-colors"
      >
        <span>{active.flag}</span>
        <span className="font-medium">{active.label}</span>
        <ChevronDownIcon
          className={`w-3 h-3 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute ${
            mobile ? "left-0" : "right-0"
          } top-9 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 px-1 z-50`}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                current === l.code
                  ? "bg-[#E6F1FB] text-[#185FA5] font-semibold"
                  : "text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5]"
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.full}</span>
              {current === l.code && (
                <svg
                  className="ml-auto w-3.5 h-3.5 text-[#185FA5]"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 8l4 4 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AppBar ────────────────────────────────────────────────────────────────────
export default function AppBar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const dropdownRef = useRef(null);

  //  Hooks called at top level — NOT inside .map()
  const lang = useSelector(selectLanguage);
  const t = TRANSLATIONS[lang] ?? TRANSLATIONS.en;

  const { items: cmsItems, loading: cmsLoading } = useNavbar();
  const { items: downloadItems, loading: downloadLoading } = useDownloadNavbar();
  const { items: officerItems, loading: officerLoading } = useOfficerNavbar();
  const { items: tenderItems, loading: tenderLoading } = useTenderNavbar();

  const STATIC_PAGES = useStaticPages(t);

  // Merge dynamic CMS items into their respective nav sections
  const mergedStaticPages = STATIC_PAGES.map((page) => {
    if (page.name === t.information) {
      return {
        ...page,
        children: [
         
          ...cmsItems.map((item) => ({
            name: item.label,
            path: item.pageType === "direct_link" ? null : item.path,
            url: item.url,
            pageType: item.pageType,
            external: item.pageType === "direct_link",
          })),
           ...page.children,
        ],
      };
    }
    if (page.name === t.download) {
  return {
    ...page,
    children: [
      ...page.children, // keep "Regulations"
      ...downloadItems.map((item) => ({
        name: item.label,
        path: item.pageType === "direct_link" ? null : item.path,
        url: item.url,
        pageType: item.pageType,
        external: item.pageType === "direct_link",
      })),
    ],
  };
}
    if (page.name === t.officer) {
      return {
        ...page,
        children: officerItems.map((item) => ({
          name: item.label,
          path: item.pageType === "direct_link" ? null : item.path,
          url: item.url,
          pageType: item.pageType,
          external: item.pageType === "direct_link",
        })),
      };
    }
    if (page.name === t.callingForTender) {
      return {
        ...page,
        children: tenderItems.map((item) => ({
          name: item.label,
          path: item.pageType === "direct_link" ? null : item.path,
          url: item.url,
          pageType: item.pageType,
          external: item.pageType === "direct_link",
        })),
      };
    }
    return page;
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (page) => {
    if (page.path) return location.pathname === page.path;
    if (page.children)
      return page.children.some((c) => c.path && location.pathname === c.path);
    return false;
  };

  const renderChild = (child, closeFn) => {
    if (child.external) {
      return (
        <a
          key={child.name}
          href={child.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeFn}
          className={`block px-4 py-2 text-[13px] ${FONT_MAP[lang]} text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors rounded-lg mx-1`}
        >
          {child.name}
        </a>
      );
    }
    return (
      <Link
        key={child.name}
        to={child.path}
        onClick={closeFn}
        className={`block px-4 py-2 text-[13px] ${FONT_MAP[lang]} text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors rounded-lg mx-1 ${
          location.pathname === child.path
            ? "font-semibold text-[#1A73C8] bg-[#E6F1FB]"
            : ""
        }`}
      >
        {child.name}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="DFAR Logo" className="h-10 w-10 object-contain" />
          <span className="text-sm font-semibold text-gray-700  lg:block leading-tight">
            Department of Fisheries
            <br />& Aquatic Resources
          </span>
        </Link>
      </div>

      {/* ── Desktop Nav (visible at lg and above) ─────────────────────────── */}
      <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
        {mergedStaticPages.map((page) => {
          const active = isActive(page);

          if (!page.children) {
            return (
              <Link
                key={page.name}
                to={page.path}
                className={`px-3 py-1.5 text-[13px] ${FONT_MAP[lang]} font-medium text-gray-700 hover:text-[#185FA5] transition-colors relative ${
                  active ? "text-[#1A73C8]" : ""
                }`}
              >
                {page.name}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1A73C8] rounded-full" />
                )}
              </Link>
            );
          }

          const isOpen = openDropdown === page.name;

          // ✅ Uses hoisted `t` — no useSelector inside map
          const isLoadingThisMenu =
            (page.name === t.information && cmsLoading) ||
            (page.name === t.download && downloadLoading) ||
            (page.name === t.officer && officerLoading) ||
            (page.name === t.callingForTender && tenderLoading);

          return (
            <div key={page.name} className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : page.name)}
                className={`flex items-center gap-1 px-3 py-1.5 text-[13px] ${FONT_MAP[lang]} font-medium text-gray-700 hover:text-[#185FA5] transition-colors relative ${
                  active ? "text-[#1A73C8]" : ""
                }`}
              >
                {isLoadingThisMenu ? (
                  <span className="flex items-center gap-1">
                    {page.name}
                    <span className="inline-block h-2 w-10 bg-gray-200 rounded animate-pulse ml-1" />
                  </span>
                ) : (
                  page.name
                )}
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1A73C8] rounded-full" />
                )}
              </button>

              {isOpen && (
                <div
                  className="absolute top-10 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 px-1 z-50"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, auto)",
                    minWidth: "13rem",
                  }}
                >
                  {page.children.length === 0 ? (
                    <p className="px-4 py-2 text-[13px] text-gray-400 col-span-4">
                      No items
                    </p>
                  ) : (
                    page.children.map((child) =>
                      renderChild(child, () => setOpenDropdown(null))
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}

        <LanguageSwitcher />
      </div>

      {/* ── Mobile Menu Button (visible below lg) ─────────────────────────── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <Bars3Icon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Mobile Menu Panel ─────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white flex flex-col p-4 gap-1 lg:hidden border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          {mergedStaticPages.map((page) => {
            if (!page.children) {
              return (
                <Link
                  key={page.name}
                  to={page.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors ${
                    isActive(page)
                      ? "font-semibold text-[#1A73C8] bg-[#E6F1FB]"
                      : ""
                  }`}
                >
                  {page.name}
                </Link>
              );
            }

            const isOpen = openMobileDropdown === page.name;
            return (
              <div key={page.name}>
                <button
                  onClick={() =>
                    setOpenMobileDropdown(isOpen ? null : page.name)
                  }
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors ${
                    isActive(page) ? "font-semibold text-[#1A73C8]" : ""
                  }`}
                >
                  <span>{page.name}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-4 flex flex-col border-l-2 border-[#B5D4F4] pl-3 mb-1 mt-1 gap-0.5">
                    {page.children.length === 0 ? (
                      <p className="py-2 px-2 text-xs text-gray-400">
                        No items
                      </p>
                    ) : (
                      page.children.map((child) => {
                        if (child.external) {
                          return (
                            <a
                              key={child.name}
                              href={child.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setOpenMobileDropdown(null);
                              }}
                              className="py-2 px-2 text-sm text-gray-600 hover:text-[#185FA5] hover:bg-[#E6F1FB] rounded-lg transition-colors"
                            >
                              {child.name}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                            className={`py-2 px-2 text-sm text-gray-600 hover:text-[#185FA5] hover:bg-[#E6F1FB] rounded-lg transition-colors ${
                              location.pathname === child.path
                                ? "font-semibold text-[#1A73C8]"
                                : ""
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <LanguageSwitcher mobile />
        </div>
      )}
    </nav>
  );
}
// import React, { useState, useRef, useEffect } from "react";
// import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
// import { Link, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { selectLanguage, setLanguage } from "../languageSlice";
// import { useNavbar } from "../hooks/information_hook";
// import { useDownloadNavbar } from "../hooks/download_hook";
// import { useOfficerNavbar } from "../hooks/officer_hook";
// import { useTenderNavbar } from "../hooks/tender_hook";
// import logo from "../assets/logo.png";

// const LANGUAGES = [
//   { code: "en", label: "EN", flag: "🇬🇧", full: "English" },
//   { code: "si", label: "SI", flag: "🇱🇰", full: "සිංහල" },
//   { code: "ta", label: "TA", flag: "🇱🇰", full: "தமிழ்" },
// ];

// const TRANSLATIONS = {
//   en: {
//     home: "Home",
//     aboutUs: "About Us",
//     overview: "Overview",
//     ministry: "Ministry",
//     directorGeneral: "Director General",
//     divisions: "Divisions",
//     districtOffices: "District Offices",
//     information: "Information",
//     download: "Download",
//     officer: "Officer",
//     callingForTender: "Calling For Tender",
//   },
//   si: {
//     home: "මුල් පිටුව",
//     aboutUs: "අප ගැන",
//     overview: "දළ විශ්ලේෂණය",
//     ministry: "අමාත්‍යාංශය",
//     directorGeneral: "අධ්‍යක්ෂ ජනරාල්",
//     divisions: "අංශ",
//     districtOffices: "දිස්ත්‍රික් කාර්යාල",
//     information: "තොරතුරු",
//     download: "බාගත කිරීම",
//     officer: "නිලධාරී",
//     callingForTender: "ටෙන්ඩර් කැඳවීම",
//   },
//   ta: {
//     home: "முகப்பு",
//     aboutUs: "எங்களை பற்றி",
//     overview: "மேலோட்டம்",
//     ministry: "அமைச்சகம்",
//     directorGeneral: "இயக்குநர் நாயகம்",
//     divisions: "பிரிவுகள்",
//     districtOffices: "மாவட்ட அலுவலகங்கள்",
//     information: "தகவல்",
//     download: "பதிவிறக்கம்",
//     officer: "அதிகாரி",
//     callingForTender: "ஏலம் கோருதல்",
//   },
// };

// const useStaticPages = () => {
//   const lang = useSelector(selectLanguage);
//   const t = TRANSLATIONS[lang] ?? TRANSLATIONS.en;

//   return [
//     { name: t.home, path: "/" },
//     {
//       name: t.aboutUs,
//       children: [
//         { name: t.overview,        path: "/about/overview" },
//         { name: t.ministry,        path: "/about/ministry" },
//         { name: t.directorGeneral, path: "/about/dg-message" },
//         { name: t.divisions,       path: "/about/division" },
//         { name: t.districtOffices, path: "/about/map" },
//       ],
//     },
//     { name: t.information,      children: [] },
//     { name: t.download,         children: [] },
//     { name: t.officer,          children: [] },
//     { name: t.callingForTender, children: [] },
//   ];
// };

// // ── Language Switcher ─────────────────────────────────────────────────────────
// function LanguageSwitcher({ mobile = false }) {
//   const dispatch = useDispatch();
//   const current  = useSelector(selectLanguage);
//   const [open, setOpen] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const select = (code) => { dispatch(setLanguage(code)); setOpen(false); };
//   const active = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

//   return (
//     <div ref={ref} className={`relative ${mobile ? "mt-2 w-fit" : "ml-3"}`}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 cursor-pointer hover:border-[#378ADD] hover:text-[#185FA5] transition-colors"
//       >
//         <span>{active.flag}</span>
//         <span className="font-medium">{active.label}</span>
//         <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
//       </button>
//       {open && (
//         <div className={`absolute ${mobile ? "left-0" : "right-0"} top-9 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 px-1 z-50`}>
//           {LANGUAGES.map((l) => (
//             <button
//               key={l.code}
//               onClick={() => select(l.code)}
//               className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
//                 ${current === l.code
//                   ? "bg-[#E6F1FB] text-[#185FA5] font-semibold"
//                   : "text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5]"}`}
//             >
//               <span>{l.flag}</span>
//               <span>{l.full}</span>
//               {current === l.code && (
//                 <svg className="ml-auto w-3.5 h-3.5 text-[#185FA5]" fill="none" viewBox="0 0 16 16">
//                   <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── AppBar ────────────────────────────────────────────────────────────────────
// export default function AppBar() {
//   const location = useLocation();
//   const [mobileMenuOpen,     setMobileMenuOpen]     = useState(false);
//   const [openDropdown,       setOpenDropdown]       = useState(null);
//   const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
//   const dropdownRef = useRef(null);

//   const { items: cmsItems,      loading: cmsLoading }      = useNavbar();
//   const { items: downloadItems, loading: downloadLoading }  = useDownloadNavbar();
//   const { items: officerItems,  loading: officerLoading }   = useOfficerNavbar();
//   const { items: tenderItems,   loading: tenderLoading }    = useTenderNavbar();

//   const STATIC_PAGES = useStaticPages();

//   // Merge CMS items into "Information", download items into "Download"
//   const mergedStaticPages = STATIC_PAGES.map((page) => {
//     const t = TRANSLATIONS[useSelector(selectLanguage)] ?? TRANSLATIONS.en;

//     if (page.name === t.information) {
//       return {
//         ...page,
//         children: [
//           ...page.children,
//           ...cmsItems.map((item) => ({
//             name:     item.label,
//             path:     item.pageType === "direct_link" ? null : item.path,
//             url:      item.url,
//             pageType: item.pageType,
//             external: item.pageType === "direct_link",
//           })),
//         ],
//       };
//     }
//     if (page.name === t.download) {
//       return {
//         ...page,
//         children: downloadItems.map((item) => ({
//           name:     item.label,
//           path:     item.pageType === "direct_link" ? null : item.path,
//           url:      item.url,
//           pageType: item.pageType,
//           external: item.pageType === "direct_link",
//         })),
//       };
//     }
//     if (page.name === t.officer) {
//       return {
//         ...page,
//         children: officerItems.map((item) => ({
//           name:     item.label,
//           path:     item.pageType === "direct_link" ? null : item.path,
//           url:      item.url,
//           pageType: item.pageType,
//           external: item.pageType === "direct_link",
//         })),
//       };
//     }
//     if (page.name === t.callingForTender) {
//       return {
//         ...page,
//         children: tenderItems.map((item) => ({
//           name:     item.label,
//           path:     item.pageType === "direct_link" ? null : item.path,
//           url:      item.url,
//           pageType: item.pageType,
//           external: item.pageType === "direct_link",
//         })),
//       };
//     }
//     return page;
//   });

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target))
//         setOpenDropdown(null);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const isActive = (page) => {
//     if (page.path)     return location.pathname === page.path;
//     if (page.children) return page.children.some((c) => c.path && location.pathname === c.path);
//     return false;
//   };

//   const renderChild = (child, closeFn) => {
//     if (child.external) {
//       return (
//         <a
//           key={child.name}
//           href={child.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           onClick={closeFn}
//           className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors rounded-lg mx-1"
//         >
//           {child.name}
//         </a>
//       );
//     }
//     return (
//       <Link
//         key={child.name}
//         to={child.path}
//         onClick={closeFn}
//         className={`block px-4 py-2 text-sm text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors rounded-lg mx-1 ${
//           location.pathname === child.path ? "font-semibold text-[#1A73C8] bg-[#E6F1FB]" : ""
//         }`}
//       >
//         {child.name}
//       </Link>
//     );
//   };

//   return (
//     <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between relative z-50">

//       {/* Logo */}
//       <div className="flex items-center gap-3">
//         <img src={logo} alt="DFAR Logo" className="h-10 w-10 object-contain" />
//         <span className="text-sm font-semibold text-gray-700 hidden lg:block leading-tight">
//           Department of Fisheries<br />& Aquatic Resources
//         </span>
//       </div>

//       {/* ── Desktop Nav ───────────────────────────────────────────────────── */}
//       <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
//         {mergedStaticPages.map((page) => {
//           const active = isActive(page);

//           if (!page.children) {
//             return (
//               <Link
//                 key={page.name}
//                 to={page.path}
//                 className={`px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-[#185FA5] transition-colors relative ${
//                   active ? "text-[#1A73C8]" : ""
//                 }`}
//               >
//                 {page.name}
//                 {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1A73C8] rounded-full" />}
//               </Link>
//             );
//           }

//           const isOpen = openDropdown === page.name;
//           const t = TRANSLATIONS[useSelector(selectLanguage)] ?? TRANSLATIONS.en;
//           const isLoadingThisMenu =
//             (page.name === t.information    && cmsLoading)      ||
//             (page.name === t.download       && downloadLoading)  ||
//             (page.name === t.officer        && officerLoading)   ||
//             (page.name === t.callingForTender && tenderLoading);

//           return (
//             <div key={page.name} className="relative">
//               <button
//                 onClick={() => setOpenDropdown(isOpen ? null : page.name)}
//                 className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-[#185FA5] transition-colors relative ${
//                   active ? "text-[#1A73C8]" : ""
//                 }`}
//               >
//                 {isLoadingThisMenu ? (
//                   <span className="flex items-center gap-1">
//                     {page.name}
//                     <span className="inline-block h-2 w-10 bg-gray-200 rounded animate-pulse ml-1" />
//                   </span>
//                 ) : (
//                   page.name
//                 )}
//                 <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
//                 {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1A73C8] rounded-full" />}
//               </button>

//               {isOpen && (
//                 <div className="absolute top-10 left-0 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 px-1">
//                   {page.children.length === 0 ? (
//                     <p className="px-4 py-2 text-xs text-gray-400">No items</p>
//                   ) : (
//                     page.children.map((child) =>
//                       renderChild(child, () => setOpenDropdown(null))
//                     )
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         <LanguageSwitcher />
//       </div>

//       {/* ── Mobile Menu Button ────────────────────────────────────────────── */}
//       <div className="md:hidden">
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
//         >
//           {mobileMenuOpen
//             ? <XMarkIcon className="w-5 h-5" />
//             : <Bars3Icon className="w-5 h-5" />}
//         </button>
//       </div>

//       {/* ── Mobile Menu ───────────────────────────────────────────────────── */}
//       {mobileMenuOpen && (
//         <div className="absolute top-full left-0 w-full bg-white flex flex-col p-4 gap-1 md:hidden border-t border-gray-100 shadow-lg">
//           {mergedStaticPages.map((page) => {

//             if (!page.children) {
//               return (
//                 <Link
//                   key={page.name}
//                   to={page.path}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={`px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors ${
//                     isActive(page) ? "font-semibold text-[#1A73C8] bg-[#E6F1FB]" : ""
//                   }`}
//                 >
//                   {page.name}
//                 </Link>
//               );
//             }

//             const isOpen = openMobileDropdown === page.name;
//             return (
//               <div key={page.name}>
//                 <button
//                   onClick={() => setOpenMobileDropdown(isOpen ? null : page.name)}
//                   className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors ${
//                     isActive(page) ? "font-semibold text-[#1A73C8]" : ""
//                   }`}
//                 >
//                   <span>{page.name}</span>
//                   <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
//                 </button>

//                 {isOpen && (
//                   <div className="ml-4 flex flex-col border-l-2 border-[#B5D4F4] pl-3 mb-1 mt-1 gap-0.5">
//                     {page.children.length === 0 ? (
//                       <p className="py-2 px-2 text-xs text-gray-400">No items</p>
//                     ) : (
//                       page.children.map((child) => {
//                         if (child.external) {
//                           return (
//                             <a
//                               key={child.name}
//                               href={child.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               onClick={() => { setMobileMenuOpen(false); setOpenMobileDropdown(null); }}
//                               className="py-2 px-2 text-sm text-gray-600 hover:text-[#185FA5] hover:bg-[#E6F1FB] rounded-lg transition-colors"
//                             >
//                               {child.name}
//                             </a>
//                           );
//                         }
//                         return (
//                           <Link
//                             key={child.name}
//                             to={child.path}
//                             onClick={() => { setMobileMenuOpen(false); setOpenMobileDropdown(null); }}
//                             className={`py-2 px-2 text-sm text-gray-600 hover:text-[#185FA5] hover:bg-[#E6F1FB] rounded-lg transition-colors ${
//                               location.pathname === child.path ? "font-semibold text-[#1A73C8]" : ""
//                             }`}
//                           >
//                             {child.name}
//                           </Link>
//                         );
//                       })
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           <LanguageSwitcher mobile />
//         </div>
//       )}
//     </nav>
//   );
// }
