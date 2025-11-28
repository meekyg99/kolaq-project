import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Lock, ShieldCheck, Truck } from "lucide-react";
import { NewsletterForm } from "@/components/ui/newsletter-form";

const footerLinks = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Reseller Program", href: "/reseller" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", href: "/support" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping", href: "/shipping" },
      { label: "support@kolaqalagbo.org", href: "mailto:support@kolaqalagbo.org" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export function SiteFooter() {
  const phoneNumbers = [
    { display: "+234 815 706 5742", href: "tel:+2348157065742" },
    { display: "+234 902 734 2185", href: "tel:+2349027342185" },
    { display: "+234 703 858 0268", href: "tel:+2347038580268" },
  ];

  return (
    <footer className="relative border-t border-slate-200 bg-slate-50/95">
      <div className="container grid gap-12 py-16 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
              <Image
                src="/images/logo-kolaq.jpg"
                alt="KOLAQ ALAGBO BITTERS logo"
                width={48}
                height={48}
                className="h-full w-full object-contain p-1"
              />
            </span>
            <span className="text-sm uppercase tracking-[0.4em] text-slate-600">KOLAQ ALAGBO BITTERS</span>
          </div>
          <p className="max-w-sm text-sm text-slate-600">
            Premium herbal infusions crafted from ancient Yoruba recipes and refined for the modern world.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <a href="mailto:support@kolaqalagbo.org" className="flex items-center gap-2 hover:text-slate-900">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Mail size={14} />
              </span>
              support@kolaqalagbo.org
            </a>
            <ul className="space-y-2">
              {phoneNumbers.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className="flex items-center gap-2 hover:text-slate-900">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Phone size={14} />
                    </span>
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
            <NewsletterForm variant="footer" />
        </div>

        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {section.title}
            </span>
            <ul className="space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link className="transition hover:text-slate-900" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} KOLAQ ALAGBO BITTERS. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">We accept:</span>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-12 items-center justify-center rounded bg-white p-1 shadow-sm border border-slate-200">
                <Image src="/images/visa-card.svg" alt="Visa" width={48} height={30} className="h-auto w-full object-contain" />
              </div>
              <div className="flex h-8 w-12 items-center justify-center rounded bg-white p-1 shadow-sm border border-slate-200">
                <Image src="/images/mastercard-card.svg" alt="Mastercard" width={48} height={30} className="h-auto w-full object-contain" />
              </div>
              <div className="flex h-8 w-12 items-center justify-center rounded bg-white p-1 shadow-sm border border-slate-200">
                <Image src="/images/verve-card.svg" alt="Verve" width={48} height={30} className="h-auto w-full object-contain" />
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 md:justify-end">
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
        </div>
      </div>
    </footer>
  );
}
