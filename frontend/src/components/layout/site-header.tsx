"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ChevronDown, Search, ShoppingCart, UserRound, X, Phone, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { useCartStore } from "@/lib/store/cartStore";
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
  const { cart, fetchCart } = useCartStore();
  const { open } = useProductSearch();
  const cartCount = cart?.itemCount || 0;

  useEffect(() => {
    fetchCart();
  }, []);

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
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] hover:bg-[var(--accent-green)]/5"
          >
            <Search size={16} className="transition-transform group-hover:scale-110" />
            Search
          </button>
          <CurrencyToggle />
          <Link
            href="/cart"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] hover:bg-[var(--accent-green)]/5"
          >
            <ShoppingCart size={16} className="transition-transform group-hover:scale-110" />
            <span>Cart</span>
            {cartCount > 0 && (
              <motion.span 
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent-green)] px-1 text-[11px] font-semibold text-white shadow-sm"
              >
                {cartCount}
              </motion.span>
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
          
          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-2xl md:hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-800">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="flex h-[calc(100%-80px)] flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-4 py-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition",
                        pathname === link.href
                          ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="h-2 w-2 rounded-full bg-[var(--accent-green)]" />
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Divider */}
                <div className="my-4 h-px bg-slate-200" />
                
                {/* Search Button */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => {
                    open();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Search size={20} />
                  Search Products
                </motion.button>
                
                {/* Cart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    href="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart size={20} />
                      Shopping Cart
                    </span>
                    {cartCount > 0 && (
                      <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[var(--accent-green)] px-2 text-xs font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
                
                {/* Divider */}
                <div className="my-4 h-px bg-slate-200" />
                
                {/* Currency Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-2"
                >
                  <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">Currency</p>
                  <CurrencyToggle />
                </motion.div>
                
                {/* Divider */}
                <div className="my-4 h-px bg-slate-200" />
                
                {/* Account Links */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-1"
                >
                  <p className="px-4 pb-2 text-xs uppercase tracking-widest text-slate-400">Account</p>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <UserRound size={20} />
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-[var(--accent-green)] px-4 py-3 text-base font-medium text-white transition hover:bg-[var(--accent-green-hover)]"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </nav>
              
              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-t border-slate-200 px-6 py-4"
              >
                <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Contact Us</p>
                <a 
                  href="tel:+2348157065742" 
                  className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
                >
                  <Phone size={14} />
                  +234 815 706 5742
                </a>
                <a 
                  href="mailto:support@kolaqalagbo.org" 
                  className="mt-2 flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
                >
                  <Mail size={14} />
                  support@kolaqalagbo.org
                </a>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </header>
  );
}
