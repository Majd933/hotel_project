"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import BookingCalendar from "@/components/BookingCalendar";
import Link from "next/link";

export default function BookingPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);

  const handleDateSelect = (date: Date) => {
    setSelectedDates((prev) => {
      if (prev.length === 0) {
        return [date];
      } else if (prev.length === 1) {
        const [firstDate] = prev;
        if (date < firstDate) {
          return [date, firstDate];
        } else {
          return [firstDate, date];
        }
      } else {
        return [date];
      }
    });
  };

  const removeHotel = () => {
    // Navigate back or remove selection
    window.location.href = "/home";
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className={`flex items-center justify-between flex-wrap gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            {/* Left: Hotel Name */}
            <div className={`flex items-center gap-3 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <button
                onClick={removeHotel}
                className="text-stone-600 hover:text-stone-800 transition-colors"
                aria-label="Remove hotel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-lg font-semibold text-stone-800 font-playfair">
                {t("hotelName")}
              </span>
            </div>

            {/* Center: Select dates */}
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold text-stone-800 underline">
                {t("selectDates")}
              </span>
            </div>

            {/* Right: Room and Adults info */}
            <div className={`flex items-center gap-4 flex-wrap ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-sm text-stone-700 font-medium">
                {rooms} {rooms === 1 ? t("room") : t("rooms")}: {adults} {adults === 1 ? t("adult") : t("adults")}
              </span>
              <button className="text-sm text-stone-600 hover:text-stone-800 transition-colors">
                {language === "ar" ? "هل لديك..." : "Do you have a..."}
              </button>
              <Link
                href="/rooms"
                className="bg-stone-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-stone-700 transition-colors whitespace-nowrap"
              >
                {t("exploreOptions")}
              </Link>
              <Link
                href="/home"
                className="text-stone-600 hover:text-stone-800 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="container mx-auto px-4 py-12">
        <BookingCalendar
          onDateSelect={handleDateSelect}
          selectedDates={selectedDates}
        />
      </div>

      {/* Footer with Legend and Currency */}
      <div className="bg-white border-t border-stone-200 sticky bottom-0 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className={`flex items-center justify-between flex-wrap gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
            {/* Left: Currency */}
            <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <span className="text-sm text-stone-600">{t("localCurrency")}</span>
              <select className={`text-sm text-stone-800 border border-stone-300 rounded px-2 py-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                <option value="EUR">EUR</option>
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Right: Legend */}
            <div className={`flex items-center gap-6 flex-wrap ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <div className="w-4 h-4 bg-white border border-stone-300 rounded flex-shrink-0"></div>
                <span className="text-xs text-stone-600 whitespace-nowrap">{t("available")}</span>
              </div>
              <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <div className="w-4 h-4 bg-stone-800 rounded flex-shrink-0"></div>
                <span className="text-xs text-stone-600 whitespace-nowrap">{t("selectedDates")}</span>
              </div>
              <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <div className="w-4 h-4 bg-stone-300 rounded flex-shrink-0"></div>
                <span className="text-xs text-stone-600 whitespace-nowrap">{t("restrictionsApply")}</span>
              </div>
              <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <svg className="w-4 h-4 text-stone-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs text-stone-600 whitespace-nowrap">{t("soldOut")}, {t("soldOutMessage")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

