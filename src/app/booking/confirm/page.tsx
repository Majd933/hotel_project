"use client";

import { useState, useEffect } from "react";
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

export default function ConfirmBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (!roomId) {
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
  }, [roomId, router]);

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
      <BookingTimeline currentStep={5} />
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-4 pb-6">
        <div className="max-w-4xl mx-auto">
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

            {/* Confirmation Message */}
            <div className="p-6 md:p-8 text-center">
              <h2 className={`text-3xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                {t("bookingConfirmed")}
              </h2>
              
              <p className={`text-lg text-stone-700 mb-8 ${language === "ar" ? "font-cairo" : ""}`}>
                {t("bookingConfirmedMessage")}
              </p>
              
              {/* Back to Home Button */}
              <Link
                href="/home"
                className={`inline-block bg-stone-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-stone-700 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
              >
                {t("backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
