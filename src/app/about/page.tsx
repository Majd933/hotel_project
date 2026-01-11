"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-800 text-white py-25">
        <div className="container mx-auto px-4">
          <h1 className={`text-5xl font-bold text-center ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
            {t("about")}
          </h1>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className={`max-w-4xl mx-auto ${language === "ar" ? "text-right font-cairo" : "text-left"}`}>
          <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
            <p>
              {language === "ar" 
                ? "مرحباً بك في فندق الشيراتون في دمشق، حيث يلتقي الفخامة بالتراث الأصيل. يقع فندقنا في قلب العاصمة السورية، مما يوفر لضيوفنا موقعاً استراتيجياً يمكنهم من الوصول بسهولة إلى أهم المعالم السياحية والتاريخية في المدينة."
                : "Welcome to Sheraton Hotel in Damascus, where luxury meets authentic heritage. Our hotel is located in the heart of the Syrian capital, providing our guests with a strategic location that allows easy access to the most important tourist and historical landmarks in the city."}
            </p>
            
            <p>
              {language === "ar" 
                ? "يتميز الفندق بتصميمه الأنيق الذي يجمع بين الأناقة المعاصرة واللمسات التراثية الأصيلة، مما يوفر بيئة فريدة من نوعها للضيوف. نحن ملتزمون بتقديم أعلى معايير الخدمة والراحة، مع فريق عمل محترف ومتفانٍ يعمل على مدار الساعة لضمان رضاكم وتوفير تجربة إقامة لا تُنسى."
                : "The hotel features an elegant design that combines contemporary sophistication with authentic traditional touches, creating a unique environment for our guests. We are committed to providing the highest standards of service and comfort, with a professional and dedicated team working around the clock to ensure your satisfaction and provide an unforgettable stay experience."}
            </p>
            
            <p>
              {language === "ar" 
                ? "يوفر الفندق مجموعة متنوعة من المرافق والخدمات المصممة خصيصاً لتلبية جميع احتياجاتكم. من المطاعم الفاخرة التي تقدم أشهى الأطباق المحلية والعالمية، إلى المرافق الترفيهية والرياضية المتطورة، ومراكز الأعمال والاجتماعات المجهزة بأحدث التقنيات."
                : "The hotel offers a variety of facilities and services designed specifically to meet all your needs. From fine dining restaurants serving the finest local and international dishes, to modern entertainment and sports facilities, and business and meeting centers equipped with the latest technology."}
            </p>
            
            <p>
              {language === "ar" 
                ? "غرفنا الفاخرة مصممة بعناية فائقة لتوفر أقصى درجات الراحة والأناقة. كل غرفة مجهزة بأحدث الأجهزة والتقنيات، مع إطلالات خلابة على المدينة أو المناظر الطبيعية المحيطة. استمتعوا بإقامة مريحة في مساحات واسعة ونظيفة، مصممة لتمنحكم الشعور بالهدوء والاسترخاء."
                : "Our luxurious rooms are carefully designed to provide maximum comfort and elegance. Each room is equipped with the latest devices and technology, with stunning views of the city or surrounding natural scenery. Enjoy a comfortable stay in spacious and clean spaces, designed to give you a sense of tranquility and relaxation."}
            </p>
            
            <p>
              {language === "ar" 
                ? "في فندق الشيراتون، نؤمن بأن كل ضيف يستحق تجربة استثنائية. لهذا السبب نحرص على التفاصيل الدقيقة في كل جانب من جوانب إقامتكم، من لحظة وصولكم حتى مغادرتكم. نحن هنا لجعل إقامتكم في دمشق تجربة لا تُنسى مليئة بالراحة والرفاهية."
                : "At Sheraton Hotel, we believe that every guest deserves an exceptional experience. That's why we pay attention to the smallest details in every aspect of your stay, from the moment you arrive until your departure. We are here to make your stay in Damascus an unforgettable experience full of comfort and luxury."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

