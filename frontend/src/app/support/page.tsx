"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">Customer Support</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
          <p className="text-sm text-slate-600 mb-3">
            Get help via email. We typically respond within 24 hours.
          </p>
          <a
            href="mailto:support@kolaqalagbo.org"
            className="text-sm font-medium text-amber-600 hover:underline"
          >
            support@kolaqalagbo.org
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">WhatsApp</h3>
          <p className="text-sm text-slate-600 mb-3">
            Chat with us directly on WhatsApp for quick assistance.
          </p>
          <a
            href="https://wa.me/message/KOLAQALAGBO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-green-600 hover:underline"
          >
            Start Chat
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
          <p className="text-sm text-slate-600 mb-3">
            Call us during business hours for immediate assistance.
          </p>
          <span className="text-sm text-slate-500">Coming soon</span>
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-medium text-slate-900 mb-2">How long does shipping take?</h3>
            <p className="text-sm text-slate-600">
              Shipping times vary by location. Domestic orders typically arrive within 3-5 business days. 
              International orders may take 7-14 business days depending on the destination.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-medium text-slate-900 mb-2">What is your return policy?</h3>
            <p className="text-sm text-slate-600">
              We accept returns of unopened products within 14 days of delivery. Please contact 
              our support team to initiate a return.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-medium text-slate-900 mb-2">How do I track my order?</h3>
            <p className="text-sm text-slate-600">
              Once your order ships, you&apos;ll receive an email with tracking information. You can 
              also track your order on our{" "}
              <Link href="/track-order" className="text-amber-600 hover:underline">
                order tracking page
              </Link>.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-medium text-slate-900 mb-2">Are your products safe?</h3>
            <p className="text-sm text-slate-600">
              All KOLAQ ALAGBO BITTERS products are made with natural ingredients and manufactured 
              in certified facilities. However, we recommend consulting with a healthcare provider 
              before starting any new supplement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
