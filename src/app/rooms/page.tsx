"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation, getFeatureTranslation } from "@/lib/translations";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface RoomType {
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

function RoomsPageContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  
  // Ref لمنع التكرار وللتحكم في التمرير الأولي
  const initialScrollDone = useRef(false);

  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  // 1. جلب البيانات وتحديد الغرفة المختارة
  useEffect(() => {
    fetch('/api/room-types')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRoomTypes(data);
          
          const roomTypeIdParam = searchParams.get('roomTypeId');
          
          if (roomTypeIdParam) {
            const roomTypeId = parseInt(roomTypeIdParam, 10);
            const roomType = data.find(rt => rt.id === roomTypeId);
            if (roomType) {
              setSelectedRoomTypeId(roomTypeId);
              // ملاحظة: نترك initialScrollDone = false لكي نسمح بالتمرير
            } else if (data.length > 0) {
              setSelectedRoomTypeId(data[0].id);
              initialScrollDone.current = true; // لا تمرر تلقائياً إذا الرابط خطأ
            }
          } else {
            // إذا دخل الصفحة بدون باراميتر
            if (data.length > 0) {
              setSelectedRoomTypeId(data[0].id);
            }
            initialScrollDone.current = true; // لا تمرر تلقائياً
          }
        } else {
          console.error('Invalid data format:', data);
          setRoomTypes([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching room types:', err);
        setRoomTypes([]);
        setLoading(false);
      });
  }, [searchParams]);

  // 2. منطق التمرير التلقائي عند فتح الصفحة (الحل الجديد)
  useEffect(() => {
    // الشرط: التحميل انتهى، البيانات موجودة، تم اختيار غرفة، ولم نمرر بعد
    if (!loading && roomTypes.length > 0 && selectedRoomTypeId !== null && !initialScrollDone.current) {
      
      const targetId = `room-type-${selectedRoomTypeId}`;
      const element = document.getElementById(targetId);

      if (element) {
        // تأخير بسيط جداً للسماح للصور والعناصر بأخذ حجمها
        setTimeout(() => {
          const headerHeight = 100; // ارتفاع الهيدر لديك
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          const offsetPosition = elementTop - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          // نضع علامة أننا انتهينا من التمرير الأولي
          initialScrollDone.current = true;
        }, 300);
      }
    }
  }, [loading, roomTypes, selectedRoomTypeId]);


  // 3. وظيفة التمرير اليدوي (عند الضغط على الأزرار)
  const scrollToRoom = (roomTypeId: number) => {
    setSelectedRoomTypeId(roomTypeId);
    
    // تأخير بسيط جداً لضمان تحديث الـ State قبل الحركة
    requestAnimationFrame(() => {
        const roomElement = document.getElementById(`room-type-${roomTypeId}`);
        if (roomElement) {
            const headerHeight = 100;
            const elementRect = roomElement.getBoundingClientRect();
            const elementPosition = elementRect.top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
  };

  // 4. تحديث الغرفة المختارة في القائمة الجانبية عند التمرير اليدوي للمستخدم
  useEffect(() => {
    const handleScroll = () => {
      // إذا كان التمرير التلقائي لا يزال جارياً، لا تفعل شيئاً لتجنب التعارض
      if (!initialScrollDone.current && searchParams.get('roomTypeId')) return;

      let currentSelectedId: number | null = null;
      
      for (const roomType of roomTypes) {
        const el = document.getElementById(`room-type-${roomType.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // المنطق: إذا كانت الغرفة في منتصف الشاشة تقريباً
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSelectedId = roomType.id;
            break;
          }
        }
      }
      
      if (currentSelectedId !== null && currentSelectedId !== selectedRoomTypeId) {
        setSelectedRoomTypeId(currentSelectedId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // استدعاء أولي
    return () => window.removeEventListener('scroll', handleScroll);
  }, [roomTypes, selectedRoomTypeId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className={`text-2xl text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  // --- JSX (نفس التصميم الأصلي تماماً) ---
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-800 text-white pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className={`max-w-3xl mx-auto text-center ${language === "ar" ? "font-cairo" : ""}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 font-playfair">
              {t("roomsTitle")}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {t("roomsSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="container mx-auto px-4 pt-4 pb-8">
        {/* Mobile Index - Show on small screens */}
        <div className={`lg:hidden mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
          <div className="flex flex-wrap gap-2">
            {roomTypes.map((roomType) => (
              <button
                key={roomType.id}
                onClick={() => scrollToRoom(roomType.id)}
                className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                  language === "ar" ? "font-cairo" : "font-playfair"
                } bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 hover:border-stone-300 text-sm`}
              >
                {t(roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${language === "ar" ? "grid-cols-1 lg:grid-cols-[300px_1fr_400px]" : "grid-cols-1 lg:grid-cols-[300px_1fr_400px]"} gap-8`}>
          {/* Left: Room Type List / Index - Fixed */}
          <div className={`hidden lg:block ${language === "ar" ? "order-3 lg:order-1" : "order-1"}`} style={{ height: '380vh' }}>
            <div className={`sticky top-[65vh] -translate-y-1/2 h-fit space-y-1 ${language === "ar" ? "text-right" : "text-left"}`}>
              {roomTypes.map((roomType) => (
                <button
                  key={roomType.id}
                  onClick={() => scrollToRoom(roomType.id)}
                  className={`block w-full ${language === "ar" ? "text-right" : "text-left"} py-2 transition-all duration-200 ${
                    language === "ar" ? "font-cairo" : "font-playfair"
                  } ${
                    selectedRoomTypeId === roomType.id
                      ? "text-amber-700 font-light"
                      : "text-stone-800 font-light"
                  } hover:opacity-70`}
                >
                  {t(roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                </button>
              ))}
            </div>
          </div>

          {/* Center and Right: All Room Types */}
          <div className={`col-span-1 lg:col-span-2 ${language === "ar" ? "order-1 lg:order-2" : "order-2"} ${roomTypes.length > 0 ? "space-y-16" : ""}`}>
            {roomTypes.map((roomType, index) => (
              <div
                key={roomType.id}
                id={`room-type-${roomType.id}`}
                className={`flex flex-col justify-center py-16`}
              >
                <div className={`grid ${language === "ar" ? "grid-cols-1 lg:grid-cols-[1fr_400px]" : "grid-cols-1 lg:grid-cols-[1fr_400px]"} gap-8 items-start`}>
                  {/* Center: Room Image with Navigation */}
                  <div className={`relative ${language === "ar" ? "order-2 lg:order-1" : "order-1"} h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-stone-200`}>
                    {/* Generate images for each room type */}
                    {(() => {
                      // Define images for each room type (2 images per type)
                      const roomImages: { [key: string]: string[] } = {
                        'roomType1': ['/images/rooms/primary-deluxe-room.jpg', '/images/rooms/additional-1-deluxe-room.jpg'],
                        'roomType2': ['/images/rooms/primary-luxury-suite.jpg', '/images/rooms/additional-1-luxury-suite.jpg'],
                        'roomType3': ['/images/rooms/primary-presidential-suite.jpg', '/images/rooms/additional-1-presidential-suite.jpg'],
                        'roomType4': ['/images/rooms/primary-family-room.jpg', '/images/rooms/additional-1-family-room.jpg'],
                        'roomType5': ['/images/rooms/primary-honeymoon-suite.jpg', '/images/rooms/additional-1-honeymoon-suite.jpg'],
                      };
                      
                      const images = roomImages[roomType.typeKey] || [
                        `/images/rooms/primary-${roomType.typeKey.replace('roomType', '').toLowerCase().replace('1', 'deluxe-room').replace('2', 'luxury-suite').replace('3', 'presidential-suite').replace('4', 'family-room').replace('5', 'honeymoon-suite')}.jpg`,
                        `/images/rooms/additional-1-${roomType.typeKey.replace('roomType', '').toLowerCase().replace('1', 'deluxe-room').replace('2', 'luxury-suite').replace('3', 'presidential-suite').replace('4', 'family-room').replace('5', 'honeymoon-suite')}.jpg`
                      ];
                      const currentIndex = currentImageIndex[roomType.id] || 0;
                      return (
                        <>
                          <Image
                            src={images[currentIndex]}
                            alt={t(roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                            fill
                            className="object-cover"
                            priority={index < 2}
                            unoptimized={true}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                          
                          {/* Navigation Dots */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                            {images.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() => setCurrentImageIndex({ ...currentImageIndex, [roomType.id]: imgIndex })}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  currentIndex === imgIndex 
                                    ? "bg-stone-800" 
                                    : "bg-stone-500 hover:bg-stone-600"
                                }`}
                                aria-label={`Go to image ${imgIndex + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Right: Room Details */}
                  <div className={`${language === "ar" ? "order-1 lg:order-2 text-right" : "order-2 text-left"} space-y-6`}>
                    <div>
                      <h2 className={`text-4xl font-bold text-stone-800 mb-4 ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
                        {t(roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                      </h2>
                      <p className={`text-lg text-stone-600 mb-6 font-light ${language === "ar" ? "font-cairo" : ""}`}>
                        {t(roomType.descKey as keyof typeof import("@/lib/translations").translations.ar)}
                      </p>
                    </div>

                    {/* Room Specifications */}
                    <div className={`flex ${language === "ar" ? "flex-row-reverse justify-end" : "justify-start"} items-center gap-8 pb-6 border-b border-stone-200`}>
                      <div>
                        <div className={`text-2xl font-light text-stone-800 ${language === "ar" ? "font-cairo" : ""}`}>
                          {roomType.size} {t("squareMeters")}
                        </div>
                        <div className={`text-sm text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
                          {t("roomSize")}
                        </div>
                      </div>
                      <div className={`h-12 ${language === "ar" ? "border-r" : "border-l"} border-stone-300`}></div>
                      <div>
                        <div className={`text-2xl font-light text-stone-800 ${language === "ar" ? "font-cairo" : ""}`}>
                          {roomType.guests}
                        </div>
                        <div className={`text-sm text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
                          {t("roomGuests")}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className={`text-xl font-light text-stone-800 mb-4 ${language === "ar" ? "font-cairo" : ""}`}>
                        {t("roomFeatures")}
                      </h3>
                      <div className={`flex flex-wrap gap-3 ${language === "ar" ? "flex-row-reverse justify-end" : "justify-start"}`}>
                        {roomType.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className={`bg-stone-100 text-stone-700 px-4 py-2 rounded-lg text-sm ${language === "ar" ? "font-cairo" : ""}`}
                          >
                            {getFeatureTranslation(feature, language)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className={`pt-6 border-t border-stone-200 ${language === "ar" ? "text-right" : "text-left"}`}>
                      <div className={`mb-6 ${language === "ar" ? "font-cairo" : ""}`}>
                        <span className="text-4xl font-light text-stone-800">
                          ${roomType.price}
                        </span>
                        <span className={`text-stone-600 ${language === "ar" ? "mr-2" : "ml-2"}`}>
                          {t("perNight")}
                        </span>
                      </div>
                      <Link
                        href={`/booking?roomTypeId=${roomType.id}`}
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

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-xl text-stone-600">Loading...</div>
      </div>
    }>
      <RoomsPageContent />
    </Suspense>
  );
}