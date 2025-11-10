"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { useCart } from "@/components/providers/cart-provider";

interface AddToCartButtonsProps {
  product: Product;
}

export function AddToCartButtons({ product }: AddToCartButtonsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-500"
      >
        Add to Cart
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        Buy Now
      </button>
    </div>
  );
}
