"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useProducts } from "./inventory-provider";
import { useCartStore } from "@/lib/store/cartStore";
import type { Product } from "@/data/products";

interface ProductSearchContextValue {
  isOpen: boolean;
  query: string;
  open: () => void;
  close: () => void;
  setQuery: (value: string) => void;
}

const ProductSearchContext = createContext<ProductSearchContextValue | null>(null);

function useIsClient() {
  return typeof window !== "undefined";
}

export function ProductSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const value = useMemo(() => ({ isOpen, query, open, close, setQuery }), [isOpen, query]);

  return (
    <ProductSearchContext.Provider value={value}>
      {children}
      <ProductSearchOverlay />
    </ProductSearchContext.Provider>
  );
}

export function useProductSearch() {
  const context = useContext(ProductSearchContext);
  if (!context) {
    throw new Error("useProductSearch must be used within a ProductSearchProvider");
  }
  return context;
}

function matchProduct(product: Product, term: string) {
  const haystack = [
    product.name,
    product.sku,
    product.category,
    product.description,
    product.size,
    ...product.tastingNotes,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term);
}

function ProductSearchOverlay() {
  const { isOpen, open, close, query, setQuery } = useProductSearch();
  const mounted = useIsClient();
  const router = useRouter();
  const products = useProducts();
  const { addToCart, isLoading } = useCartStore();

  useEffect(() => {
    if (!mounted) return undefined;

    const handleKey = (event: KeyboardEvent) => {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      const modKey = isMac ? event.metaKey : event.ctrlKey;
      if ((modKey && event.key.toLowerCase() === "k") || event.key === "/") {
        event.preventDefault();
        if (isOpen) {
          close();
        } else {
          setQuery("");
          open();
        }
      }
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [close, open, isOpen, mounted, setQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const input = document.getElementById("product-search-input") as HTMLInputElement | null;
    input?.focus();
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query) {
      return products.slice(0, 6);
    }
    const term = query.trim().toLowerCase();
    if (!term) {
      return products.slice(0, 6);
    }
    return products.filter((product) => matchProduct(product, term)).slice(0, 12);
  }, [products, query]);

  const handleSelect = (product: Product) => {
    router.push(`/products/${product.slug}`);
    close();
  };

  const handleAddToCart = async (product: Product) => {
    if (isLoading) return;
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
      close();
    } catch (error: any) {
      console.error("Failed to add to cart from search:", error);
      const message = error?.message || "Could not add item to cart. Please try again.";
      toast.error(message);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-start justify-center bg-slate-900/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="mt-24 w-full max-w-3xl rounded-[24px] border border-slate-200/70 bg-white shadow-2xl"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
              <Search size={18} className="text-slate-500" />
              <input
                id="product-search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product, SKU, size, tasting note..."
                className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                autoFocus
              />
              <kbd className="hidden rounded bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-500 sm:block">
                Esc
              </kbd>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-800"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2 py-3">
              {results.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-500">
                  No products match “{query}”. Try a different keyword.
                </div>
              ) : (
                <ul className="space-y-2">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(product)}
                        className="group flex w-full items-start justify-between gap-4 rounded-[18px] border border-transparent px-4 py-4 text-left transition hover:border-slate-200 hover:bg-slate-50"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-[var(--accent)]">
                            {product.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="uppercase tracking-[0.3em] text-slate-400">{product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                            <span>•</span>
                            <span>{product.size}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                          View <ArrowRight size={16} />
                        </span>
                      </button>
                      <div className="flex items-center justify-between px-4 pb-2">
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Notes: {product.tastingNotes.slice(0, 3).join(", ")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <ShoppingBag size={14} /> {isLoading ? "Adding..." : "Add to cart"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-slate-400">
              <span>
                Press <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">Ctrl/⌘ + K</kbd> or <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">/</kbd> to open
              </span>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
