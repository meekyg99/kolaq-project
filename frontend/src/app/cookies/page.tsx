"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900 mb-8"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-6">Cookie Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">What Are Cookies</h2>
        <p className="text-slate-600">
          Cookies are small text files that are placed on your computer or mobile device when you 
          visit a website. They are widely used to make websites work more efficiently and provide 
          information to the website owners.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">How We Use Cookies</h2>
        <p className="text-slate-600">We use cookies for the following purposes:</p>
        <ul className="list-disc list-inside text-slate-600 space-y-2 mt-2">
          <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
          <li><strong>Authentication:</strong> To keep you logged in during your session</li>
          <li><strong>Shopping cart:</strong> To remember items in your cart</li>
          <li><strong>Analytics:</strong> To understand how visitors interact with our website</li>
          <li><strong>Preferences:</strong> To remember your settings and preferences</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Types of Cookies We Use</h2>
        
        <h3 className="text-lg font-medium text-slate-700 mt-6">Strictly Necessary Cookies</h3>
        <p className="text-slate-600">
          These cookies are essential for the website to function. They enable core functionality 
          such as security, network management, and account access.
        </p>

        <h3 className="text-lg font-medium text-slate-700 mt-6">Performance Cookies</h3>
        <p className="text-slate-600">
          These cookies help us understand how visitors interact with our website by collecting 
          and reporting information anonymously.
        </p>

        <h3 className="text-lg font-medium text-slate-700 mt-6">Functionality Cookies</h3>
        <p className="text-slate-600">
          These cookies allow the website to remember choices you make and provide enhanced, 
          personalized features.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Managing Cookies</h2>
        <p className="text-slate-600">
          Most web browsers allow you to control cookies through their settings. You can set your 
          browser to block or alert you about cookies. However, blocking some cookies may impact 
          your experience on our website.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8">Contact Us</h2>
        <p className="text-slate-600">
          If you have questions about our use of cookies, please contact us at{" "}
          <a href="mailto:support@kolaqalagbo.org" className="text-amber-600 hover:underline">
            support@kolaqalagbo.org
          </a>
        </p>
      </div>
    </div>
  );
}
