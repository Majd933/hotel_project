"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
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

export default function RoomsPage() {
  const { language } = useLanguage();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setLoading(false);
      });
  }, []);

  const gradientClasses = [
    "from-amber-200 to-orange-300",
    "from-blue-200 to-indigo-300",
    "from-purple-200 to-pink-300",
    "from-green-200 to-emerald-300",
    "from-rose-200 to-pink-300",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className={`text-2xl text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className={`max-w-3xl mx-auto text-center ${language === "ar" ? "font-cairo" : ""}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 font-playfair">
              {t("roomsTitle")}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {t("roomsSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Room Image */}
              <div className={`relative h-64 w-full bg-gradient-to-br ${gradientClasses[room.id - 1]}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-7xl opacity-40">🏨</div>
                </div>
                <Image
                  src={room.image}
                  alt={t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide image on error, fallback gradient will show
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>

              {/* Room Info */}
              <div className={`p-6 ${language === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-2xl font-bold mb-2 text-stone-800 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                  {t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                </h3>
                <p className={`text-stone-600 mb-4 ${language === "ar" ? "font-cairo" : ""}`}>
                  {t(room.descKey as keyof typeof import("@/lib/translations").translations.ar)}
                </p>

                {/* Room Details */}
                <div className={`flex flex-wrap gap-4 mb-4 text-sm text-stone-600 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="font-semibold">{t("roomSize")}:</span>
                    <span>{room.size} {t("squareMeters")}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="font-semibold">{t("roomGuests")}:</span>
                    <span>{room.guests}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="font-semibold">{t("roomBeds")}:</span>
                    <span>{room.beds}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className={`font-semibold text-stone-800 mb-2 ${language === "ar" ? "font-cairo" : ""}`}>{t("roomFeatures")}:</h4>
                  <div className={`flex flex-wrap gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    {room.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className={`flex items-center justify-between pt-4 border-t border-stone-200 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <div className={language === "ar" ? "text-right" : "text-left"}>
                    <span className="text-3xl font-bold text-stone-800">
                      ${room.price}
                    </span>
                    <span className={`text-stone-600 ${language === "ar" ? "mr-2" : "ml-2"}`}>{t("perNight")}</span>
                  </div>
                  <Link
                    href={`/booking`}
                    className="bg-stone-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
                  >
                    {t("bookNow")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

