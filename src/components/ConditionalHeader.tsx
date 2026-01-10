"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide Header on home page (it's inside HeroWithHeader)
  if (pathname === "/home" || pathname === "/") {
    return null;
  }
  
  // On booking pages: show header with dark text and hide book button
  if (pathname === "/booking" || pathname.startsWith("/booking/")) {
    return <Header hideBookButton={true} forceDarkText={true} />;
  }
  
  return <Header />;
}

