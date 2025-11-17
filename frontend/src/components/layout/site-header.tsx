"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ChevronDown, Search, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { useCartCount } from "@/components/providers/cart-provider";
import { useProductSearch } from "@/components/providers/product-search-provider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/promo", label: "Promotions" },
  { href: "/track-order", label: "Track Order" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const cartCount = useCartCount();
  const { open } = useProductSearch();

  const homeLink = navLinks[0];
  const secondaryLinks = navLinks.slice(1);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuStateRef = useRef({
    menuOpen: false,
    mobileDropdownOpen: false,
    mobileProfileOpen: false,
    profileMenuOpen: false,
  });

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  useEffect(() => {
    menuStateRef.current = {
      menuOpen,
      mobileDropdownOpen,
      mobileProfileOpen,
      profileMenuOpen,
    };
  }, [menuOpen, mobileDropdownOpen, mobileProfileOpen, profileMenuOpen]);

  useEffect(() => {
    const { menuOpen: isMenuOpen, mobileDropdownOpen: isDropdownOpen, mobileProfileOpen: isMobileProfileOpen, profileMenuOpen: isProfileOpen } =
      menuStateRef.current;
    if (!isMenuOpen && !isDropdownOpen && !isMobileProfileOpen && !isProfileOpen) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setProfileMenuOpen(false);
      setMenuOpen(false);
      setMobileDropdownOpen(false);
      setMobileProfileOpen(false);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-700">
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white">
            <Image
              src="/images/logo-kolaq.jpg"
              alt="KOLAQ ALAGBO BITTERS logo"
              width={48}
              height={48}
              className="h-full w-full object-contain p-1"
              priority
            />
          </span>
          <span className="hidden sm:inline-flex text-base font-semibold text-slate-800">KOLAQ ALAGBO BITTERS</span>
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
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            <Search size={16} />
            Search
          </button>
          <CurrencyToggle />
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition",
                profileMenuOpen ? "bg-slate-100" : "hover:bg-slate-100"
              )}
            >
              <UserRound size={18} />
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-600 shadow-lg">
                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
          onClick={() =>
            setMenuOpen((prev) => {
              const next = !prev;
              if (!next) {
                setMobileDropdownOpen(false);
                setMobileProfileOpen(false);
              }
              return next;
            })
          }
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
          <div className="container flex flex-col gap-4 py-4 text-sm font-medium text-slate-600">
            {homeLink && (
              <Link
                key={homeLink.href}
                href={homeLink.href}
                className="flex items-center justify-between py-2"
                onClick={() => setMenuOpen(false)}
              >
                {homeLink.label}
                {pathname === homeLink.href && (
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden />
                )}
              </Link>
            )}
            <CurrencyToggle />
            {secondaryLinks.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setMobileDropdownOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
                >
                  <span>Explore</span>
                  <ChevronDown
                    size={16}
                    className={cn("transition", mobileDropdownOpen ? "rotate-180" : "rotate-0")}
                  />
                </button>
                {mobileDropdownOpen && (
                  <div className="border-t border-slate-200">
                    {secondaryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between px-4 py-2 text-slate-600 hover:text-slate-900"
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileDropdownOpen(false);
                        }}
                      >
                        {link.label}
                        {pathname === link.href && (
                          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" aria-hidden />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                open();
                setMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700"
            >
              <Search size={16} /> Search
            </button>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700"
            >
              <ShoppingCart size={16} /> Cart
              {cartCount > 0 && (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setMobileProfileOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
              >
                <span className="inline-flex items-center gap-2">
                  <UserRound size={16} />
                  Account
                </span>
                <ChevronDown
                  size={16}
                  className={cn("transition", mobileProfileOpen ? "rotate-180" : "rotate-0")}
                />
              </button>
              {mobileProfileOpen && (
                <div className="border-t border-slate-200">
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 transition hover:text-slate-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 transition hover:text-slate-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
            <a href="tel:+2348157065742" className="inline-flex items-center gap-2 text-slate-500 transition hover:text-slate-800">
              +234 815 706 5742
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
