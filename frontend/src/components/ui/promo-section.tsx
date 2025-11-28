'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tag, Clock, Flame } from 'lucide-react';
import { ProductCard } from '@/components/ui/product-card';
import { useCurrency } from '@/components/providers/currency-provider';
import type { Product } from '@/data/products';

interface PromoProduct extends Product {
  isPromo?: boolean;
  promoPrice?: number;
  promoLabel?: string;
  promoStartDate?: string;
  promoEndDate?: string;
}

interface PromoSectionProps {
  products: Product[];
}

export function PromoSection({ products }: PromoSectionProps) {
  const { currency } = useCurrency();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  // Filter products that are on promo
  const promoProducts = useMemo(() => {
    const now = new Date();
    return (products as PromoProduct[]).filter((product) => {
      if (!product.isPromo) return false;
      
      // Check if promo is within date range
      if (product.promoStartDate && new Date(product.promoStartDate) > now) return false;
      if (product.promoEndDate && new Date(product.promoEndDate) < now) return false;
      
      return true;
    });
  }, [products]);

  // Find the nearest promo end date for countdown
  const nearestEndDate = useMemo(() => {
    const endDates = (promoProducts as PromoProduct[])
      .filter((p) => p.promoEndDate)
      .map((p) => new Date(p.promoEndDate!))
      .sort((a, b) => a.getTime() - b.getTime());
    
    return endDates[0] || null;
  }, [promoProducts]);

  // Countdown timer
  useEffect(() => {
    if (!nearestEndDate) {
      setTimeRemaining(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = nearestEndDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nearestEndDate]);

  if (promoProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/40 rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Special Offers</h2>
              <p className="text-sm text-slate-600">Limited time deals on select products</p>
            </div>
          </div>
          
          {timeRemaining && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-300">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">
                Ends in: {timeRemaining}
              </span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {promoProducts.map((product) => (
            <div key={product.id} className="relative">
              {/* Promo Badge */}
              {(product as PromoProduct).promoLabel && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                  <Tag className="w-3 h-3" />
                  {(product as PromoProduct).promoLabel}
                </div>
              )}
              <ProductCard product={product} currency={currency} showAddToCart />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
