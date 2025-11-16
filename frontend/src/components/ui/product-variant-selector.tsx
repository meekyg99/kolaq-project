'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductVariant } from '@/data/products';
import type { Currency } from '@/data/products';
import { formatCurrency } from '@/lib/currency';
import { Check } from 'lucide-react';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  currency: Currency;
  onVariantChange: (variant: ProductVariant) => void;
  selectedVariant?: ProductVariant;
}

export function ProductVariantSelector({
  variants,
  currency,
  onVariantChange,
  selectedVariant,
}: ProductVariantSelectorProps) {
  const [selected, setSelected] = useState<ProductVariant>(
    selectedVariant || variants[0]
  );

  const activeVariants = variants
    .filter((v) => v.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSelect = (variant: ProductVariant) => {
    setSelected(variant);
    onVariantChange(variant);
  };

  if (activeVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">
        Select Size
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {activeVariants.map((variant) => {
          const isSelected = selected.id === variant.id;
          const price = currency === 'NGN' ? variant.priceNGN : variant.priceUSD;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && handleSelect(variant)}
              disabled={isOutOfStock}
              className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                isSelected
                  ? 'border-[var(--accent)] bg-green-50'
                  : isOutOfStock
                  ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {variant.image && (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={variant.image}
                    alt={variant.name}
                    fill
                    className="object-contain"
                    unoptimized={variant.image.startsWith('http')}
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {variant.bottleSize}
                    </p>
                    <p className="text-xs text-slate-500">{variant.name}</p>
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatCurrency(price, currency)}
                </p>
                {isOutOfStock && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    Out of Stock
                  </p>
                )}
                {!isOutOfStock && variant.stock < 10 && (
                  <p className="mt-1 text-xs text-amber-600">
                    Only {variant.stock} left
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
