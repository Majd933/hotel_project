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

  return (
    <div className="w-full py-4 bg-stone-50 border-b border-stone-200 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isActive = currentStep >= step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                      isActive
                        ? "bg-stone-800 text-white"
                        : "bg-stone-200 text-stone-600"
                    } ${isCurrent ? "ring-2 ring-stone-300" : ""}`}
                  >
                    {step.number}
                  </div>
                  {/* Step Label */}
                  <div className={`mt-1.5 text-xs font-medium text-center ${language === "ar" ? "font-cairo" : ""} ${
                    isActive ? "text-stone-800" : "text-stone-500"
                  }`}>
                    {t(step.key as keyof typeof import("@/lib/translations").translations.ar)}
                  </div>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      currentStep > step.number ? "bg-stone-800" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

