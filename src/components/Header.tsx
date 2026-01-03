"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  // Handle scroll to change background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pagesDropdownRef.current &&
        !pagesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPagesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "bg-stone-200/95 backdrop-blur-sm" : "bg-transparent"
    }`}>
      <nav className="w-full px-4 py-4">
        <div className={`flex items-center justify-between ${language === "en" ? "flex-row-reverse" : ""}`}>
          {/* Booking Button */}
          <div className="flex items-center">
            <Link
              href="/booking"
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all text-lg ${
                isScrolled
                  ? "bg-stone-800 text-stone-50 hover:bg-stone-700"
                  : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
              }`}
            >
              {t("bookNow")}
            </Link>
          </div>

          {/* Logo - Center */}
          <Link href="/home" className={`text-4xl font-bold font-playfair transition-colors ${
            isScrolled ? "text-stone-800" : "text-white"
          }`}>
            {t("hotelName")}
          </Link>

          {/* Language Toggle & Pages Dropdown */}
          <div className="flex items-center gap-4">
            {language === "ar" ? (
              <>
                {/* Language Toggle Button - First in Arabic */}
                <button
                  onClick={toggleLanguage}
                  className={`transition-colors font-medium px-5 py-2.5 rounded-lg text-lg ${
                    isScrolled 
                      ? "text-stone-800 hover:text-stone-600 hover:bg-stone-100" 
                      : "text-white hover:text-stone-200 hover:bg-white/10"
                  }`}
                  aria-label="Toggle language"
                >
                  <span className="text-xl font-semibold">عربي</span>
                </button>

                {/* Pages Dropdown - Second in Arabic */}
                <div className="relative" ref={pagesDropdownRef}>
              <button
                onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                className={`flex items-center gap-2 transition-colors font-medium px-5 py-2.5 rounded-lg text-lg ${
                  isScrolled 
                    ? "text-stone-800 hover:text-stone-600 hover:bg-stone-100" 
                    : "text-white hover:text-stone-200 hover:bg-white/10"
                }`}
                aria-label="Select page"
              >
                {/* Menu Icon */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Pages Dropdown Menu */}
              {isPagesDropdownOpen && (
                <div className={`absolute mt-2 w-48 rounded-lg shadow-lg overflow-hidden ${language === "ar" ? "right-0" : "left-0"} ${
                  isScrolled 
                    ? "bg-stone-50 border border-stone-200" 
                    : "bg-white/10 backdrop-blur-md border border-white/20"
                }`}>
                  <Link
                    href="/home"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 transition-colors text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isScrolled 
                        ? "text-stone-800 hover:bg-stone-100" 
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href="/rooms"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 transition-colors text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isScrolled 
                        ? "text-stone-800 hover:bg-stone-100" 
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    {t("rooms")}
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 transition-colors text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isScrolled 
                        ? "text-stone-800 hover:bg-stone-100" 
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    {t("booking")}
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 transition-colors text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isScrolled 
                        ? "text-stone-800 hover:bg-stone-100" 
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 transition-colors text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isScrolled 
                        ? "text-stone-800 hover:bg-stone-100" 
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    {t("contact")}
                  </Link>
                </div>
              )}
                </div>
              </>
            ) : (
              <>
                {/* Pages Dropdown - First in English */}
                <div className="relative" ref={pagesDropdownRef}>
                  <button
                    onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                    className={`flex items-center gap-2 transition-colors font-medium px-5 py-2.5 rounded-lg text-lg ${
                      isScrolled 
                        ? "text-stone-800 hover:text-stone-600 hover:bg-stone-100" 
                        : "text-white hover:text-stone-200 hover:bg-white/10"
                    }`}
                    aria-label="Select page"
                  >
                    {/* Menu Icon */}
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                  {/* Pages Dropdown Menu */}
                  {isPagesDropdownOpen && (
                    <div className={`absolute left-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden ${
                      isScrolled 
                        ? "bg-stone-50 border border-stone-200" 
                        : "bg-white/10 backdrop-blur-md border border-white/20"
                    }`}>
                      <Link
                        href="/home"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-5 py-3 transition-colors text-lg ${
                          isScrolled 
                            ? "text-stone-800 hover:bg-stone-100" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {t("home")}
                      </Link>
                      <Link
                        href="/rooms"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-5 py-3 transition-colors text-lg ${
                          isScrolled 
                            ? "text-stone-800 hover:bg-stone-100" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {t("rooms")}
                      </Link>
                      <Link
                        href="/booking"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-5 py-3 transition-colors text-lg ${
                          isScrolled 
                            ? "text-stone-800 hover:bg-stone-100" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {t("booking")}
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-5 py-3 transition-colors text-lg ${
                          isScrolled 
                            ? "text-stone-800 hover:bg-stone-100" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {t("about")}
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-5 py-3 transition-colors text-lg ${
                          isScrolled 
                            ? "text-stone-800 hover:bg-stone-100" 
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {t("contact")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Language Toggle Button - Second in English */}
                <button
                  onClick={toggleLanguage}
                  className={`transition-colors font-medium px-5 py-2.5 rounded-lg text-lg ${
                    isScrolled 
                      ? "text-stone-800 hover:text-stone-600 hover:bg-stone-100" 
                      : "text-white hover:text-stone-200 hover:bg-white/10"
                  }`}
                  aria-label="Toggle language"
                >
                  <span className="text-xl font-semibold">EN</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className={`md:hidden transition-colors ${
            isScrolled ? "text-stone-800 hover:text-stone-600" : "text-white hover:text-stone-200"
          }`}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

