"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const ADMIN_PASSWORD = "admin";

export default function AdminPage() {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already authenticated (from sessionStorage)
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setError("");
      setPassword("");
    } else {
      setError(language === "ar" ? "كلمة المرور غير صحيحة" : "Incorrect password");
      setPassword("");
    }
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
        <div className={`max-w-4xl mx-auto ${language === "ar" ? "text-right font-cairo" : "text-left"}`}>
          <div className="space-y-6">
            <p className="text-lg text-stone-700 leading-relaxed">
              {language === "ar" 
                ? "هذه هي صفحة الإدارة. يمكنك إضافة الخيارات التي تحتاجها هنا." 
                : "This is the admin panel. You can add your options here."}
            </p>
            
            {/* أضف خياراتك هنا */}
            <div className="mt-8 space-y-4">
              {/* مثال: */}
              <div className={`p-6 border border-stone-200 rounded-lg bg-white ${language === "ar" ? "text-right" : "text-left"}`}>
                <h2 className="text-xl font-semibold text-stone-800 mb-2">
                  {language === "ar" ? "إعدادات" : "Settings"}
                </h2>
                <p className="text-stone-600">
                  {language === "ar" ? "إضافة الخيارات هنا..." : "Add options here..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
