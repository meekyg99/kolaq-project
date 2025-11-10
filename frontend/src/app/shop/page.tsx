"use client";

import { useMemo, useState } from "react";
import { products, type Currency } from "@/data/products";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { ProductCard } from "@/components/ui/product-card";
import { Search, SlidersHorizontal } from "lucide-react";

const categories = ["All", "Bitters", "Elixirs", "Aperitifs", "Limited"];

export default function ShopPage() {
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    if (activeCategory === "Bitters") return products.filter((p) => p.name.toLowerCase().includes("bitter"));
    if (activeCategory === "Elixirs") return products.filter((p) => p.name.toLowerCase().includes("elixir"));
    if (activeCategory === "Aperitifs") return products.filter((p) => p.name.toLowerCase().includes("aperitif"));
    if (activeCategory === "Limited") return products.filter((p) => p.isFeatured);
    return products;
  }, [activeCategory]);

  return (
    <div className="container space-y-8">
      <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2.5">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Shop</span>
          <h1 className="text-3xl font-semibold text-slate-900">Explore the Kolaq catalogue</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Browse signature bitters, herbal elixirs, and aperitifs. Toggle pricing in ₦ or $ and add to cart for a streamlined Paystack checkout.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900">
            <Search size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900">
            <SlidersHorizontal size={18} />
          </button>
          <CurrencyToggle onChange={(value) => setCurrency(value)} defaultCurrency={currency} />
        </div>
      </div>

  <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} currency={currency} />
        ))}
      </div>
    </div>
  );
}
