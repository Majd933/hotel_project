"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

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
    <header className="bg-stone-200/90 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <nav className="w-full px-4 py-4">
        <div className={`flex items-center justify-between ${language === "en" ? "flex-row-reverse" : ""}`}>
          {/* Booking Button */}
          <div className="flex items-center">
            <Link
              href="/booking"
              className="bg-stone-800 text-stone-50 px-6 py-2.5 rounded-lg font-semibold hover:bg-stone-700 transition-colors text-lg"
            >
              {t("bookNow")}
            </Link>
          </div>

          {/* Logo - Center */}
          <Link href="/home" className="text-2xl font-bold text-stone-800 font-playfair">
            {t("hotelName")}
          </Link>

          {/* Language Toggle & Pages Dropdown */}
          <div className="flex items-center gap-4">
            {language === "ar" ? (
              <>
                {/* Language Toggle Button - First in Arabic */}
                <button
                  onClick={toggleLanguage}
                  className="text-stone-800 hover:text-stone-600 transition-colors font-medium px-5 py-2.5 rounded-lg hover:bg-stone-100 text-lg"
                  aria-label="Toggle language"
                >
                  <span className="text-xl font-semibold">عربي</span>
                </button>

                {/* Pages Dropdown - Second in Arabic */}
                <div className="relative" ref={pagesDropdownRef}>
              <button
                onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                className="flex items-center gap-2 text-stone-800 hover:text-stone-600 transition-colors font-medium px-5 py-2.5 rounded-lg hover:bg-stone-100 text-lg"
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
                <div className={`absolute mt-2 w-48 bg-stone-50 rounded-lg shadow-lg overflow-hidden ${language === "ar" ? "right-0" : "left-0"}`}>
                  <Link
                    href="/home"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg ${language === "ar" ? "text-right" : "text-left"}`}
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href="/properties"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg ${language === "ar" ? "text-right" : "text-left"}`}
                  >
                    {t("properties")}
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg ${language === "ar" ? "text-right" : "text-left"}`}
                  >
                    {t("booking")}
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg ${language === "ar" ? "text-right" : "text-left"}`}
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg ${language === "ar" ? "text-right" : "text-left"}`}
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
                    className="flex items-center gap-2 text-stone-800 hover:text-stone-600 transition-colors font-medium px-5 py-2.5 rounded-lg hover:bg-stone-100 text-lg"
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
                    <div className="absolute left-0 mt-2 w-48 bg-stone-50 rounded-lg shadow-lg overflow-hidden">
                      <Link
                        href="/home"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className="block w-full text-left px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg"
                      >
                        {t("home")}
                      </Link>
                      <Link
                        href="/properties"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className="block w-full text-left px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg"
                      >
                        {t("properties")}
                      </Link>
                      <Link
                        href="/booking"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className="block w-full text-left px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg"
                      >
                        {t("booking")}
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className="block w-full text-left px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg"
                      >
                        {t("about")}
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className="block w-full text-left px-5 py-3 hover:bg-stone-100 transition-colors text-stone-700 text-lg"
                      >
                        {t("contact")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Language Toggle Button - Second in English */}
                <button
                  onClick={toggleLanguage}
                  className="text-stone-800 hover:text-stone-600 transition-colors font-medium px-5 py-2.5 rounded-lg hover:bg-stone-100 text-lg"
                  aria-label="Toggle language"
                >
                  <span className="text-xl font-semibold">EN</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-stone-800 hover:text-stone-600">
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

