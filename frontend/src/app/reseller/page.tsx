"use client";

import Link from "next/link";
import { ArrowLeft, Users, TrendingUp, Package, Award } from "lucide-react";

export default function ResellerPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Become a Reseller</h1>
      <p className="text-lg text-slate-600 mb-8">
        Partner with KOLAQ ALAGBO BITTERS and grow your business with premium herbal products.
      </p>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <TrendingUp className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Competitive Margins</h3>
          <p className="text-sm text-slate-600">
            Enjoy wholesale pricing with attractive profit margins on all KOLAQ ALAGBO BITTERS products.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Dropshipping Available</h3>
          <p className="text-sm text-slate-600">
            We offer dropshipping services so you can sell without holding inventory.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Marketing Support</h3>
          <p className="text-sm text-slate-600">
            Access marketing materials, product images, and promotional content to boost your sales.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Premium Products</h3>
          <p className="text-sm text-slate-600">
            Sell trusted, high-quality herbal products with a growing customer base.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">How to Get Started</h2>
        <ol className="list-decimal list-inside text-slate-600 space-y-3">
          <li>
            <strong>Apply:</strong> Fill out our reseller application form below
          </li>
          <li>
            <strong>Verification:</strong> Our team will review your application within 48 hours
          </li>
          <li>
            <strong>Onboarding:</strong> Once approved, you&apos;ll receive access to wholesale pricing
          </li>
          <li>
            <strong>Start Selling:</strong> Place your first order and start growing your business
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Requirements</h2>
        <ul className="list-disc list-inside text-slate-600 space-y-2">
          <li>Valid business registration (preferred but not required)</li>
          <li>Commitment to representing the KOLAQ ALAGBO BITTERS brand professionally</li>
          <li>Minimum initial order quantity may apply</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Ready to Partner?</h2>
        <p className="text-slate-600">
          Contact us to learn more about our reseller program:{" "}
          <a href="mailto:partners@kolaqalagbo.org" className="text-amber-600 hover:underline">
            partners@kolaqalagbo.org
          </a>
        </p>

        <div className="mt-8">
          <a
            href="mailto:partners@kolaqalagbo.org?subject=Reseller Application"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
