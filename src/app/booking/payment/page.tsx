"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import BookingTimeline from "@/components/BookingTimeline";
import Link from "next/link";

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
  SYP: 13000,
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  const roomId = searchParams.get("roomId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const currency = (searchParams.get("currency") || "USD") as Currency;
  const guests = searchParams.get("guests");

  useEffect(() => {
    if (!roomId || !startDate || !endDate || !currency || !guests) {
      router.push("/booking");
      return;
    }

    fetch('/api/rooms')
      .then(res => res.json())
      .then((rooms: Room[]) => {
        const foundRoom = rooms.find(r => r.id === Number(roomId));
        if (foundRoom) {
          setRoom(foundRoom);
        } else {
          router.push("/booking");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching room:', err);
        router.push("/booking");
      });
  }, [roomId, startDate, endDate, currency, guests, router]);

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
    if (!room || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return convertPrice(room.price * nights);
  };

  const getNights = (): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = language === "ar"
      ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to review page with all data
    const reviewUrl = `/booking/review?${searchParams.toString()}`;
    router.push(reviewUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-xl text-stone-600">{language === "ar" ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Booking Timeline */}
      <BookingTimeline currentStep={3} />
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-4 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className={`text-2xl font-bold text-stone-800 mb-6 text-center font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
            {t("step3")}
          </h1>

          <div className="bg-stone-100 rounded-lg shadow-lg p-6 md:p-8">
            {/* Booking Summary */}
            <div className={`mb-6 pb-6 border-b border-stone-200 ${language === "ar" ? "text-right" : "text-left"}`}>
              <h2 className={`text-xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                {t("bookingSummary")}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">{t("roomType")}:</span>
                  <span className="font-semibold text-stone-800">
                    {t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">{language === "ar" ? "تاريخ الوصول" : "Check-in"}:</span>
                  <span className="font-semibold text-stone-800">{formatDate(startDate!)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">{language === "ar" ? "تاريخ المغادرة" : "Check-out"}:</span>
                  <span className="font-semibold text-stone-800">{formatDate(endDate!)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">{t("nights")}:</span>
                  <span className="font-semibold text-stone-800">{getNights()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-300">
                  <span className="text-lg font-bold text-stone-800">{t("totalPrice")}:</span>
                  <span className="text-xl font-bold text-stone-800">{formatPrice(calculateTotalPrice())}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className={`space-y-6 ${language === "ar" ? "text-right" : "text-left"}`}>
              <h2 className={`text-xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                {language === "ar" ? "معلومات الدفع" : "Payment Information"}
              </h2>

              {/* Payment Method */}
              <div>
                <label className={`block text-sm font-semibold text-stone-800 mb-3 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {language === "ar" ? "طريقة الدفع" : "Payment Method"}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-stone-800">{language === "ar" ? "بطاقة ائتمانية" : "Credit Card"}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-stone-800">{language === "ar" ? "نقداً عند الوصول" : "Cash on Arrival"}</span>
                  </label>
                </div>
              </div>

              {paymentMethod === "card" && (
                <>
                  {/* Card Number */}
                  <div>
                    <label className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {language === "ar" ? "رقم البطاقة" : "Card Number"}
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                      placeholder={language === "ar" ? "1234 5678 9012 3456" : "1234 5678 9012 3456"}
                      className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      maxLength={19}
                    />
                  </div>

                  {/* Card Holder Name */}
                  <div>
                    <label className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                      {language === "ar" ? "اسم حامل البطاقة" : "Card Holder Name"}
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder={language === "ar" ? "الاسم كما هو على البطاقة" : "Name as on card"}
                      className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div>
                      <label className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          setExpiryDate(value);
                        }}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                        maxLength={5}
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {language === "ar" ? "CVV" : "CVV"}
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className={`pt-4 flex gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <Link
                  href={`/booking/guest-info?${new URLSearchParams({
                    roomId: roomId || "",
                    startDate: startDate || "",
                    endDate: endDate || "",
                    currency: currency,
                  }).toString()}`}
                  className={`flex-1 bg-stone-300 text-stone-800 text-center py-4 rounded-lg font-semibold hover:bg-stone-400 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
                >
                  {t("previous")}
                </Link>
                <button
                  type="submit"
                  className={`flex-1 bg-stone-800 text-white py-4 rounded-lg font-semibold hover:bg-stone-700 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
                >
                  {t("next")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

