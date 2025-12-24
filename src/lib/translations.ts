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
    welcomeTitle: "مرحباً بك في فندق الشيراتون",
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
    welcomeTitle: "Welcome to Sheraton Hotel",
    welcomeSubtitle: "Enjoy a luxurious stay and exceptional service",
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
  },
};

export const getTranslation = (lang: Language, key: keyof typeof translations.ar) => {
  return translations[lang][key];
};

