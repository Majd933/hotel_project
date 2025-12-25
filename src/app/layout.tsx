import type { Metadata } from "next";
import { Playfair_Display, Cairo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

// للعناوين - Headlines
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// للنصوص العربية
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// للنصوص الإنجليزية
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "فندق - Hotel Project",
  description: "استمتع بإقامة فاخرة وخدمة استثنائية في فندقنا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${playfairDisplay.variable} ${cairo.variable} ${ibmPlexSans.variable} antialiased flex flex-col min-h-screen`}
      >
        <LanguageProvider>
          <ConditionalHeader />
          <div className="flex-grow relative" style={{ marginTop: 0, paddingTop: 0 }}>
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
