"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">1. Acceptance of Terms</h2>
        <p className="text-slate-600">
          By accessing and using the KOLAQ ALAGBO BITTERS website and services, you accept and agree 
          to be bound by the terms and provisions of this agreement.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">2. Products and Services</h2>
        <p className="text-slate-600">
          All products sold through our website are intended for adult use only. By purchasing our 
          products, you confirm that you are of legal age in your jurisdiction. Our herbal bitters 
          are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">3. Orders and Payment</h2>
        <p className="text-slate-600">
          All orders are subject to availability and confirmation of the order price. We reserve the 
          right to refuse any order. Payment must be received prior to shipment of products.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">4. Shipping and Delivery</h2>
        <p className="text-slate-600">
          We ship to select international destinations. Delivery times may vary based on location. 
          Customers are responsible for any customs duties or import taxes that may apply.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">5. Returns and Refunds</h2>
        <p className="text-slate-600">
          Due to the nature of our products, we can only accept returns for unopened, sealed products 
          within 14 days of delivery. Please contact our support team to initiate a return.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">6. Limitation of Liability</h2>
        <p className="text-slate-600">
          KOLAQ ALAGBO BITTERS shall not be liable for any indirect, incidental, special, or 
          consequential damages arising from the use of our products or services.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">7. Contact</h2>
        <p className="text-slate-600">
          For questions about these terms, please contact us at{" "}
          <a href="mailto:support@kolaqalagbo.org" className="text-amber-600 hover:underline">
            support@kolaqalagbo.org
          </a>
        </p>
      </div>
    </div>
  );
}
