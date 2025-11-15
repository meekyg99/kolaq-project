import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MessageCircle } from "lucide-react";

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
      { label: "Shipping", href: "/shipping" },
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
            <a href="mailto:kolaqalagbo53@gmail.com" className="flex items-center gap-2 hover:text-slate-900">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Mail size={14} />
              </span>
              kolaqalagbo53@gmail.com
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
            <form className="mt-2 flex w-full max-w-sm items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-2 py-1">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Mail size={16} />
            </span>
            <input
              type="email"
              required
              placeholder="Email address"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
            >
              Join
            </button>
          </form>
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
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KOLAQ ALAGBO BITTERS. All rights reserved.
      </div>
      <a
        href="https://wa.me/2349027342185"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with KOLAQ ALAGBO BITTERS on WhatsApp"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[var(--brand-whatsapp)] px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-[#16a34a]"
      >
        <MessageCircle size={18} className="text-white" />
        Chat with us
      </a>
    </footer>
  );
}
