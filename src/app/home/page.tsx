"use client";

import Link from "next/link";
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
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 font-playfair leading-tight">
              {t("welcomeTitle")}
            </h1>
            <p className="text-2xl md:text-3xl mb-12 opacity-95 font-light">
              {t("welcomeSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
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

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            {t("ourFeatures")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold mb-2">{t("luxuryRooms")}</h3>
              <p className="text-gray-600">
                {t("luxuryRoomsDesc")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">{t("fineRestaurant")}</h3>
              <p className="text-gray-600">
                {t("fineRestaurantDesc")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🏊</div>
              <h3 className="text-xl font-semibold mb-2">{t("entertainmentFacilities")}</h3>
              <p className="text-gray-600">
                {t("entertainmentFacilitiesDesc")}
              </p>
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

