"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ShoppingCart, Zap } from "lucide-react";
import type { Product, ProductVariant } from "@/data/products";
import { useCartStore } from "@/lib/store/cartStore";

interface AddToCartButtonsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function AddToCartButtons({ product, selectedVariant }: AddToCartButtonsProps) {
  const router = useRouter();
  const { addToCart, isLoading } = useCartStore();
  const [adding, setAdding] = useState(false);

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : product.stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMsg = error?.message || 'Failed to add item to cart';
      toast.error(errorMsg);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      router.push("/cart");
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMsg = error?.message || 'Failed to add item to cart';
      toast.error(errorMsg);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <motion.button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || adding || isLoading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[var(--accent-green)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-[var(--accent-green)]/25 transition-all hover:bg-[var(--accent-green-hover)] hover:shadow-[var(--accent-green)]/40 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed ripple"
      >
        {adding || isLoading ? (
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
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </motion.button>
      <motion.button
        type="button"
        onClick={handleBuyNow}
        disabled={isOutOfStock || adding || isLoading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border-2 border-slate-200 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 transition-all hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] hover:bg-[var(--accent-green)]/5 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {adding || isLoading ? (
          'Adding...'
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Buy Now
          </>
        )}
      </motion.button>
    </div>
  );
}
