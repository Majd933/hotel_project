"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "SYP" | "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    // Load currency from localStorage
    const savedCurrency = localStorage.getItem("currency") as Currency;
    if (savedCurrency && (savedCurrency === "USD" || savedCurrency === "EUR" || savedCurrency === "SYP")) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
