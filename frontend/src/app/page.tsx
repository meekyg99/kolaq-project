"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, ShieldCheck, Sparkles, ShoppingCart } from "lucide-react";
import { useMemo } from "react";

import { ProductCard } from "@/components/ui/product-card";
import { ProductGridSkeleton, HeroSkeleton } from "@/components/ui/skeleton";
import { HeroAnimated } from "@/components/ui/hero-animated";
import { TestimonialsSection } from "@/components/ui/testimonials";
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
      <div className="space-y-16">
        <section className="container pt-6">
          <div className="relative flex items-center justify-center">
            <HeroSkeleton />
          </div>
        </section>
        <section className="container space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Collections</span>
            <h2 className="text-3xl font-semibold text-slate-900">Our Featured Signatures</h2>
          </div>
          <ProductGridSkeleton count={6} />
        </section>
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
          <HeroAnimated 
            productImage={heroProduct.image?.startsWith('http') || heroProduct.image?.startsWith('/') ? heroProduct.image : "/images/bottle.png"}
            productName={heroProduct.name}
          />
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

      {/* Testimonials */}
      <TestimonialsSection />

      <section className="container space-y-5">
  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Why KOLAQ ALAGBO BITTERS</span>
        <h2 className="text-3xl font-semibold text-slate-900 md:max-w-3xl">
          Built for premium hospitality, wellness spaces, and the discerning collector.
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {sellingPoints.map((point) => (
            <div key={point.title} className="glass-panel flex flex-col gap-4 rounded-[28px] p-7">
              <point.icon className="h-10 w-10 text-[var(--accent-green)]" />
              <h3 className="text-xl font-semibold text-slate-900">{point.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
