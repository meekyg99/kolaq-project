"use client";

import Link from "next/link";
import { ArrowLeft, Truck, Globe, Package, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">Shipping Information</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Truck className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Domestic Shipping</h3>
          <p className="text-sm text-slate-600">
            Orders within the country are processed within 1-2 business days and typically arrive 
            within 3-5 business days.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">International Shipping</h3>
          <p className="text-sm text-slate-600">
            We ship to select international destinations. Delivery times range from 7-14 business 
            days depending on your location.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Order Tracking</h3>
          <p className="text-sm text-slate-600">
            Track your order status in real-time. You&apos;ll receive tracking information via email 
            once your order ships.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Processing Time</h3>
          <p className="text-sm text-slate-600">
            Orders placed before 2 PM are typically processed the same business day. Weekend orders 
            are processed on Monday.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Shipping Rates</h2>
        <p className="text-slate-600">
          Shipping rates are calculated at checkout based on your location and order size. 
          We offer free shipping on orders over a certain amount - check our current promotions!
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">International Orders</h2>
        <p className="text-slate-600">
          For international orders, please note:
        </p>
        <ul className="list-disc list-inside text-slate-600 space-y-2 mt-2">
          <li>Customs duties and import taxes may apply and are the responsibility of the recipient</li>
          <li>Some products may have shipping restrictions to certain countries</li>
          <li>Delivery times may be affected by customs processing</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Delivery Issues</h2>
        <p className="text-slate-600">
          If you experience any issues with your delivery, please contact our{" "}
          <Link href="/support" className="text-amber-600 hover:underline">
            customer support team
          </Link>{" "}
          within 48 hours of the expected delivery date.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Track Your Order</h2>
        <p className="text-slate-600">
          Ready to check on your order?{" "}
          <Link href="/track-order" className="text-amber-600 hover:underline">
            Track your order here
          </Link>
        </p>
      </div>
    </div>
  );
}
