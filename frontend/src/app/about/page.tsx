"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">About KOLAQ ALAGBO BITTERS</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-lg text-slate-600">
          KOLAQ ALAGBO BITTERS INTERNATIONAL is a premium herbal wellness brand dedicated to 
          bringing the finest traditional African herbal blends to health-conscious consumers worldwide.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Our Story</h2>
        <p className="text-slate-600">
          Founded with a passion for natural wellness, KOLAQ ALAGBO BITTERS combines centuries-old 
          herbal knowledge with modern quality standards. Our products are carefully crafted using 
          select herbs and botanicals sourced from trusted suppliers.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Our Mission</h2>
        <p className="text-slate-600">
          To promote holistic health and wellness through premium herbal products that honor 
          traditional formulations while meeting the highest quality standards for today&apos;s 
          health-conscious consumers.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Quality Commitment</h2>
        <p className="text-slate-600">
          Every bottle of KOLAQ ALAGBO BITTERS is produced in certified facilities with strict 
          quality control measures. We are committed to transparency, purity, and delivering 
          products that our customers can trust.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Contact Us</h2>
        <p className="text-slate-600">
          Have questions? Reach out to our customer support team at{" "}
          <a href="mailto:support@kolaqalagbo.org" className="text-amber-600 hover:underline">
            support@kolaqalagbo.org
          </a>
        </p>
      </div>
    </div>
  );
}
