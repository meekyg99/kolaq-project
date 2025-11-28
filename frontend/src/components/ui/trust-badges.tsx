"use client";

import { ShieldCheck, Truck, CreditCard, Lock, RefreshCw, Headphones } from "lucide-react";
import Image from "next/image";

const trustBadges = [
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "256-bit SSL encryption",
  },
  {
    icon: ShieldCheck,
    title: "Verified Business",
    description: "Licensed & registered",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "2-5 business days",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

const paymentMethods = [
  { name: "Visa", src: "/images/visa-card.svg" },
  { name: "Mastercard", src: "/images/mastercard-card.svg" },
  { name: "Verve", src: "/images/verve-card.svg" },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      {trustBadges.map((badge) => (
        <div
          key={badge.title}
          className="flex items-center gap-2 text-sm text-slate-600"
        >
          <badge.icon className="h-5 w-5 text-[var(--accent-green)]" />
          <div>
            <p className="font-medium text-slate-900">{badge.title}</p>
            <p className="text-xs text-slate-500">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrustBadgesCompact() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
      <div className="flex items-center gap-1.5">
        <Lock className="h-4 w-4 text-[var(--accent-green)]" />
        <span>SSL Secure</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-[var(--accent-green)]" />
        <span>Verified</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Truck className="h-4 w-4 text-[var(--accent-green)]" />
        <span>Fast Delivery</span>
      </div>
    </div>
  );
}

export function PaymentMethodsBadge() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs uppercase tracking-widest text-slate-400">
        Secure payment with
      </p>
      <div className="flex items-center gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex h-8 w-12 items-center justify-center rounded border border-slate-200 bg-white p-1"
          >
            <Image
              src={method.src}
              alt={method.name}
              width={32}
              height={20}
              className="h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CheckoutTrustSection() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <TrustBadgesCompact />
      <div className="border-t border-slate-100 pt-4">
        <PaymentMethodsBadge />
      </div>
    </div>
  );
}

export function FooterTrustBadges() {
  return (
    <div className="border-t border-slate-200 py-6">
      <div className="container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <TrustBadgesCompact />
          <PaymentMethodsBadge />
        </div>
      </div>
    </div>
  );
}
