"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function Header({ hideBookButton = false, forceDarkText = false }: { hideBookButton?: boolean; forceDarkText?: boolean }) {
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);
  
  // Check if we're on the home page
  const isHomePage = pathname === "/home" || pathname === "/";
  
  // Check if we're on admin page
  const isAdminPage = pathname?.startsWith("/admin");
  
  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    setIsPagesDropdownOpen(false);
    router.push("/home");
  };
  
  // Determine text color: force dark if specified, otherwise use scrolled state
  const textColor = forceDarkText ? "text-stone-800" : (isScrolled ? "text-stone-800" : "text-white");
  const hoverColor = forceDarkText 
    ? "hover:text-stone-600 hover:bg-stone-100" 
    : (isScrolled ? "hover:text-stone-600 hover:bg-stone-100" : "hover:text-stone-200 hover:bg-white/10");

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
      <nav className="w-full px-3 md:px-4 py-3 md:py-4 relative">
        {/* Logo - Second Row on Mobile, Center on Desktop */}
        <Link 
          href="/home" 
          className={`md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 text-center md:text-left text-xl md:text-4xl font-bold font-playfair transition-colors ${textColor} block md:block mb-2 md:mb-0 whitespace-nowrap`}
        >
          {t("hotelName")}
        </Link>
        
        <div className={`flex items-center justify-between ${language === "en" ? "flex-row-reverse" : ""}`}>
          {/* Booking Button */}
          <div className="flex items-center">
            {!hideBookButton && (
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
            )}
          </div>

          {/* Language Toggle & Pages Dropdown */}
          <div className="flex items-center gap-1">
            {language === "ar" ? (
              <>
                {/* Language Toggle Button - First in Arabic */}
                <button
                  onClick={toggleLanguage}
                  className={`transition-colors font-medium px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg text-sm md:text-lg ${textColor} ${hoverColor}`}
                  aria-label="Toggle language"
                >
                  <span className="text-base md:text-xl font-semibold">عربي</span>
                </button>

                {/* Pages Dropdown - Second in Arabic */}
                <div className="relative" ref={pagesDropdownRef}>
              <button
                onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                className={`flex items-center gap-1 md:gap-2 transition-colors font-medium px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg text-sm md:text-lg ${textColor} ${hoverColor}`}
                aria-label="Select page"
              >
                {/* Menu Icon */}
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
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
                <div className={`absolute mt-2 w-40 md:w-48 rounded-lg shadow-lg overflow-hidden z-50 ${language === "ar" ? "left-0" : "left-0"} ${
                  isHomePage && !isScrolled
                    ? "bg-white/10 backdrop-blur-md border border-white/20"
                    : "bg-stone-50 border border-stone-200"
                }`}>
                  <Link
                    href="/home"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href="/rooms"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("rooms")}
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("booking")}
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href="/restaurants"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("restaurants")}
                  </Link>
                  <Link
                    href="/facilities"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("facilities")}
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsPagesDropdownOpen(false)}
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                      isHomePage && !isScrolled
                        ? "text-white hover:bg-white/20"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {t("admin")}
                  </Link>
                  {isAdminPage && (
                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${language === "ar" ? "text-right" : "text-left"} ${
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/20"
                          : "text-stone-800 hover:bg-stone-100"
                      }`}
                    >
                      {t("logout")}
                    </button>
                  )}
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
                    className={`flex items-center gap-2 transition-colors font-medium px-5 py-2.5 rounded-lg text-lg ${textColor} ${hoverColor}`}
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
                      isHomePage && !isScrolled
                        ? "bg-white/10 backdrop-blur-md border border-white/20"
                        : "bg-stone-50 border border-stone-200"
                    }`}>
                      <Link
                        href="/home"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-5 py-3 transition-colors text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("home")}
                      </Link>
                      <Link
                        href="/rooms"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("rooms")}
                      </Link>
                      <Link
                        href="/booking"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("booking")}
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("about")}
                      </Link>
                      <Link
                        href="/restaurants"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("restaurants")}
                      </Link>
                      <Link
                        href="/facilities"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("facilities")}
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setIsPagesDropdownOpen(false)}
                        className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                          isHomePage && !isScrolled
                            ? "text-white hover:bg-white/20"
                            : "text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {t("admin")}
                      </Link>
                      {isAdminPage && (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 md:px-5 py-2 md:py-3 transition-colors text-base md:text-lg ${
                            isHomePage && !isScrolled
                              ? "text-white hover:bg-white/20"
                              : "text-stone-800 hover:bg-stone-100"
                          }`}
                        >
                          {t("logout")}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Language Toggle Button - Second in English */}
                <button
                  onClick={toggleLanguage}
                  className={`transition-colors font-medium px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg text-sm md:text-lg ${textColor} ${hoverColor}`}
                  aria-label="Toggle language"
                >
                  <span className="text-base md:text-xl font-semibold">EN</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

