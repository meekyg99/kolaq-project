"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

import type { Currency } from "@/data/products";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/currency";
import { CurrencyToggle } from "@/components/ui/currency-toggle";

const shippingRates: Record<Currency, number> = {
  NGN: 4500,
  USD: 18,
};

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price[currency] * item.quantity, 0);
    const shipping = items.length > 0 ? shippingRates[currency] : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items, currency]);

  if (items.length === 0 && !completed) {
    return (
      <div className="container flex flex-col items-center gap-5 py-16 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Your cart is waiting</h1>
        <p className="max-w-md text-sm text-slate-600">
          Add KOLAQ ALAGBO BITTERS signatures to the cart to start the checkout experience.
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);
      clearCart();
    }, 1400);
  };

  if (completed) {
    return (
      <div className="container flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-[var(--accent)]" />
        <h1 className="text-3xl font-semibold text-slate-900">Order placed successfully</h1>
        <p className="max-w-md text-sm text-slate-600">
          Our concierge team will reach out within the next business day to confirm delivery timelines and payment preferences.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-7">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Checkout</h1>
            <p className="text-sm text-slate-600">
              Securely confirm your order and choose your preferred payment channel.
            </p>
          </div>
          <CurrencyToggle onChange={(value) => setCurrency(value)} defaultCurrency={currency} />
        </header>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Contact information</h2>
            <div className="mt-3 grid gap-3.5 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                First name
                <input
                  required
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Last name
                <input
                  required
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600 md:col-span-2">
                Email address
                <input
                  required
                  type="email"
                  defaultValue="kolaqalagbo53@gmail.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Phone number
                <input
                  required
                  type="tel"
                  defaultValue="+2348157065742"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Company / venue (optional)
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Delivery details</h2>
            <div className="mt-3 grid gap-3.5 md:grid-cols-2">
              <label className="text-sm text-slate-600 md:col-span-2">
                Address line
                <input
                  required
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                City
                <input
                  required
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                State / Region
                <input
                  required
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Postal code
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Country
                <input
                  required
                  type="text"
                  defaultValue="Nigeria"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Payment preferences</h2>
            <p className="mt-2 text-sm text-slate-600">
              Select a settlement channel. Paystack activates instantly for ₦. Stripe invoices ship within 24 hours for USD orders.
            </p>
            <div className="mt-3 grid gap-3.5 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                <input type="radio" name="payment" defaultChecked />
                <div>
                  <p className="font-semibold text-slate-900">Paystack (₦)</p>
                  <p className="text-xs text-slate-500">Instant checkout for cards, bank transfer, and USSD.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                <input type="radio" name="payment" />
                <div>
                  <p className="font-semibold text-slate-900">Stripe (USD)</p>
                  <p className="text-xs text-slate-500">Hosted checkout link delivered by concierge team.</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-600"
          >
            <CreditCard size={16} /> {isSubmitting ? "Processing..." : "Place Order"}
          </button>
          <p className="text-xs text-slate-500">
            Orders are fulfilled once payments are confirmed. Our logistics partner will coordinate temperature-controlled delivery where applicable.
          </p>
        </form>
      </section>

      <aside className="space-y-5 rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[var(--accent)]" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
            <p className="text-xs text-slate-500">Secure checkout with concierge verification.</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center justify-between text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">Qty {quantity}</p>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatCurrency(product.price[currency] * quantity, currency)}
              </div>
            </div>
          ))}
        </div>

        <dl className="space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold text-slate-900">{formatCurrency(totals.subtotal, currency)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Shipping</dt>
            <dd className="font-semibold text-slate-900">{formatCurrency(totals.shipping, currency)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
            <dt>Total</dt>
            <dd>{formatCurrency(totals.total, currency)}</dd>
          </div>
        </dl>
        <p className="text-xs text-slate-500">
          Need assistance? Email <a href="mailto:kolaqalagbo53@gmail.com" className="underline">kolaqalagbo53@gmail.com</a> or call <a href="tel:+2348157065742" className="underline">+234 815 706 5742</a>, <a href="tel:+2349027342185" className="underline">+234 902 734 2185</a>, or <a href="tel:+2347038580268" className="underline">+234 703 858 0268</a>.
        </p>
      </aside>
    </div>
  );
}
