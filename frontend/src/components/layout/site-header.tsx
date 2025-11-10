"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { PhoneCall, ShoppingBag, Bot } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useCartCount } from "@/components/providers/cart-provider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/promo", label: "Promotions" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartCount();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-700">
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white">
            <Image
              src="/images/logo-kolaq.jpg"
              alt="Kolaq Alagbo logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="hidden sm:inline-flex text-base font-semibold text-slate-800">Kolaq Alagbo</span>
        </Link>

    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative transition-colors",
                pathname === link.href ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[var(--accent)]" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ShoppingBag size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Create Account
          </Link>
          <Link
            href="https://wa.me/2349027342185"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-whatsapp)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16a34a]"
          >
            <Bot size={16} className="text-white" />
            WhatsApp Bot
          </Link>
        </div>

        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "absolute h-[2px] w-5 bg-slate-700 transition",
              menuOpen ? "rotate-45" : "-translate-y-1.5"
            )}
          />
          <span
            className={cn(
              "absolute h-[2px] w-5 bg-slate-700 transition",
              menuOpen ? "opacity-0" : "opacity-100"
            )}
          />
          <span
            className={cn(
              "absolute h-[2px] w-5 bg-slate-700 transition",
              menuOpen ? "-rotate-45" : "translate-y-1.5"
            )}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden">
          <div className="container flex flex-col gap-3 py-4 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden />
                )}
              </Link>
            ))}
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700"
            >
              <ShoppingBag size={16} /> Cart
              {cartCount > 0 && (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="https://wa.me/2349027342185"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-whatsapp)] px-4 py-2 text-white"
            >
              <Bot size={16} /> WhatsApp Bot
            </Link>
            <a href="tel:+2349027342185" className="inline-flex items-center gap-2 text-slate-500 transition hover:text-slate-800">
              <PhoneCall size={16} />
              +234 902 734 2185
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
