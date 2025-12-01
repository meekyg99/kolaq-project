"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">1. Information We Collect</h2>
        <p className="text-slate-600">
          We collect information you provide directly to us, including your name, email address, 
          shipping address, phone number, and payment information when you make a purchase.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">2. How We Use Your Information</h2>
        <p className="text-slate-600">
          We use the information we collect to process orders, communicate with you about your 
          purchases, send promotional communications (with your consent), and improve our services.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">3. Information Sharing</h2>
        <p className="text-slate-600">
          We do not sell your personal information. We may share your information with service 
          providers who assist us in operating our website, processing payments, and delivering orders.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">4. Data Security</h2>
        <p className="text-slate-600">
          We implement appropriate security measures to protect your personal information. However, 
          no method of transmission over the Internet is 100% secure.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">5. Cookies</h2>
        <p className="text-slate-600">
          We use cookies and similar technologies to enhance your browsing experience, analyze site 
          traffic, and personalize content. You can control cookie preferences through your browser settings.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">6. Your Rights</h2>
        <p className="text-slate-600">
          You have the right to access, correct, or delete your personal information. Contact us 
          to exercise these rights or if you have questions about our privacy practices.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">7. Contact Us</h2>
        <p className="text-slate-600">
          For privacy-related inquiries, please contact us at{" "}
          <a href="mailto:support@kolaqalagbo.org" className="text-amber-600 hover:underline">
            support@kolaqalagbo.org
          </a>
        </p>
      </div>
    </div>
  );
}
