"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

export default function Footer() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import("@/lib/translations").translations.ar) =>
    getTranslation(language, key);

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">🏨 {t("hotelName")}</h3>
            <p className="text-gray-400">
              {t("footerDescription")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("properties")}
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("booking")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("contactInfo")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +123 456 7890</li>
              <li>📧 info@hotel.com</li>
              <li>📍 {t("address")}</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("followUs")}</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t("hotelName")}. {t("allRightsReserved")}.</p>
        </div>
      </div>
    </footer>
  );
}

