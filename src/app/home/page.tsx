"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import HeroWithHeader from "@/components/HeroWithHeader";

export default function HomePage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Header and Background Image */}
      <HeroWithHeader>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-playfair leading-tight max-w-3xl mx-auto">
              {t("welcomeTitle")}
            </h1>
            <p className="text-2xl md:text-3xl mb-12 opacity-95 font-light">
              {t("welcomeSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rooms"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-sm font-semibold hover:bg-white/20 transition-all text-lg"
              >
                {t("exploreRooms")}
              </Link>
              <Link
                href="/booking"
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-sm font-semibold hover:bg-white hover:text-stone-800 transition-all text-lg"
              >
                {t("bookNow")}
              </Link>
            </div>
          </div>
        </div>
      </HeroWithHeader>

{/* About Hotel Section - Split Layout */}
<section className="min-h-screen bg-white flex items-center justify-center overflow-hidden">
  <div className="container mx-auto px-6 py-20">
    
    {/* Layout Wrapper: Grid on Desktop, Stack on Mobile */}
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${language === "ar" ? "direction-rtl" : ""}`}>
      
      {/* 1. LEFT SIDE (Contact Info & Logo) */}
      <div className={`md:col-span-4 flex flex-col gap-8 ${language === "ar" ? "md:order-3 md:text-left md:items-start" : "md:order-1 md:text-right md:items-end"} text-center items-center`}>
        
        {/* Logo Placeholder (Based on Image) */}
        <div className="mb-4">
           {/* استبدل هذا بالمكون الخاص باللوغو تبعك */}
           <div className={`flex flex-col items-center ${language === "ar" ? "md:items-start" : "md:items-end"}`}>
             <span className={`text-2xl font-serif text-stone-900 tracking-widest uppercase ${language === "ar" ? "font-cairo" : ""}`}>
               {language === "ar" ? "فندق" : "Hotel"} {language === "ar" ? "الشيراتون" : "Sheraton"}
             </span>
             <div className="h-px w-16 bg-stone-400 my-2"></div>
             <span className={`text-xs font-bold tracking-[0.3em] text-stone-600 uppercase ${language === "ar" ? "font-cairo" : ""}`}>
               {language === "ar" ? "دمشق" : "DAMASCUS"}
             </span>
           </div>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col gap-5 text-stone-600">
          
          {/* Email */}
          <div className={`flex items-center gap-3 ${language === "ar" ? "flex-row-reverse" : "flex-row justify-end"}`}>
            <a href={`mailto:${t("hotelEmail")}`} className="hover:text-stone-800 transition-colors font-light dir-ltr">
              {t("hotelEmail")}
            </a>
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Phone */}
          <div className={`flex items-center gap-3 ${language === "ar" ? "flex-row-reverse" : "flex-row justify-end"}`}>
            <span className="font-light dir-ltr">+963 11 123 4567</span>
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Location */}
          <div className={`flex items-center gap-3 ${language === "ar" ? "flex-row-reverse" : "flex-row justify-end"}`}>
            <span className="font-light">{t("hotelAddress")}</span>
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

        </div>
      </div>

      {/* 2. DIVIDER LINE - Vertical Line - Always in the middle */}
      <div className="hidden md:flex md:col-span-1 justify-center items-center md:order-2">
        <div className="w-px bg-stone-400 h-64"></div>
      </div>

      {/* 3. RIGHT SIDE (Title & Description) */}
      <div className={`md:col-span-7 flex flex-col gap-8 ${language === "ar" ? "md:order-1 text-right" : "md:order-3 text-left"}`}>
        
        {/* Headings */}
        <div>
          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-medium text-stone-900 leading-tight mb-2 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
            {t("hotelName")}
          </h2>
          <span className={`text-4xl md:text-5xl font-light text-stone-800 block font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
             {language === "ar" ? "دمشق" : "Damascus"}
          </span>
        </div>

        {/* Description */}
        <p className={`text-lg text-stone-600 leading-8 font-light max-w-2xl ${language === "ar" ? "font-cairo ml-auto" : ""}`}>
          {t("aboutHotelDescription")}
        </p>

        {/* Button */}
        <div className="pt-4">
          <Link
            href="/about"
            className={`inline-block border border-stone-300 px-10 py-4 text-stone-600 hover:border-stone-800 hover:text-stone-900 transition-all duration-300 text-sm tracking-wide ${language === "ar" ? "font-cairo" : ""}`}
          >
            {t("discoverMore")}
          </Link>
        </div>

      </div>

    </div>
  </div>
</section>

      {/* Rooms Section - Full Screen with Background Image */}
      <section className="min-h-screen relative flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home_rooms.jpg"
            alt="Hotel Rooms"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`mb-12 ${language === "ar" ? "text-right" : "text-left"}`}>
              <h2 className={`text-5xl md:text-7xl font-bold mb-4 text-white font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                {t("roomsSectionTitle")}
              </h2>
            </div>
            <div className={`mb-12 ${language === "ar" ? "text-right" : "text-left"}`}>
              <p className={`text-lg md:text-xl text-white/90 leading-relaxed ${language === "ar" ? "font-cairo" : ""}`}>
                {t("roomsSectionDescription")}
              </p>
            </div>
            <div className={`mb-16 ${language === "ar" ? "text-right" : "text-left"}`}>
              <Link
                href="/rooms"
                className={`inline-block border border-white text-white bg-white/10 backdrop-blur-sm px-8 py-3 hover:bg-white hover:text-stone-800 transition-colors font-medium ${language === "ar" ? "font-cairo" : ""}`}
              >
                {t("viewRooms")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section - Full Screen */}
      <section className="min-h-screen bg-white flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center ${language === "ar" ? "grid-flow-col-dense" : ""}`}>
            {/* Image - Left side (or right in Arabic) */}
            <div className={`${language === "ar" ? "md:order-2" : "md:order-1"}`}>
              <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/home-resturant.jpg"
                  alt="Restaurant"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>
            </div>
            
            {/* Content - Right side (or left in Arabic) */}
            <div className={`${language === "ar" ? "md:order-1 text-right" : "md:order-2 text-left"}`}>
              <div className={`mb-12`}>
                <h2 className={`text-5xl md:text-7xl font-bold mb-4 text-stone-800 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {t("restaurantsSectionTitle")}
                </h2>
              </div>
              <div className={`mb-12`}>
                <p className={`text-lg md:text-xl text-stone-700 leading-relaxed ${language === "ar" ? "font-cairo" : ""}`}>
                  {t("restaurantsSectionDescription")}
                </p>
              </div>
              <div className={`mb-16`}>
                <Link
                  href="/restaurants"
                  className={`inline-block border border-stone-800 text-stone-800 bg-white px-8 py-3 hover:bg-stone-800 hover:text-white transition-colors font-medium ${language === "ar" ? "font-cairo" : ""}`}
                >
                  {t("viewRestaurants")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entertainment Section - Full Screen */}
      <section className="min-h-screen bg-stone-50 flex items-center">
        <div className="container mx-auto px-6 py-20">
          <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center ${language === "ar" ? "" : ""}`}>
            {/* Content - Left side (or right in Arabic) */}
            <div className={`${language === "ar" ? "md:order-2 text-right" : "md:order-1 text-left"}`}>
              <div className={`mb-12`}>
                <h2 className={`text-5xl md:text-7xl font-bold mb-4 text-stone-800 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {t("entertainmentSectionTitle")}
                </h2>
              </div>
              <div className={`mb-12`}>
                <p className={`text-lg md:text-xl text-stone-700 leading-relaxed ${language === "ar" ? "font-cairo" : ""}`}>
                  {t("entertainmentSectionDescription")}
                </p>
              </div>
              <div className={`mb-16`}>
                <Link
                  href="/facilities"
                  className={`inline-block border border-stone-800 text-stone-800 bg-stone-50 px-8 py-3 hover:bg-stone-800 hover:text-white transition-colors font-medium ${language === "ar" ? "font-cairo" : ""}`}
                >
                  {t("viewFacilities")}
                </Link>
              </div>
            </div>
            
            {/* Image - Right side (or left in Arabic) */}
            <div className={`${language === "ar" ? "md:order-1" : "md:order-2"}`}>
              <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/home-entertainment_facilities.jpg"
                  alt="Entertainment Facilities"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-stone-300 text-stone-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t("bookYourStay")}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t("bookYourStayDesc")}
          </p>
          <Link
            href="/booking"
            className="inline-block bg-stone-800 text-stone-50 px-8 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
          >
            {t("startBooking")}
          </Link>
        </div>
      </section>
    </main>
  );
}

