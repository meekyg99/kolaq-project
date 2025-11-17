"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    } catch (error) {
      console.error('Failed to add to cart:', error);
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
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || adding || isLoading}
        className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {adding || isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isOutOfStock || adding || isLoading}
        className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {adding || isLoading ? 'Adding...' : 'Buy Now'}
      </button>
    </div>
  );
}
