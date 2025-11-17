"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import type { Currency } from "@/data/products";

interface ProductCardProps {
  product: Product;
  currency: Currency;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const isDynamicImage = product.image.startsWith("http") || product.image.startsWith("data:");

  // Calculate price range if variants exist
  const getPriceDisplay = () => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .filter(v => v.isActive)
        .map(v => currency === 'NGN' ? v.priceNGN : v.priceUSD);
      
      if (prices.length === 0) return formatCurrency(product.price[currency], currency);
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return formatCurrency(minPrice, currency);
      }
      
      return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`;
    }
    
    return formatCurrency(product.price[currency], currency);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.article
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm cursor-pointer"
      >
        <div className="relative mb-5 flex h-72 items-center justify-center overflow-hidden rounded-[20px] bg-slate-100">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent"
            animate={{ opacity: [0.4, 0.15, 0.4] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
          <Image
            src={product.image}
            alt={product.name}
            width={280}
            height={280}
            className="h-auto w-48 max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)]"
            unoptimized={isDynamicImage}
          />
        </div>
        <div className="flex-1 space-y-2.5">
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <span className="text-lg font-semibold text-slate-900">
            {getPriceDisplay()}
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
