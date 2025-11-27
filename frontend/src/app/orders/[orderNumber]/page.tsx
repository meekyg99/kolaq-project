"use client";

import { useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

import { useOrder } from "@/lib/hooks/useOrders";
import { formatCurrency } from "@/lib/currency";
import type { Currency } from "@/data/products";

export default function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumberFromPath = params?.orderNumber;
  const orderNumberFromQuery = searchParams?.get("number") || undefined;
  const orderNumber = orderNumberFromPath || orderNumberFromQuery;

  const { order, isLoading, error } = useOrder(orderNumber || "");

  const totals = useMemo(() => {
    if (!order) return null;
    return {
      subtotal: order.subtotal,
      shipping: order.shippingCost,
      total: order.total,
      currency: order.currency as Currency,
    };
  }, [order]);

  if (!orderNumber) {
    return (
      <div className="container flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-slate-600">No order number provided.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex flex-col items-center gap-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <p className="text-sm text-slate-600">Loading your order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-slate-600">We couldn't find that order. Please check your link.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <header className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-[var(--accent)]" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Order confirmed</h1>
            <p className="text-sm text-slate-600">
              Thank you for choosing KOLAQ ALAGBO BITTERS. Our team will reach out to confirm delivery and payment.
            </p>
          </div>
        </header>

        <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Order details</h2>
          <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Order number</dt>
              <dd className="mt-1 font-semibold text-slate-900">{order.orderNumber}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</dt>
              <dd className="mt-1 capitalize text-slate-900">{order.status.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer</dt>
              <dd className="mt-1 text-slate-900">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-900">{order.customerEmail}</dd>
            </div>
            {order.customerPhone && (
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Phone</dt>
                <dd className="mt-1 text-slate-900">{order.customerPhone}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Shipping address</dt>
              <dd className="mt-1 whitespace-pre-line text-slate-900">{order.shippingAddress}</dd>
            </div>
          </dl>
        </div>

        {order.notes && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Notes</h2>
            <p className="mt-2 text-sm text-slate-700">{order.notes}</p>
          </div>
        )}
      </section>

      <aside className="space-y-5">
        <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Order summary</h2>
          <div className="mt-4 space-y-3.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900">{item.product.name}</p>
                  <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.price * item.quantity, item.currency as Currency)}
                </div>
              </div>
            ))}
          </div>

          {totals && (
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal, totals.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping</span>
                <span>{formatCurrency(totals.shipping, totals.currency)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(totals.total, totals.currency)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-xs text-slate-600">
          <p>
            A confirmation has been sent to <span className="font-semibold">{order.customerEmail}</span>. If you need to
            adjust delivery or payment details, reply to the confirmation email or reach us via WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            View Cart
          </button>
        </div>
      </aside>
    </div>
  );
}
