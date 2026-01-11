"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function RestaurantsPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-800 text-white py-25">
        <div className="container mx-auto px-4">
          <h1 className={`text-5xl font-bold text-center ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
            {language === "ar" ? "المطاعم" : "Restaurants"}
          </h1>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center ${language === "ar" ? "" : ""}`}>
          {/* Image */}
          <div className={`${language === "ar" ? "md:order-2" : "md:order-1"}`}>
            <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/resturant-page.jpg"
                alt="Restaurant"
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
                  ? "اكتشفوا عالم النكهات الراقية في مطاعم فندق الشيراتون. نقدم لضيوفنا تجربة طهي استثنائية تجمع بين الأطباق المحلية الأصيلة والمأكولات العالمية الراقية، كل ذلك في أجواء فاخرة وأنيقة."
                  : "Discover the world of fine flavors at Sheraton Hotel restaurants. We offer our guests an exceptional culinary experience that combines authentic local dishes with fine international cuisine, all in luxurious and elegant settings."}
              </p>
              
              <p>
                {language === "ar" 
                  ? "يضم فندقنا مجموعة متنوعة من المطاعم التي تلبي جميع الأذواق والتفضيلات. جميع مطاعمنا يديرها طهاة محترفون ذوو خبرة عالية، ويستخدمون أفضل المكونات الطازجة والمستوردة."
                  : "Our hotel features a variety of restaurants that cater to all tastes and preferences. All our restaurants are managed by professional chefs with extensive experience, using the finest fresh and imported ingredients."}
              </p>
              
              <p>
                {language === "ar" 
                  ? "تتميز مطاعمنا بتصاميم داخلية أنيقة وأجواء مريحة تتناسب مع طبيعة كل مطعم. سواء كنتم تبحثون عن عشاء رومانسي، تجمع عائلي، أو لقاء عمل، ستجدون ما يلبي احتياجاتكم في مطاعمنا."
                  : "Our restaurants feature elegant interior designs and comfortable atmospheres that match the nature of each restaurant. Whether you're looking for a romantic dinner, family gathering, or business meeting, you'll find what you need in our restaurants."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
