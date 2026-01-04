"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className={`text-5xl font-bold text-center ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
            {t("about")}
          </h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className={`max-w-3xl mx-auto ${language === "ar" ? "text-right font-cairo" : "text-left"}`}>
          <p className="text-lg text-stone-700 mb-4">
            {language === "ar" 
              ? "مرحباً بك في فندقنا الفاخر، حيث نقدم لك تجربة إقامة استثنائية تجمع بين الأناقة والراحة والخدمة المتميزة." 
              : "Welcome to our luxury hotel, where we offer you an exceptional stay experience that combines elegance, comfort, and outstanding service."}
          </p>
        </div>
      </section>
    </div>
  );
}

