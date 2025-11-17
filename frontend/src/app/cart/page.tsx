"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";

import type { Currency } from "@/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/components/providers/currency-provider";

const shippingRates: Record<Currency, number> = {
  NGN: 4500,
  USD: 18,
};

export default function CartPage() {
  const { cart, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { currency } = useCurrency();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];

  const subtotal = cart?.subtotal || 0;
  const shipping = items.length > 0 ? shippingRates[currency] : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="container flex flex-col items-center gap-5 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <p className="text-sm text-slate-600">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-5 py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Your cart is empty</h1>
        <p className="max-w-md text-sm text-slate-600">
          Explore the collection and add KOLAQ ALAGBO BITTERS signatures to continue to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container grid gap-10 py-10 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-slate-900">Cart</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                  <Image src={item.product.images?.[0] || '/placeholder.jpg'} alt={item.product.name} fill className="object-contain" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-lg font-semibold text-slate-900">{item.product.name}</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">SKU {item.product.sku}</p>
                  <p className="text-sm text-slate-600">{item.product.description}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-5 sm:flex-col sm:items-end">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 disabled:opacity-50"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 disabled:opacity-50"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right text-sm font-semibold text-slate-900">
                  {formatCurrency(item.itemTotal, item.currency as Currency)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-5 rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
        <dl className="space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold text-slate-900">{formatCurrency(subtotal, currency)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Shipping</dt>
            <dd className="font-semibold text-slate-900">{formatCurrency(shipping, currency)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
            <dt>Total</dt>
            <dd>{formatCurrency(total, currency)}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
        >
          Proceed to Checkout
        </Link>
        <p className="text-xs text-slate-500">
          Paystack handles local ₦ collections while international card payments are routed through Stripe. Taxes and duties are calculated offline.
        </p>
      </aside>
    </div>
  );
}
