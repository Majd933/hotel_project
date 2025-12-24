"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function HomePage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/home.jpg"
            alt="Luxury resort pool"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 font-playfair">
                {t("welcomeTitle")}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {t("welcomeSubtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/properties"
                  className="bg-stone-800 text-stone-50 px-8 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
                >
                  {t("exploreRooms")}
                </Link>
                <Link
                  href="/booking"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-stone-800 transition-colors"
                >
                  {t("bookNow")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

