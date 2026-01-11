"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

interface BookingTimelineProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export default function BookingTimeline({ currentStep }: BookingTimelineProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const steps = [
    { key: "step1", number: 1 },
    { key: "step2", number: 2 },
    { key: "step3", number: 3 },
    { key: "step4", number: 4 },
    { key: "step5", number: 5 },
  ];

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  const isRTL = language === "ar";

  return (
    <div className="w-full py-6 bg-stone-50 border-b border-stone-200 pt-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Container for the whole timeline logic */}
          <div className="relative">
            
            {/* FIX: The Track Container
               هذا العنصر يمثل المسافة الفعلية بين أول وآخر دائرة
               وضعنا الخط الملون داخله لكي تكون النسبة المئوية دقيقة
            */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-stone-200 -z-0">
              {/* Active Progress Line */}
              <div 
                className={`absolute top-0 h-full bg-stone-800 transition-all duration-500 ease-out`}
                style={{
                  width: `${progressPercentage}%`,
                  // في العربي نثبت الخط يمين فيكبر لليسار، والعكس في الإنجليزي
                  [isRTL ? 'right' : 'left']: 0 
                }}
              />
            </div>
            
            {/* Steps Circles */}
            <div className="flex justify-between items-start w-full relative z-10">
              {steps.map((step) => {
                const isActive = currentStep >= step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div key={step.number} className="flex flex-col items-center">
                    {/* Step Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-stone-800 text-white shadow-lg scale-105"
                          : "bg-white border-2 border-stone-300 text-stone-400"
                      } ${isCurrent ? "ring-4 ring-stone-200 ring-offset-2" : ""}`}
                    >
                      {step.number}
                    </div>
                    
                    {/* Step Label */}
                    <div className={`mt-3 text-xs font-bold text-center whitespace-nowrap px-1 ${language === "ar" ? "font-cairo" : ""} ${
                      isActive ? "text-stone-800" : "text-stone-400"
                    }`}>
                      {t(step.key as keyof typeof import("@/lib/translations").translations.ar)}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}