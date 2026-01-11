"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

const ADMIN_PASSWORD = "admin";

interface Booking {
  id: number;
  roomId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  currency: string;
  createdAt: string;
  guestName?: string | null;
  paymentMethod?: string | null;
  room: {
    id: number;
    roomNumber: string;
    roomType: {
      id: number;
      typeKey: string;
      price: number;
    };
  };
}

interface Statistics {
  totalBookings: number;
  totalRooms: number;
  upcomingBookings: number;
  occupancyRate: number;
  revenueByCurrency: Record<string, number>;
  bookingsByRoomType: Record<string, number>;
}

export default function AdminPage() {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const filteredBookings = useMemo(() => {
    if (searchQuery.trim() === "") {
      return bookings;
    } else {
      const query = searchQuery.toLowerCase();
      return bookings.filter((booking) => {
        const guestName = (booking.guestName || "").toLowerCase();
        const roomNumber = booking.room.roomNumber.toLowerCase();
        const roomType = t(booking.room.roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar).toLowerCase();
        const bookingId = booking.id.toString();
        const paymentMethod = (booking.paymentMethod || "").toLowerCase();
        
        return (
          guestName.includes(query) ||
          roomNumber.includes(query) ||
          roomType.includes(query) ||
          bookingId.includes(query) ||
          paymentMethod.includes(query)
        );
      });
    }
  }, [searchQuery, bookings, language]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/statistics")
      ]);
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatistics(statsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        // Remove the booking from the list
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        setBookings(updatedBookings);
        setDeleteConfirmId(null);
        // Refresh statistics
        const statsRes = await fetch("/api/admin/statistics");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStatistics(statsData);
        }
      } else {
        alert(language === "ar" ? "حدث خطأ أثناء حذف الحجز" : "Error deleting booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(language === "ar" ? "حدث خطأ أثناء حذف الحجز" : "Error deleting booking");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setError("");
      setPassword("");
      fetchData();
    } else {
      setError(language === "ar" ? "كلمة المرور غير صحيحة" : "Incorrect password");
      setPassword("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "SYP") {
      return `${amount.toLocaleString()} ${t("syrianPound")}`;
    } else if (currency === "USD") {
      return `$${amount.toLocaleString()} ${t("dollar")}`;
    } else if (currency === "EUR") {
      return `€${amount.toLocaleString()} ${t("euro")}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatNumber = (num: number | string): string => {
    if (language === "ar") {
      const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return String(num).replace(/\d/g, (digit) => arabicIndic[parseInt(digit)]);
    }
    return String(num);
  };

  const formatPaymentMethod = (method: string | null | undefined): string => {
    if (!method) return "-";
    // Map payment method values to display names
    const paymentMethods: Record<string, { ar: string; en: string }> = {
      card: { ar: "بطاقة ائتمانية", en: "Credit Card" },
      cash: { ar: "نقدي", en: "Cash" },
    };
    const display = paymentMethods[method.toLowerCase()];
    return display ? (language === "ar" ? display.ar : display.en) : method;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className={`text-2xl font-bold text-stone-800 mb-6 text-center ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold text-stone-700 mb-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                {language === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                  error ? "border-red-500" : ""
                } ${language === "ar" ? "text-right" : "text-left"}`}
                placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"}
                autoFocus
              />
              {error && (
                <p className={`text-red-500 text-sm mt-2 ${language === "ar" ? "text-right" : "text-left"}`}>
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-stone-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-stone-700 transition-colors"
            >
              {language === "ar" ? "دخول" : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-800 text-white py-25">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <h1 className={`text-5xl font-bold text-center ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
              {language === "ar" ? "لوحة التحكم" : "Admin Panel"}
            </h1>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className={`max-w-7xl mx-auto ${language === "ar" ? "text-right font-cairo" : "text-left"}`}>
          
          {/* Statistics Section */}
          {statistics && (
            <div className="mb-12">
              <h2 className={`text-3xl font-bold text-stone-800 mb-6 ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
                {t("statistics")}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
                  <h3 className="text-stone-600 text-sm font-semibold mb-2">{t("allBookings")}</h3>
                  <p className="text-3xl font-bold text-stone-800">{formatNumber(statistics.totalBookings)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
                  <h3 className="text-stone-600 text-sm font-semibold mb-2">{t("upcomingBookings")}</h3>
                  <p className="text-3xl font-bold text-stone-800">{formatNumber(statistics.upcomingBookings)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
                  <h3 className="text-stone-600 text-sm font-semibold mb-2">{t("occupancyRate")}</h3>
                  <p className="text-3xl font-bold text-stone-800">{formatNumber(statistics.occupancyRate)}%</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
                  <h3 className="text-stone-600 text-sm font-semibold mb-2">{t("totalRevenue")}</h3>
                  <div className="space-y-1">
                    {Object.entries(statistics.revenueByCurrency).map(([currency, amount]) => (
                      <p key={currency} className="text-lg font-bold text-stone-800">
                        {formatCurrency(amount, currency)}
                      </p>
                    ))}
                    {Object.keys(statistics.revenueByCurrency).length === 0 && (
                      <p className="text-lg font-bold text-stone-400">-</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          <div>
            <div className={`flex items-center justify-between mb-6 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <h2 className={`text-3xl font-bold text-stone-800 ${language === "ar" ? "font-cairo" : "font-playfair"}`}>
                {t("allBookings")}
              </h2>
              
              {/* Search Input */}
              <div className="w-full md:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className={`w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-stone-600">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-stone-600">{t("noBookings")}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-stone-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-100">
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("bookingId")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("guestName")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("roomNumber")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("roomType")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("startDate")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("endDate")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("totalPrice")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("paymentMethod")}
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                          {t("bookingDate")}
                        </th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold text-stone-700`}>
                          {t("delete")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-stone-50">
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {formatNumber(booking.id)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {booking.guestName || "-"}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {booking.room.roomNumber}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {t(booking.room.roomType.typeKey as keyof typeof import("@/lib/translations").translations.ar)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {formatDate(booking.startDate)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {formatDate(booking.endDate)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {formatCurrency(booking.totalPrice, booking.currency)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {formatPaymentMethod(booking.paymentMethod)}
                          </td>
                          <td className={`px-6 py-4 text-sm text-stone-700 ${language === "ar" ? "text-right" : "text-left"}`}>
                            {formatDate(booking.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {deleteConfirmId === booking.id ? (
                              <div className={`flex flex-col gap-2 items-center ${language === "ar" ? "text-right" : "text-left"}`}>
                                <p className="text-xs text-stone-600 mb-1">{t("confirmDeleteMessage")}</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDelete(booking.id)}
                                    disabled={isDeleting}
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                  >
                                    {t("yes")}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    disabled={isDeleting}
                                    className="px-3 py-1 bg-stone-300 text-stone-700 text-xs rounded hover:bg-stone-400 transition-colors disabled:opacity-50"
                                  >
                                    {t("no")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(booking.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                              >
                                {t("delete")}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
