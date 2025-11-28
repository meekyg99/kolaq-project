"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import type { Currency } from "@/data/products";
import { useCartStore } from "@/lib/store/cartStore";

interface ProductCardProps {
  product: Product;
  currency: Currency;
  showAddToCart?: boolean;
  borderless?: boolean;
  hidePrice?: boolean;
  imageFill?: boolean;
}

export function ProductCard({
  product,
  currency,
  showAddToCart = false,
  borderless = false,
  hidePrice = false,
  imageFill = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart, isLoading } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Validate image URL - reject data URLs and non-standard URLs
  const getValidImageUrl = () => {
    if (!product.image || imageError) return "/images/bottle.png";
    if (product.image.startsWith("data:")) return "/images/bottle.png";
    if (product.image.startsWith("http") || product.image.startsWith("/")) {
      return product.image;
    }
    return "/images/bottle.png";
  };

  const imageUrl = getValidImageUrl();
  const isExternalImage = imageUrl.startsWith("http");

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isLoading) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Failed to add to cart from card:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const articleClasses = [
    "group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white cursor-pointer",
    borderless ? "border-0 shadow-none p-0" : "border border-slate-200 p-5 shadow-sm",
  ].join(" ");

  const imageWrapperClasses = [
    "relative flex items-center justify-center overflow-hidden bg-slate-100",
    imageFill ? "h-full" : "h-72 mb-5 rounded-[20px]",
  ].join(" ");

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.article
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={articleClasses}
      >
        <div className={imageWrapperClasses}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent"
            animate={{ opacity: [0.4, 0.15, 0.4] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
          <Image
            src={imageUrl}
            alt={product.name}
            width={320}
            height={320}
            className={
              imageFill
                ? "h-full w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)]"
                : "h-auto w-48 max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)]"
            }
            unoptimized={isExternalImage}
            onError={() => setImageError(true)}
          />
        </div>
        <div className="flex-1 space-y-2.5 p-5 pt-4">
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          {!hidePrice && (
            <span className="text-lg font-semibold text-slate-900">
              {getPriceDisplay()}
            </span>
          )}
          {showAddToCart && (
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-green)] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--accent-green)]/25 transition-all hover:bg-[var(--accent-green-hover)] hover:shadow-[var(--accent-green)]/40 disabled:cursor-not-allowed disabled:opacity-70 ripple"
            >
              {isAdding || isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Adding...
                </motion.span>
              ) : (
                "Add to cart"
              )}
            </motion.button>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
