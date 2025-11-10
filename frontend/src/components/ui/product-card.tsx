"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import type { Currency } from "@/data/products";
import { useCart } from "@/components/providers/cart-provider";

interface ProductCardProps {
  product: Product;
  currency: Currency;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, 1);
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="relative mb-6 flex h-60 items-center justify-center overflow-hidden rounded-[20px] bg-slate-100">
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
          className="h-auto w-40 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]"
        />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
          <span>{product.sku}</span>
          {product.isFeatured && <span className="text-[var(--accent)]">Signature</span>}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
        <ul className="flex flex-wrap gap-2 text-xs text-slate-500">
          {product.tastingNotes.map((note) => (
            <li key={note} className="rounded-full border border-slate-200 px-3 py-1 bg-slate-50">
              {note}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">
            {formatCurrency(product.price[currency], currency)}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            View
            <svg
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M4 12L12 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.3335 4H12.0002V10.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-500"
        >
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
