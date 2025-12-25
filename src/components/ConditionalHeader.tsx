"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide Header on home page (it's inside HeroWithHeader) and booking page (has its own header)
  if (pathname === "/home" || pathname === "/" || pathname === "/booking") {
    return null;
  }
  
  return <Header />;
}

