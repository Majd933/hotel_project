"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import BookingCalendar from "@/components/BookingCalendar";
import BookingTimeline from "@/components/BookingTimeline";
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

interface Room {
  id: number;
  roomTypeId: number;
  roomNumber: string;
  roomType: RoomType;
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
  const [roomTypes, setRoomTypes] = useState<Room[]>([]); // One room per type
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<Record<string, { total: number; available: number; rooms: Room[] }>>({});
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then((data: Room[]) => {
        setRooms(data);
        
        // Get unique room types (one room per type)
        const typesMap = new Map<string, Room>();
        data.forEach(room => {
          const typeKey = room.roomType.typeKey;
          if (!typesMap.has(typeKey)) {
            typesMap.set(typeKey, room);
          }
        });
        const uniqueTypes = Array.from(typesMap.values());
        setRoomTypes(uniqueTypes);
        setAvailableRooms(uniqueTypes);
        
        if (uniqueTypes.length > 0) {
          setSelectedRoomType(uniqueTypes[0].roomType.typeKey);
          setSelectedRoomId(uniqueTypes[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setLoading(false);
      });
  }, []);

  // Fetch booked dates for selected room type
  useEffect(() => {
    if (!selectedRoomType) {
      setBookedDates([]);
      return;
    }

    const fetchBookedDates = () => {
      fetch(`/api/bookings/booked-dates-by-type?typeKey=${selectedRoomType}`)
        .then(res => res.json())
        .then((data: { bookedDates: string[] }) => {
          // Parse dateKeys (YYYY-MM-DD) as local dates to avoid timezone issues
          const dates = data.bookedDates.map(dateKey => {
            // Parse dateKey (YYYY-MM-DD) as local date
            const [year, month, day] = dateKey.split('-').map(Number);
            const date = new Date(year, month - 1, day, 0, 0, 0, 0); // month is 0-indexed, use local time
            return date;
          });
          setBookedDates(dates);
        })
        .catch(err => {
          console.error('Error fetching booked dates:', err);
          setBookedDates([]);
        });
    };

    fetchBookedDates();
    // Refresh every 30 seconds in case bookings change
    const interval = setInterval(fetchBookedDates, 30000);
    return () => clearInterval(interval);
  }, [selectedRoomType]);

  // Check availability when dates are selected
  useEffect(() => {
    if (selectedDates.length === 2) {
      setCheckingAvailability(true);
      const startDate = selectedDates[0].toISOString();
      const endDate = selectedDates[1].toISOString();
      
      fetch(`/api/rooms/availability?startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.json())
        .then((data: { availability: Record<string, { total: number; available: number; rooms: Room[] }>, allAvailableRooms: Room[], bookedRoomIds: number[] }) => {
          setAvailability(data.availability);
          
          // Get one room per type from available rooms, or use first room of type if none available
          const typesMap = new Map<string, Room>();
          roomTypes.forEach(roomType => {
            const typeKey = roomType.roomType.typeKey;
            const typeAvailability = data.availability[typeKey];
            if (typeAvailability && typeAvailability.rooms.length > 0) {
              // Use first available room of this type
              typesMap.set(typeKey, typeAvailability.rooms[0]);
            } else {
              // Use first room of this type from all rooms (even if not available)
              const firstRoomOfType = rooms.find(r => r.roomType.typeKey === typeKey);
              if (firstRoomOfType) {
                typesMap.set(typeKey, firstRoomOfType);
              }
            }
          });
          
          const availableTypes = Array.from(typesMap.values());
          setAvailableRooms(availableTypes);
          
          // Update selected room if current selection is not in available types
          if (selectedRoomType) {
            const currentTypeRoom = availableTypes.find(r => r.roomType.typeKey === selectedRoomType);
            if (currentTypeRoom) {
              setSelectedRoomId(currentTypeRoom.id);
            } else if (availableTypes.length > 0) {
              // Select first available type
              setSelectedRoomType(availableTypes[0].roomType.typeKey);
              setSelectedRoomId(availableTypes[0].id);
            }
          }
          
          setCheckingAvailability(false);
        })
        .catch(err => {
          console.error('Error checking availability:', err);
          setCheckingAvailability(false);
          // On error, show all types
          setAvailableRooms(roomTypes);
        });
    } else {
      // No dates selected, show all room types
      setAvailableRooms(roomTypes);
      setAvailability({});
    }
  }, [selectedDates, rooms, roomTypes, selectedRoomType]);

  const selectedRoom = selectedRoomId !== null 
    ? (availableRooms.find(r => r.id === selectedRoomId) || rooms.find(r => r.id === selectedRoomId))
    : undefined;

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
    return convertPrice(selectedRoom.roomType.price * nights);
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
                  value={selectedRoomType || ""}
                  onChange={(e) => {
                    const typeKey = e.target.value;
                    setSelectedRoomType(typeKey);
                    // Find a room of this type (prefer available, otherwise any room of this type)
                    const typeRoom = availableRooms.find(r => r.roomType.typeKey === typeKey) 
                      || rooms.find(r => r.roomType.typeKey === typeKey);
                    if (typeRoom) {
                      setSelectedRoomId(typeRoom.id);
                    }
                  }}
                  disabled={checkingAvailability}
                  className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${language === "ar" ? "text-right" : "text-left"} ${checkingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {checkingAvailability ? (
                    <option value="">{language === "ar" ? "جاري التحقق من التوفر..." : "Checking availability..."}</option>
                  ) : roomTypes.length === 0 ? (
                    <option value="">{language === "ar" ? "لا توجد غرف" : "No rooms"}</option>
                  ) : (
                    roomTypes.map((room) => {
                      const typeKey = room.roomType.typeKey;
                      const roomTypeAvailability = availability[typeKey];
                      const isAvailable = roomTypeAvailability && roomTypeAvailability.available > 0;
                      const availabilityText = roomTypeAvailability 
                        ? `(${roomTypeAvailability.available}/${roomTypeAvailability.total} ${language === "ar" ? "متاح" : "available"})`
                        : selectedDates.length === 2
                        ? `(${language === "ar" ? "غير متاح" : "not available"})`
                        : "";
                      return (
                        <option key={typeKey} value={typeKey} disabled={selectedDates.length === 2 && !isAvailable}>
                          {t(typeKey as keyof typeof import("@/lib/translations").translations.ar)} - {formatPrice(room.roomType.price)} / {t("perNight")} {availabilityText}
                        </option>
                      );
                    })
                  )}
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
                <div className="grid md:grid-cols-3 gap-4 mb-2">
                  <div>
                    <span className="text-sm text-stone-600">{t("price")}: </span>
                    <span className="text-lg font-bold text-stone-800">{formatPrice(selectedRoom.roomType.price)} / {t("perNight")}</span>
                  </div>
                  <div>
                    <span className="text-sm text-stone-600">{t("roomGuests")}: </span>
                    <span className="text-lg font-semibold text-stone-800">{selectedRoom.roomType.guests}</span>
                  </div>
                  <div>
                    <span className="text-sm text-stone-600">{t("roomSize")}: </span>
                    <span className="text-lg font-semibold text-stone-800">{selectedRoom.roomType.size} {t("squareMeters")}</span>
                  </div>
                </div>
                {selectedDates.length === 2 && selectedRoomType && availability[selectedRoomType] && (
                  <div className={`text-sm ${availability[selectedRoomType].available > 0 ? "text-green-700" : "text-red-700"} ${language === "ar" ? "text-right" : "text-left"}`}>
                    {language === "ar" 
                      ? `${availability[selectedRoomType].available} من ${availability[selectedRoomType].total} غرف متاحة`
                      : `${availability[selectedRoomType].available} of ${availability[selectedRoomType].total} rooms available`}
                  </div>
                )}
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
                  src={selectedRoom.roomType.image}
                  alt={t(selectedRoom.roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
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
              bookedDates={bookedDates}
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
              {selectedRoom && selectedDates.length === 2 && selectedRoomType && !checkingAvailability ? (() => {
                const typeAvailability = availability[selectedRoomType];
                const isAvailable = typeAvailability && typeAvailability.available > 0;
                if (!isAvailable) {
                  return (
                    <button
                      disabled
                      className="bg-stone-400 text-stone-600 px-8 py-3 rounded-lg font-semibold cursor-not-allowed whitespace-nowrap opacity-50"
                    >
                      {language === "ar" ? "غير متاح" : "Not available"}
                    </button>
                  );
                }
                return (
                  <Link
                    href={`/booking/guest-info?roomId=${selectedRoom.id}&startDate=${selectedDates[0].toISOString()}&endDate=${selectedDates[1].toISOString()}&currency=${currency}`}
                    className="bg-stone-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-stone-700 transition-colors whitespace-nowrap"
                  >
                    {t("next")}
                  </Link>
                );
              })() : (
                <button
                  disabled
                  className="bg-stone-400 text-stone-600 px-8 py-3 rounded-lg font-semibold cursor-not-allowed whitespace-nowrap opacity-50"
                >
                  {checkingAvailability 
                    ? (language === "ar" ? "جاري التحقق..." : "Checking...")
                    : t("next")}
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

