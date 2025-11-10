"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Currency } from "@/data/products";

interface CurrencyToggleProps {
  onChange?: (currency: Currency) => void;
  defaultCurrency?: Currency;
}

const options: Currency[] = ["NGN", "USD"];

export function CurrencyToggle({ onChange, defaultCurrency = "NGN" }: CurrencyToggleProps) {
  const [value, setValue] = useState<Currency>(defaultCurrency);

  const handleSelect = (currency: Currency) => {
    setValue(currency);
    onChange?.(currency);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-semibold text-slate-600">
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            className={cn(
              "relative rounded-full px-4 py-1 transition",
              isActive && "bg-white text-slate-900 shadow"
            )}
            onClick={() => handleSelect(option)}
            type="button"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
