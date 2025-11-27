"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";

import type { Currency } from "@/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/components/providers/currency-provider";
import { ordersApi } from "@/lib/api/orders";
import { getSessionId } from "@/lib/api/cart";

const shippingRates: Record<Currency, number> = {
  NGN: 4500,
  USD: 18,
};

export default function CheckoutPage() {
  const { cart, isLoading, fetchCart, clearCart } = useCartStore();
  const { currency } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
    const shipping = items.length > 0 ? shippingRates[currency] : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items, currency]);

  if (isLoading && !completed) {
    return (
      <div className="container flex flex-col items-center gap-5 py-16 text-center">
        <p className="text-sm text-slate-600">Loading your cart...</p>
      </div>
    );
  }

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    
    try {
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const company = formData.get("company") as string || "";
      const address = formData.get("address") as string;
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      const postalCode = formData.get("postalCode") as string || "";
      const country = formData.get("country") as string;
      const paymentMethod = formData.get("payment") as string;

      const shippingAddress = `${address}, ${city}, ${state}${postalCode ? ', ' + postalCode : ''}, ${country}`;

      const sessionId = getSessionId();

      const order = await ordersApi.create({
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        customerPhone: phone,
        shippingAddress,
        currency,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        notes: company ? `Company: ${company} | Payment: ${paymentMethod}` : `Payment: ${paymentMethod}`,
        sessionId,
      });

      setOrderNumber(order.orderNumber);
      setCompleted(true);
      clearCart();
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setError(err.response?.data?.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="container flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-[var(--accent)]" />
        <h1 className="text-3xl font-semibold text-slate-900">Order placed successfully</h1>
        <p className="max-w-md text-sm text-slate-600">
          Your order number is <span className="font-semibold text-slate-900">{orderNumber}</span>. Our concierge team will reach out within the next business day to confirm delivery timelines and payment preferences.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/orders/${orderNumber}`}
            className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
          >
            View Order
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Continue Shopping
          </Link>
        </div>
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
        </header>

        <form onSubmit={handleSubmit} className="space-y-7">
          {error && (
            <div className="flex items-center gap-3 rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          
          <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Contact information</h2>
            <div className="mt-3 grid gap-3.5 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                First name
                <input
                  required
                  name="firstName"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Last name
                <input
                  required
                  name="lastName"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600 md:col-span-2">
                Email address
                <input
                  required
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Phone number
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="+234"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Company / venue (optional)
                <input
                  name="company"
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
                  name="address"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                City
                <input
                  required
                  name="city"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                State / Region
                <input
                  required
                  name="state"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Postal code
                <input
                  name="postalCode"
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Country
                <input
                  required
                  name="country"
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
                <input type="radio" name="payment" value="Paystack" defaultChecked />
                <div>
                  <p className="font-semibold text-slate-900">Paystack (₦)</p>
                  <p className="text-xs text-slate-500">Instant checkout for cards, bank transfer, and USSD.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                <input type="radio" name="payment" value="Stripe" />
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
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">{item.product.name}</p>
                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatCurrency(item.itemTotal || 0, item.currency as Currency)}
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
          Need assistance? Email <a href="mailto:support@kolaqalagbo.org" className="underline">support@kolaqalagbo.org</a> or call <a href="tel:+2348157065742" className="underline">+234 815 706 5742</a>, <a href="tel:+2349027342185" className="underline">+234 902 734 2185</a>, or <a href="tel:+2347038580268" className="underline">+234 703 858 0268</a>.
        </p>
      </aside>
    </div>
  );
}
