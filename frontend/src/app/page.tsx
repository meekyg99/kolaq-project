"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";
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
      <section className="container grid items-center gap-6 pt-6 md:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-transparent to-transparent" />
          <div className="relative flex w-full max-w-md flex-col items-center gap-5 rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
            <motion.div
              className="relative flex h-72 w-44 items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            >
              <Image
                src={heroProduct.image}
                alt={heroProduct.name}
                width={240}
                height={340}
                className="h-auto w-full drop-shadow-[0_22px_45px_rgba(34,197,94,0.28)]"
              />
            </motion.div>
            <div className="space-y-1.5 text-center">
              <span className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">Signature Blend</span>
              <h1 className="text-3xl font-semibold text-slate-900">{heroProduct.name}</h1>
              <p className="text-sm text-slate-600">{heroProduct.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-slate-500">
              Essence Bitter Tonic
            </h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-slate-600">
              A revitalizing blend of kola nut, bitter leaf, and botanical bitters that awaken the senses and elevate
              every wellness ritual.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Current Release</span>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Price ({currency})</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatCurrency(heroProduct.price[currency], currency)}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>SKU {heroProduct.sku}</p>
                  <p>Stock: {heroProduct.stock} bottles</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href={`/products/${heroProduct.slug}`}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
            >
              View Product Detail
              <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" size={16} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Browse Collection
            </Link>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{stat.label}</dt>
                <dd className="mt-1.5 text-lg font-semibold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      <section className="container space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Collections</span>
            <h2 className="text-3xl font-semibold text-slate-900">Our Featured Signatures</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} currency={currency} />
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
