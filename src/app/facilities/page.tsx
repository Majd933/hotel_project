"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function FacilitiesPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-800 text-white py-25">
        <div className="container mx-auto px-4">
          <h1 className={`text-5xl font-bold text-center ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
            {t("entertainmentSectionTitle")}
          </h1>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center ${language === "ar" ? "" : ""}`}>
          {/* Image */}
          <div className={`${language === "ar" ? "md:order-2" : "md:order-1"}`}>
            <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/pool.jpg"
                alt={language === "ar" ? "المرافق الترفيهية" : "Entertainment Facilities"}
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
          
          {/* Content */}
          <div className={`${language === "ar" ? "md:order-1 text-right font-cairo" : "md:order-2 text-left"}`}>
            <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
              <p>
                {language === "ar" 
                  ? "استرخوا واستمتعوا بمرافقنا الترفيهية المميزة في فندق الشيراتون. نقدم لضيوفنا مجموعة واسعة من المرافق والخدمات التي تضمن إقامة مريحة وممتعة."
                  : "Relax and enjoy our distinguished entertainment facilities at Sheraton Hotel. We offer our guests a wide range of facilities and services that ensure a comfortable and enjoyable stay."}
              </p>
              
              <p>
                {language === "ar" 
                  ? "يتضمن فندقنا مسبحاً فاخراً في الهواء الطلق مع منطقة استرخاء واسعة، صالة ألعاب رياضية مجهزة بأحدث المعدات، وسبا راقي يوفر خدمات التدليك والعناية بالبشرة للاسترخاء التام والراحة."
                  : "Our hotel features a luxurious outdoor pool with a spacious relaxation area, a fully equipped gym with the latest equipment, and an elegant spa offering massage and skincare services for complete relaxation and comfort."}
              </p>
              
              <p>
                {language === "ar" 
                  ? "جميع مرافقنا مصممة لتناسب جميع الأعمار والأذواق. سواء كنتم تبحثون عن النشاط واللياقة البدنية، أو الاسترخاء والراحة، ستجدون ما يلبي احتياجاتكم في مرافقنا الفاخرة."
                  : "All our facilities are designed to suit all ages and tastes. Whether you're looking for activity and fitness, or relaxation and comfort, you'll find what you need in our luxury facilities."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
