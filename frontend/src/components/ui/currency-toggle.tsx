"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Currency } from "@/data/products";
import { useCurrency } from "@/components/providers/currency-provider";

interface CurrencyToggleProps {
  onChange?: (currency: Currency) => void;
  className?: string;
}

const options: Currency[] = ["NGN", "USD"];

const currencyMeta: Record<Currency, { flag: string; alt: string }> = {
  NGN: { flag: "/images/flags/ng.svg", alt: "Nigeria" },
  USD: { flag: "/images/flags/us.svg", alt: "United States" },
};

export function CurrencyToggle({ onChange, className }: CurrencyToggleProps) {
  const { currency, setCurrency } = useCurrency();

  const handleSelect = (next: Currency) => {
    if (next === currency) return;
    setCurrency(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-semibold text-slate-600",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option === currency;
        const meta = currencyMeta[option];
        return (
          <button
            key={option}
            className={cn(
              "group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition",
              isActive ? "bg-white text-slate-900 shadow" : "hover:bg-white/70"
            )}
            onClick={() => handleSelect(option)}
            type="button"
            aria-pressed={isActive}
          >
            <span className="relative inline-flex h-4 w-4 overflow-hidden rounded-full border border-slate-200 bg-white">
              <Image src={meta.flag} alt={`${meta.alt} flag`} width={16} height={16} />
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}
