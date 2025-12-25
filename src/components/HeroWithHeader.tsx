"use client";

import Image from "next/image";
import Header from "./Header";

export default function HeroWithHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen min-h-[600px] md:h-screen overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 top-0">
        <Image
          src="/images/home.jpg"
          alt="Luxury resort pool"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Header - Overlay on top of image */}
      <div className="relative z-50">
        <Header />
      </div>
      
      {/* Hero Content - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

