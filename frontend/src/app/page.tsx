"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, ShieldCheck, Sparkles, ShoppingCart } from "lucide-react";
import { useMemo } from "react";

import { ProductCard } from "@/components/ui/product-card";
import { formatCurrency } from "@/lib/currency";
import { useAPIProducts } from "@/components/providers/api-products-provider";
import { useCurrency } from "@/components/providers/currency-provider";

const heroStats = [
  { label: "Herbal Heritage", value: "3 Generations" },
  { label: "Average Repeat Rate", value: "92%" },
  { label: "Countries Served", value: "12" },
];

const sellingPoints = [
  {
    icon: ShieldCheck,
    title: "Certified Premium",
    description: "Sourced from traceable farms with ISO-certified bottling for global compliance.",
  },
  {
    icon: Sparkles,
    title: "Modern Rituals",
    description: "Elevated rituals for wellness lounges, mixologists, and connoisseurs alike.",
  },
  {
    icon: Leaf,
    title: "Rooted Craft",
    description: "Infused with indigenous botanicals and refined aging techniques.",
  },
];

export default function Home() {
  const { currency } = useCurrency();
  const { products: productList, isLoading } = useAPIProducts();

  const heroProduct = useMemo(() => {
    if (productList.length === 0) {
      return undefined;
    }
    return productList.find((product) => product.isFeatured) ?? productList[0];
  }, [productList]);

  const featuredProducts = useMemo(
    () => productList.filter((product) => product.isFeatured).slice(0, 6),
    [productList]
  );

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-slate-200 border-t-[var(--accent)] rounded-full mx-auto"></div>
          <p className="text-sm text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!heroProduct) {
    return (
      <div className="container space-y-6 py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">No products available yet</h1>
        <p className="text-sm text-slate-600">
          Use the admin dashboard to seed products and they will appear across the storefront instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <section className="container pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-transparent to-transparent">
            <div className="grid h-full w-full grid-cols-2 gap-0">
              <div className="h-full w-full overflow-hidden">
                <ProductCard
                  product={heroProduct}
                  currency={currency}
                  hidePrice
                  borderless
                  imageFill
                />
              </div>
              {featuredProducts
                .filter((product) => product.id !== heroProduct.id)
                .slice(0, 1)
                .map((product) => (
                  <div key={product.id} className="h-full w-full overflow-hidden">
                    <ProductCard
                      product={product}
                      currency={currency}
                      hidePrice
                      borderless
                      imageFill
                    />
                  </div>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Link
                href="#shop"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/90 px-6 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900"
              >
                <span>Shop Now</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="shop" className="container space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Collections</span>
            <h2 className="text-3xl font-semibold text-slate-900">Our Featured Signatures</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              showAddToCart
            />
          ))}
        </div>
      </section>

      <section className="container space-y-5">
  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Why KOLAQ ALAGBO BITTERS</span>
        <h2 className="text-3xl font-semibold text-slate-900 md:max-w-3xl">
          Built for premium hospitality, wellness spaces, and the discerning collector.
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {sellingPoints.map((point) => (
            <div key={point.title} className="glass-panel flex flex-col gap-4 rounded-[28px] p-7">
              <point.icon className="h-10 w-10 text-[var(--accent)]" />
              <h3 className="text-xl font-semibold text-slate-900">{point.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
