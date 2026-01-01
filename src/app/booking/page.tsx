"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import BookingCalendar from "@/components/BookingCalendar";
import BookingTimeline from "@/components/BookingTimeline";
import Link from "next/link";
import Image from "next/image";

interface Room {
  id: number;
  typeKey: string;
  descKey: string;
  price: number;
  size: number;
  guests: number;
  beds: string;
  image: string;
  features: string[];
}

type Currency = "SYP" | "USD" | "EUR";

// Exchange rates (example - update with real rates)
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  SYP: 13000, // Example rate, update with real rate
};

export default function BookingPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then((data: Room[]) => {
        setRooms(data);
        if (data.length > 0) {
          setSelectedRoomId(data[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setLoading(false);
      });
  }, []);

  const selectedRoom = selectedRoomId !== null ? rooms.find(r => r.id === selectedRoomId) : undefined;

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

  const convertPrice = (priceUSD: number): number => {
    return Math.round(priceUSD * exchangeRates[currency]);
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    switch (currency) {
      case "SYP":
        return `${convertedPrice.toLocaleString()} ${t("syrianPound")}`;
      case "USD":
        return `$${convertedPrice.toLocaleString()} ${t("dollar")}`;
      case "EUR":
        return `€${convertedPrice.toLocaleString()} ${t("euro")}`;
      default:
        return `$${convertedPrice.toLocaleString()}`;
    }
  };

  const calculateTotalPrice = (): number => {
    if (!selectedRoom || selectedDates.length !== 2) return 0;
    const nights = Math.ceil((selectedDates[1].getTime() - selectedDates[0].getTime()) / (1000 * 60 * 60 * 24));
    return convertPrice(selectedRoom.price * nights);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as Currency);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-xl text-stone-600">{language === "ar" ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Booking Timeline */}
      <BookingTimeline currentStep={1} />
      
      {/* Room Selection and Details Section */}
      <div className="bg-stone-100 border-b border-stone-200 pt-4 pb-4">
        <div className="container mx-auto px-6 py-6">
          <div className={`${language === "ar" ? "text-right" : "text-left"}`}>
            {/* Page Title */}
            <h1 className={`text-2xl font-bold text-stone-800 mb-4 text-center font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
              {language === "ar" ? "اختر التاريخ ونوع الغرفة" : "Select Date & Room Type"}
            </h1>
            
            <div className={`grid md:grid-cols-3 gap-4 mb-4`}>
              {/* Room Selection */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {t("selectRoom")}
                </label>
                <select
                  value={selectedRoomId || ""}
                  onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                  className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)} - {formatPrice(room.price)} / {t("perNight")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency Selection */}
              <div>
                <label className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {t("localCurrency")}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  <option value="USD">{t("dollar")} (USD)</option>
                  <option value="EUR">{t("euro")} (EUR)</option>
                  <option value="SYP">{t("syrianPound")} (SYP)</option>
                </select>
              </div>
            </div>

            {/* Room Details */}
            {selectedRoom && (
              <div className="p-4 bg-stone-50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-stone-600">{t("price")}: </span>
                    <span className="text-lg font-bold text-stone-800">{formatPrice(selectedRoom.price)} / {t("perNight")}</span>
                  </div>
                  <div>
                    <span className="text-sm text-stone-600">{t("roomGuests")}: </span>
                    <span className="text-lg font-semibold text-stone-800">{selectedRoom.guests}</span>
                  </div>
                  <div>
                    <span className="text-sm text-stone-600">{t("roomSize")}: </span>
                    <span className="text-lg font-semibold text-stone-800">{selectedRoom.size} {t("squareMeters")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="container mx-auto px-4 py-12">
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${language === "ar" ? "lg:grid-flow-col-dense" : ""}`}>
          {/* Room Image - Left Side (1/3 max) */}
          {selectedRoom && (
            <div className={`lg:col-span-1 ${language === "ar" ? "lg:col-start-3" : ""}`}>
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={selectedRoom.image}
                  alt={t(selectedRoom.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Calendar - Right Side (2/3) */}
          <div className={`lg:col-span-2 ${language === "ar" && selectedRoom ? "lg:col-start-1" : ""}`}>
            <BookingCalendar
              onDateSelect={handleDateSelect}
              selectedDates={selectedDates}
            />
          </div>
        </div>
      </div>

      {/* Footer with Currency, Cancel/Book Buttons and Legend */}
      <div className="bg-white border-t border-stone-200 sticky bottom-0 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className={`flex items-center justify-between flex-wrap gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>

            {/* Center: Cancel and Book Buttons */}
            <div className={`flex items-center gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <Link
                href="/home"
                className={`bg-stone-300 text-stone-800 px-8 py-3 rounded-lg font-semibold hover:bg-stone-400 transition-colors whitespace-nowrap ${language === "ar" ? "font-cairo" : ""}`}
              >
                {t("cancel")}
              </Link>
              {selectedRoom && selectedDates.length === 2 ? (
                <Link
                  href={`/booking/guest-info?roomId=${selectedRoom.id}&startDate=${selectedDates[0].toISOString()}&endDate=${selectedDates[1].toISOString()}&currency=${currency}`}
                  className="bg-stone-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors whitespace-nowrap"
                >
                  {t("next")}
                </Link>
              ) : (
                <button
                  disabled
                  className="bg-stone-400 text-stone-600 px-8 py-3 rounded-lg font-semibold cursor-not-allowed whitespace-nowrap opacity-50"
                >
                  {t("next")}
                </button>
              )}
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
