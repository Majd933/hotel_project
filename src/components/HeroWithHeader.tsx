"use client";

import Image from "next/image";
import Header from "./Header";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function HeroWithHeader({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative h-screen min-h-[600px] md:h-screen overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 top-0">
        <Image
          src="/images/home.jpg"
          alt="Luxury resort pool"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Header - Overlay on top of image */}
      <div className="relative z-50">
        <Header />
      </div>
      
      {/* Hero Content - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>

      {/* Animated Arc at Bottom */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div 
          className="relative group cursor-pointer arc-container"
          onClick={handleScrollDown}
        >
          {/* Arrow pointing down */}
          <svg
            width="80"
            height="50"
            viewBox="0 0 80 50"
            className="transition-all duration-300 group-hover:scale-110"
          >
            {/* Arrow pointing down - wider and sharper */}
            <path
              d="M 7.5 15 L 40 40 L 72.5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="miter"
              className="text-white/90 group-hover:text-white transition-colors duration-300"
            />
          </svg>
          
          {/* Text that appears on hover */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${language === "ar" ? "font-cairo" : ""}`}>
            <span className="text-white font-medium text-sm whitespace-nowrap drop-shadow-lg">
              {t("clickForMore")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

