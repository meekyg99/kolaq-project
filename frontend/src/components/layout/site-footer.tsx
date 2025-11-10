import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const footerLinks = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Sourcing", href: "/story" },
      { label: "Reseller Program", href: "/reseller" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", href: "/support" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
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
  return (
    <footer className="border-t border-slate-200 bg-slate-50/95">
      <div className="container grid gap-12 py-16 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
              <Image
                src="/images/logo-kolaq.jpg"
                alt="Kolaq Alagbo logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-sm uppercase tracking-[0.4em] text-slate-600">Kolaq Alagbo</span>
          </div>
          <p className="max-w-sm text-sm text-slate-600">
            Premium herbal infusions, crafted from ancient Yoruba recipes and refined for the modern world.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <a href="mailto:kolaqalagbo53@gmail.com" className="flex items-center gap-2 hover:text-slate-900">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Mail size={14} />
              </span>
              kolaqalagbo53@gmail.com
            </a>
            <a href="tel:+2349027342185" className="flex items-center gap-2 hover:text-slate-900">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Phone size={14} />
              </span>
              +234 902 734 2185
            </a>
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
        © {new Date().getFullYear()} Kolaq Alagbo International. All rights reserved.
      </div>
    </footer>
  );
}
