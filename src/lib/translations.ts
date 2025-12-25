export type Language = "ar" | "en";

export const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    properties: "الغرف",
    booking: "الحجز",
    about: "من نحن",
    contact: "اتصل بنا",
    hotelName: "فندق الشيراتون",
    
    // Home Page
    welcomeTitle: "حيث تلتقي الأناقة بالتراث الأصيل",
    welcomeSubtitle: "استمتع بإقامة فاخرة وخدمة استثنائية",
    exploreRooms: "استكشف الغرف",
    bookNow: "احجز الآن",
    ourFeatures: "مميزاتنا",
    luxuryRooms: "غرف فاخرة",
    luxuryRoomsDesc: "غرف مريحة ومجهزة بأحدث التجهيزات",
    fineRestaurant: "مطعم راقي",
    fineRestaurantDesc: "أطباق شهية من أفضل المطابخ العالمية",
    entertainmentFacilities: "مرافق ترفيهية",
    entertainmentFacilitiesDesc: "حمام سباحة وصالة ألعاب وسبا",
    bookYourStay: "احجز إقامتك الآن",
    bookYourStayDesc: "استمتع بعروض خاصة وخدمة استثنائية",
    startBooking: "ابدأ الحجز",
    
    // Footer
    footerDescription: "استمتع بإقامة فاخرة وخدمة استثنائية في قلب المدينة",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات الاتصال",
    followUs: "تابعنا",
    address: "العنوان، المدينة",
    allRightsReserved: "جميع الحقوق محفوظة",
    
    // Booking Page
    selectDates: "اختر التواريخ",
    room: "غرفة",
    rooms: "غرف",
    adult: "بالغ",
    adults: "بالغين",
    exploreOptions: "استكشف الخيارات",
    localCurrency: "العملة المحلية",
    available: "متاح",
    selectedDates: "التواريخ المحددة",
    restrictionsApply: "توجد قيود",
    soldOut: "محجوز",
    soldOutMessage: "هل تواريخك مرنة؟",
    close: "إغلاق",
  },
  en: {
    // Navigation
    home: "Home",
    properties: "Rooms",
    booking: "Booking",
    about: "About",
    contact: "Contact",
    hotelName: "Sheraton Hotel",
    
    // Home Page
    welcomeTitle: "Where Elegance Meets Authentic Heritage",
    welcomeSubtitle: "Unlimited Luxury, Unmatched Comfort",
    exploreRooms: "Explore Rooms",
    bookNow: "Book Now",
    ourFeatures: "Our Features",
    luxuryRooms: "Luxury Rooms",
    luxuryRoomsDesc: "Comfortable rooms equipped with the latest amenities",
    fineRestaurant: "Fine Restaurant",
    fineRestaurantDesc: "Delicious dishes from the world's best cuisines",
    entertainmentFacilities: "Entertainment Facilities",
    entertainmentFacilitiesDesc: "Swimming pool, gym, and spa",
    bookYourStay: "Book Your Stay Now",
    bookYourStayDesc: "Enjoy special offers and exceptional service",
    startBooking: "Start Booking",
    
    // Footer
    footerDescription: "Enjoy a luxurious stay and exceptional service in the heart of the city",
    quickLinks: "Quick Links",
    contactInfo: "Contact Info",
    followUs: "Follow Us",
    address: "Address, City",
    allRightsReserved: "All rights reserved",
    
    // Booking Page
    selectDates: "Select dates",
    room: "Room",
    rooms: "Rooms",
    adult: "Adult",
    adults: "Adults",
    exploreOptions: "EXPLORE OPTIONS",
    localCurrency: "Local currency",
    available: "AVAILABLE",
    selectedDates: "SELECTED DATES",
    restrictionsApply: "RESTRICTIONS APPLY",
    soldOut: "SOLD OUT",
    soldOutMessage: "ARE YOUR DATES FLEXIBLE?",
    close: "Close",
  },
};

export const getTranslation = (lang: Language, key: keyof typeof translations.ar) => {
  return translations[lang][key];
};

