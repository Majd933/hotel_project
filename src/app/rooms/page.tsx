"use client";

import { useEffect, useState, useRef } from "react";
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
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const roomRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRooms(data);
          // Set first room as selected by default
          if (data.length > 0) {
            setSelectedRoomId(data[0].id);
          }
        } else {
          console.error('Invalid data format:', data);
          setRooms([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setRooms([]);
        setLoading(false);
      });
  }, []);

  const scrollToRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    const roomElement = roomRefs.current[roomId];
    if (roomElement) {
      roomElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update selectedRoomId on scroll
  useEffect(() => {
    const handleScroll = () => {
      let currentSelectedId: number | null = null;
      for (const room of rooms) {
        const el = roomRefs.current[room.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          // Consider a room "selected" if its top is within the viewport and it's the closest to the top
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSelectedId = room.id;
            break;
          }
        }
      }
      if (currentSelectedId !== null && currentSelectedId !== selectedRoomId) {
        setSelectedRoomId(currentSelectedId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rooms, selectedRoomId]);

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

      {/* Rooms Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Mobile Index - Show on small screens */}
        <div className={`lg:hidden mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
          <div className="flex flex-wrap gap-2">
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => scrollToRoom(r.id)}
                className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                  language === "ar" ? "font-cairo" : "font-playfair"
                } bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 hover:border-stone-300 text-sm`}
              >
                {t(r.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${language === "ar" ? "grid-cols-1 lg:grid-cols-[300px_1fr_400px]" : "grid-cols-1 lg:grid-cols-[300px_1fr_400px]"} gap-8`}>
          {/* Left: Room List / Index - Fixed */}
          <div className={`hidden lg:block ${language === "ar" ? "order-3 lg:order-1" : "order-1"}`} style={{ height: '380vh' }}>
            <div className={`sticky top-[65vh] -translate-y-1/2 h-fit space-y-1 ${language === "ar" ? "text-right" : "text-left"}`}>
              {rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => scrollToRoom(r.id)}
                  className={`block w-full ${language === "ar" ? "text-right" : "text-left"} py-2 transition-all duration-200 ${
                    language === "ar" ? "font-cairo" : "font-playfair"
                  } ${
                    selectedRoomId === r.id
                      ? "text-amber-700 font-light"
                      : "text-stone-800 font-light"
                  } hover:opacity-70`}
                >
                  {t(r.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                </button>
              ))}
            </div>
          </div>

          {/* Center and Right: All Rooms */}
          <div className={`col-span-1 lg:col-span-2 ${language === "ar" ? "order-1 lg:order-2" : "order-2"} ${rooms.length > 0 ? "space-y-16" : ""}`}>
            {rooms.map((room, index) => (
              <div
                key={room.id}
                ref={(el) => {
                  if (el) roomRefs.current[room.id] = el;
                }}
                className={`flex flex-col justify-center py-16`}
              >
                <div className={`grid ${language === "ar" ? "grid-cols-1 lg:grid-cols-[1fr_400px]" : "grid-cols-1 lg:grid-cols-[1fr_400px]"} gap-8 items-start`}>
                  {/* Center: Room Image */}
                  <div className={`relative ${language === "ar" ? "order-2 lg:order-1" : "order-1"} h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-stone-200`}>
                    <Image
                      src={room.image}
                      alt={t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                      fill
                      className="object-cover"
                      priority={index < 2}
                      unoptimized={true}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>

                  {/* Right: Room Details */}
                  <div className={`${language === "ar" ? "order-1 lg:order-2 text-right" : "order-2 text-left"} space-y-6`}>
                    <div>
                      <h2 className={`text-4xl font-bold text-stone-800 mb-4 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                        {t(room.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                      </h2>
                      <p className={`text-lg text-stone-600 mb-6 font-light ${language === "ar" ? "font-cairo" : ""}`}>
                        {t(room.descKey as keyof typeof import("@/lib/translations").translations.ar)}
                      </p>
                    </div>

                    {/* Room Specifications */}
                    <div className={`flex ${language === "ar" ? "flex-row-reverse justify-end" : "justify-start"} gap-6 pb-6 border-b border-stone-200`}>
                      <div>
                        <div className={`text-2xl font-light text-stone-800 ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
                          {room.size} {t("squareMeters")}
                        </div>
                        <div className={`text-sm text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
                          {t("roomSize")}
                        </div>
                      </div>
                      <div className={`${language === "ar" ? "border-r" : "border-l"} border-stone-300 px-6`}>
                        <div className={`text-2xl font-light text-stone-800 ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
                          {room.guests}
                        </div>
                        <div className={`text-sm text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
                          {t("roomGuests")}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className={`text-xl font-light text-stone-800 mb-4 ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
                        {t("roomFeatures")}
                      </h3>
                      <div className={`flex flex-wrap gap-3 ${language === "ar" ? "flex-row-reverse justify-end" : "justify-start"}`}>
                        {room.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="bg-stone-100 text-stone-700 px-4 py-2 rounded-lg text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className={`pt-6 border-t border-stone-200 ${language === "ar" ? "text-right" : "text-left"}`}>
                      <div className={`mb-6 ${language === "ar" ? "font-cairo" : ""}`}>
                        <span className="text-4xl font-light text-stone-800">
                          ${room.price}
                        </span>
                        <span className={`text-stone-600 ${language === "ar" ? "mr-2" : "ml-2"}`}>
                          {t("perNight")}
                        </span>
                      </div>
                      <Link
                        href="/booking"
                        className="inline-block bg-stone-800 text-white px-8 py-3 rounded-lg font-light hover:bg-stone-700 transition-colors"
                      >
                        {t("bookNow")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
