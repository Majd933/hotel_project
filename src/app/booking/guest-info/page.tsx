"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import BookingTimeline from "@/components/BookingTimeline";
import Link from "next/link";

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

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

function GuestInfoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [room, setRoom] = useState<Room | null>(null);
  const [guests, setGuests] = useState<GuestFormData[]>([{
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  }]);
  const [errors, setErrors] = useState<Array<Partial<GuestFormData>>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const roomId = searchParams.get("roomId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const currency = searchParams.get("currency");

  // Fetch room data
  useEffect(() => {
    if (!roomId || !startDate || !endDate) {
      router.push("/booking");
      return;
    }

    fetch('/api/rooms')
      .then(res => res.json())
      .then((rooms: Room[]) => {
        const foundRoom = rooms.find(r => r.id === Number(roomId));
        if (foundRoom) {
          setRoom(foundRoom);
          // Initialize with only primary guest
          const initialGuests: GuestFormData[] = [{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            notes: "",
          }];
          setGuests(initialGuests);
          setErrors([{}]);
        } else {
          router.push("/booking");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching room:', err);
        router.push("/booking");
      });
  }, [roomId, startDate, endDate, router]);

  const addGuest = () => {
    if (room && guests.length < room.roomType.guests) {
      setGuests([...guests, {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        notes: "",
      }]);
      setErrors([...errors, {}]);
    }
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      const newGuests = guests.filter((_, i) => i !== index);
      const newErrors = errors.filter((_, i) => i !== index);
      setGuests(newGuests);
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Array<Partial<GuestFormData>> = guests.map(() => ({}));
    let isValid = true;

    guests.forEach((guest, index) => {
      if (!guest.firstName.trim()) {
        newErrors[index].firstName = t("firstNameRequired");
        isValid = false;
      }

      if (!guest.lastName.trim()) {
        newErrors[index].lastName = t("lastNameRequired");
        isValid = false;
      }

      if (!guest.email.trim()) {
        newErrors[index].email = t("emailRequired");
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
        newErrors[index].email = t("emailInvalid");
        isValid = false;
      }

      if (!guest.phone.trim()) {
        newErrors[index].phone = t("phoneRequired");
        isValid = false;
      } else if (!/^[\d\s\-\+\(\)]+$/.test(guest.phone)) {
        newErrors[index].phone = t("phoneInvalid");
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleGuestChange = (
    index: number,
    field: keyof GuestFormData,
    value: string
  ) => {
    const newGuests = [...guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setGuests(newGuests);

    // Clear error when user starts typing
    if (errors[index] && errors[index][field]) {
      const newErrors = [...errors];
      newErrors[index] = { ...newErrors[index], [field]: undefined };
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

            // Navigate to payment page with booking details
            const params = new URLSearchParams({
              roomId: roomId || "",
              startDate: startDate || "",
              endDate: endDate || "",
              currency: currency || "USD",
              guests: JSON.stringify(guests),
            });
            router.push(`/booking/payment?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className={`text-xl text-stone-600 ${language === "ar" ? "font-cairo" : ""}`}>
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Booking Timeline */}
      <BookingTimeline currentStep={2} />
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-4 pb-6">
        <div className="max-w-3xl mx-auto">
          {/* Guest Information Title */}
          <h1 className={`text-3xl font-bold text-stone-800 mb-8 text-center font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
            {t("guestInformation")}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {guests.map((guest, index) => (
              <div key={index} className="bg-stone-100 rounded-lg shadow-lg p-8">
                <div className={`flex flex-col gap-3 mb-6 ${language === "ar" ? "text-right" : "text-left"}`}>
                  <div className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <h2 className={`text-2xl font-bold text-stone-800 font-playfair ${language === "ar" ? "font-cairo" : ""}`}>
                      {index === 0 ? t("primaryGuest") : t("additionalGuest")}
                    </h2>
                    {guests.length > 1 && index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="text-red-600 hover:text-red-800 transition-colors text-sm font-semibold"
                      >
                        {language === "ar" ? "حذف" : "Remove"}
                      </button>
                    )}
                  </div>
                </div>

                <div className={`space-y-6 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor={`firstName-${index}`}
                      className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                    >
                      {t("firstName")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`firstName-${index}`}
                      value={guest.firstName}
                      onChange={(e) => handleGuestChange(index, "firstName", e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        errors[index]?.firstName ? "border-red-500" : "border-stone-300"
                      } rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      placeholder={language === "ar" ? "أدخل الاسم الأول" : "Enter first name"}
                    />
                    {errors[index]?.firstName && (
                      <p className={`mt-1 text-sm text-red-500 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {errors[index].firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor={`lastName-${index}`}
                      className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                    >
                      {t("lastName")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`lastName-${index}`}
                      value={guest.lastName}
                      onChange={(e) => handleGuestChange(index, "lastName", e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        errors[index]?.lastName ? "border-red-500" : "border-stone-300"
                      } rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      placeholder={language === "ar" ? "أدخل اسم العائلة" : "Enter last name"}
                    />
                    {errors[index]?.lastName && (
                      <p className={`mt-1 text-sm text-red-500 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {errors[index].lastName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor={`email-${index}`}
                      className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                    >
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id={`email-${index}`}
                      value={guest.email}
                      onChange={(e) => handleGuestChange(index, "email", e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        errors[index]?.email ? "border-red-500" : "border-stone-300"
                      } rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors[index]?.email && (
                      <p className={`mt-1 text-sm text-red-500 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {errors[index].email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor={`phone-${index}`}
                      className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                    >
                      {t("phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id={`phone-${index}`}
                      value={guest.phone}
                      onChange={(e) => handleGuestChange(index, "phone", e.target.value)}
                      className={`w-full px-4 py-3 border ${
                        errors[index]?.phone ? "border-red-500" : "border-stone-300"
                      } rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      placeholder={language === "ar" ? "+963 999 999 999" : "+1 234 567 8900"}
                    />
                    {errors[index]?.phone && (
                      <p className={`mt-1 text-sm text-red-500 ${language === "ar" ? "text-right" : "text-left"}`}>
                        {errors[index].phone}
                      </p>
                    )}
                  </div>

                  {/* Notes - Only for first guest */}
                  {index === 0 && (
                    <div>
                      <label
                        htmlFor={`notes-${index}`}
                        className={`block text-sm font-semibold text-stone-800 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        {t("notes")}
                      </label>
                      <textarea
                        id={`notes-${index}`}
                        value={guest.notes}
                        onChange={(e) => handleGuestChange(index, "notes", e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                        placeholder={
                          language === "ar"
                            ? "أي ملاحظات إضافية أو طلبات خاصة..."
                            : "Any additional notes or special requests..."
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Guest Button - Show after all guest forms */}
            {room && guests.length < room.roomType.guests && (
              <div className={`text-center ${language === "ar" ? "text-right" : "text-left"}`}>
                <button
                  type="button"
                  onClick={addGuest}
                  className={`bg-stone-200 text-stone-800 px-6 py-3 rounded-lg font-semibold hover:bg-stone-300 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
                >
                  + {t("addGuest")}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`pt-4 flex gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <Link
                href="/booking"
                className={`flex-1 bg-stone-300 text-stone-800 text-center py-4 rounded-lg font-semibold hover:bg-stone-400 transition-colors ${language === "ar" ? "font-cairo" : ""}`}
              >
                {t("previous")}
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-stone-800 text-white py-4 rounded-lg font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  language === "ar" ? "font-cairo" : ""
                }`}
              >
                {isSubmitting
                  ? language === "ar"
                    ? "جاري الإرسال..."
                    : "Submitting..."
                  : t("next")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function GuestInfoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-xl text-stone-600">Loading...</div>
      </div>
    }>
      <GuestInfoPageContent />
    </Suspense>
  );
}
