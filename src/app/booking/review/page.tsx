"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import BookingTimeline from "@/components/BookingTimeline";
import Image from "next/image";
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

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

type Currency = "SYP" | "USD" | "EUR";

// Exchange rates (example - update with real rates)
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  SYP: 13000,
};

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [room, setRoom] = useState<Room | null>(null);
  const [guests, setGuests] = useState<GuestFormData[]>([]);
  const [loading, setLoading] = useState(true);

  const roomId = searchParams.get("roomId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const currency = (searchParams.get("currency") || "USD") as Currency;
  const guestsParam = searchParams.get("guests");

  useEffect(() => {
    if (!roomId || !startDate || !endDate || !currency || !guestsParam) {
      router.push("/booking");
      return;
    }

    // Parse guests data
    try {
      const parsedGuests = JSON.parse(guestsParam);
      setGuests(parsedGuests);
    } catch (e) {
      console.error("Error parsing guests data:", e);
      router.push("/booking");
      return;
    }

    // Fetch room data
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
  }, [roomId, startDate, endDate, currency, guestsParam, router]);

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

  const handleConfirmBooking = () => {
    // Navigate to confirm page
    const confirmUrl = `/booking/confirm?${searchParams.toString()}`;
    router.push(confirmUrl);
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
      <BookingTimeline currentStep={4} />
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-4 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className={`text-2xl font-bold text-stone-800 mb-6 text-center font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
            {t("step4")}
          </h1>

          <div className="bg-stone-100 rounded-lg shadow-lg overflow-hidden">
            {/* Room Image */}
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={room.image}
                alt={t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Booking Details */}
            <div className="p-6 md:p-8">
              {/* Room Details */}
              <div className={`mb-6 ${language === "ar" ? "text-right" : "text-left"}`}>
                <h2 className={`text-2xl font-bold text-stone-800 mb-2 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                </h2>
                <p className="text-stone-600 mb-4">
                  {t(room.descKey as keyof typeof import("@/lib/translations").translations.ar)}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-stone-600">{t("roomGuests")}: </span>
                    <span className="font-semibold text-stone-800">{room.guests}</span>
                  </div>
                  <div>
                    <span className="text-sm text-stone-600">{t("roomSize")}: </span>
                    <span className="font-semibold text-stone-800">{room.size} {t("squareMeters")}</span>
                  </div>
                  <div>
                    <span className="text-sm text-stone-600">{t("roomBeds")}: </span>
                    <span className="font-semibold text-stone-800">{room.beds}</span>
                  </div>
                </div>
              </div>

              {/* Dates and Duration */}
              <div className={`mb-6 pb-6 border-b border-stone-200 ${language === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {language === "ar" ? "تفاصيل الحجز" : "Booking Details"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-stone-600 mb-1">{language === "ar" ? "تاريخ الوصول" : "Check-in"}</div>
                    <div className="text-lg font-semibold text-stone-800">{formatDate(startDate!)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-600 mb-1">{language === "ar" ? "تاريخ المغادرة" : "Check-out"}</div>
                    <div className="text-lg font-semibold text-stone-800">{formatDate(endDate!)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-stone-600 mb-1">{t("duration")}</div>
                    <div className="text-lg font-semibold text-stone-800">
                      {getNights()} {getNights() === 1 ? (language === "ar" ? "ليلة" : "night") : (language === "ar" ? "ليالي" : "nights")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className={`mb-6 pb-6 border-b border-stone-200 ${language === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {t("guestInformation")}
                </h3>
                <div className="space-y-4">
                  {guests.map((guest, index) => (
                    <div key={index} className="bg-stone-50 p-4 rounded-lg">
                      <div className="font-semibold text-stone-800 mb-2">
                        {index === 0 ? t("primaryGuest") : `${t("additionalGuest")} ${index}`}
                      </div>
                      <div className="space-y-1 text-stone-700">
                        <div>
                          <span className="text-stone-600">{t("firstName")}: </span>
                          <span>{guest.firstName} {guest.lastName}</span>
                        </div>
                        <div>
                          <span className="text-stone-600">{t("email")}: </span>
                          <span>{guest.email}</span>
                        </div>
                        <div>
                          <span className="text-stone-600">{t("phone")}: </span>
                          <span>{guest.phone}</span>
                        </div>
                        {guest.notes && (
                          <div>
                            <span className="text-stone-600">{t("notes")}: </span>
                            <span>{guest.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className={`mb-6 ${language === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {t("totalPrice")}
                </h3>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-600">
                      {formatPrice(room.price)} × {getNights()} {getNights() === 1 ? (language === "ar" ? "ليلة" : "night") : (language === "ar" ? "ليالي" : "nights")}
                    </span>
                    <span className="text-stone-600">{formatPrice(room.price * getNights())}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-300">
                    <span className="text-xl font-bold text-stone-800">{t("totalPrice")}</span>
                    <span className="text-2xl font-bold text-stone-800">{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className={`flex gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <Link
                  href={`/booking/payment?${new URLSearchParams({
                    roomId: roomId || "",
                    startDate: startDate || "",
                    endDate: endDate || "",
                    currency: currency,
                    guests: guestsParam || "",
                  }).toString()}`}
                  className={`flex-1 bg-stone-300 text-stone-800 text-center py-4 rounded-lg font-semibold hover:bg-stone-400 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
                >
                  {t("previous")}
                </Link>
                <button
                  onClick={handleConfirmBooking}
                  className={`flex-1 bg-stone-800 text-white py-4 rounded-lg font-semibold hover:bg-stone-700 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
                >
                  {t("bookNow")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-xl text-stone-600">Loading...</div>
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}

