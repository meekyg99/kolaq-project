"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Currency } from "@/data/products";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "kolaq-preferred-currency";

function isCurrency(value: unknown): value is Currency {
  return value === "NGN" || value === "USD";
}

export function CurrencyProvider({
  children,
  defaultCurrency = "NGN",
}: {
  children: React.ReactNode;
  defaultCurrency?: Currency;
}) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") {
      return defaultCurrency;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isCurrency(stored) ? stored : defaultCurrency;
  });

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
