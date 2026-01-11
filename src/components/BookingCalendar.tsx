"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

interface BookingCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDates?: Date[];
  bookedDates?: Date[]; // Dates that are fully booked (all rooms of all types)
}

export default function BookingCalendar({ onDateSelect, selectedDates = [], bookedDates = [] }: BookingCalendarProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Convert numbers to Arabic-Indic numerals in Arabic
  const formatNumber = (num: number | string): string => {
    if (language === "ar") {
      const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      const numStr = num.toString();
      return numStr.replace(/\d/g, (digit) => arabicIndic[parseInt(digit)]);
    }
    return num.toString();
  };

  // Generate dates for a month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatMonthYear = (date: Date) => {
    const months = language === "ar" 
      ? ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"]
      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${formatNumber(date.getFullYear())}`;
  };

  const weekDays = language === "ar"
    ? ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return selectedDates.some(
      (selected) =>
        selected.getDate() === date.getDate() &&
        selected.getMonth() === date.getMonth() &&
        selected.getFullYear() === date.getFullYear()
    );
  };

  const isInRange = (date: Date | null) => {
    if (!date || selectedDates.length !== 2) return false;
    const [startDate, endDate] = selectedDates;
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const normalizedEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isBooked = (date: Date | null) => {
    if (!date || bookedDates.length === 0) return false;
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return bookedDates.some((bookedDate) => {
      const normalizedBooked = new Date(bookedDate.getFullYear(), bookedDate.getMonth(), bookedDate.getDate());
      return normalizedBooked.getTime() === normalizedDate.getTime();
    });
  };

  const handleDateClick = (date: Date | null) => {
    if (!date || isPastDate(date) || isBooked(date)) return;
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const days1 = getDaysInMonth(currentMonth);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const days2 = getDaysInMonth(nextMonthDate);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* First Month */}
      <div className="w-full lg:w-1/2">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-stone-800">
            {formatMonthYear(currentMonth)}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className={`text-center text-sm font-medium text-stone-600 py-3 ${language === "ar" ? "font-cairo" : ""}`}>
              {day}
            </div>
          ))}
          
          {days1.map((date, index) => {
            const selected = isSelected(date);
            const inRange = isInRange(date);
            const past = isPastDate(date);
            const booked = isBooked(date);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  relative min-h-[60px] p-2 flex flex-col items-center justify-center rounded transition-all border border-transparent
                  ${!date ? "cursor-default invisible" : ""}
                  ${past || booked ? "cursor-not-allowed" : (selected || inRange ? "cursor-pointer" : "")}
                  ${past ? "text-stone-300" : booked ? (selected || inRange ? "bg-gray-900 text-white border-gray-900" : "text-stone-400 bg-stone-100 border-stone-300") : (selected || inRange ? "" : "text-stone-800 bg-stone-100 hover:bg-stone-200")}
                  ${!booked && (selected || inRange) ? "bg-gray-800 font-semibold border-gray-800 group hover:bg-gray-700" : ""}
                `}
                title={booked ? `${t("soldOut")}, ${t("soldOutMessage")}` : undefined}
              >
                {date && (
                  <>
                    <div className={`text-lg font-medium ${
                      booked && !past 
                        ? (selected || inRange ? "text-white" : "text-stone-600")
                        : (selected || inRange ? "text-white" : "")
                    }`}>
                      {formatNumber(date.getDate())}
                    </div>
                    {booked && !past && (
                      <svg 
                        className={`absolute inset-0 w-full h-full pointer-events-none ${selected || inRange ? "text-white opacity-60" : "text-gray-700 opacity-25"}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 100 100"
                        strokeWidth={2.5}
                        preserveAspectRatio="none"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M15 15 L85 85 M85 15 L15 85" 
                        />
                      </svg>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Second Month */}
      <div className="w-full lg:w-1/2">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-stone-800">
            {formatMonthYear(nextMonthDate)}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className={`text-center text-sm font-medium text-stone-600 py-3 ${language === "ar" ? "font-cairo" : ""}`}>
              {day}
            </div>
          ))}
          
          {days2.map((date, index) => {
            const selected = isSelected(date);
            const inRange = isInRange(date);
            const past = isPastDate(date);
            const booked = isBooked(date);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  relative min-h-[60px] p-2 flex flex-col items-center justify-center rounded transition-all border border-transparent
                  ${!date ? "cursor-default invisible" : ""}
                  ${past || booked ? "cursor-not-allowed" : (selected || inRange ? "cursor-pointer" : "")}
                  ${past ? "" : booked ? (selected || inRange ? "bg-gray-800 text-white border-gray-800 group hover:bg-gray-700" : "text-stone-400 bg-stone-100 border-stone-300") : (selected || inRange ? "" : "text-stone-800 bg-stone-100 hover:bg-stone-200")}
                  ${!booked && (selected || inRange) ? "bg-gray-800 text-white font-semibold border-gray-800 group hover:bg-gray-700" : ""}
                `}
                title={booked ? `${t("soldOut")}, ${t("soldOutMessage")}` : undefined}
              >
                {date && (
                  <>
                    <div className={`text-lg font-medium ${
                      booked && !past 
                        ? (selected || inRange ? "text-white" : "text-stone-600")
                        : (selected || inRange ? "text-white" : "")
                    }`}>
                      {formatNumber(date.getDate())}
                    </div>
                    {booked && !past && (
                      <svg 
                        className={`absolute inset-0 w-full h-full pointer-events-none ${selected || inRange ? "text-white opacity-60" : "text-gray-700 opacity-25"}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 100 100"
                        strokeWidth={2.5}
                        preserveAspectRatio="none"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M15 15 L85 85 M85 15 L15 85" 
                        />
                      </svg>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

