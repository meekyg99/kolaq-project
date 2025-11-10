"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { products } from "@/data/products";
import type { Currency } from "@/data/products";
import { ProductCard } from "@/components/ui/product-card";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { formatCurrency } from "@/lib/currency";

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
  const [currency, setCurrency] = useState<Currency>("NGN");

  const heroProduct = useMemo(() => products.find((p) => p.isFeatured) ?? products[0], []);
  const featuredProducts = useMemo(() => products.filter((p) => p.isFeatured), []);

  return (
    <div className="space-y-24">
      <section className="container grid items-center gap-10 pt-10 md:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-transparent to-transparent" />
          <div className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-[36px] border border-slate-200 bg-white p-10 shadow-lg">
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
            <div className="space-y-2 text-center">
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
          className="space-y-8"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-slate-500">
              Essence Bitter Tonic
            </h2>
            <CurrencyToggle onChange={(value) => setCurrency(value)} defaultCurrency={currency} />
          </div>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-slate-600">
              A revitalizing blend of kola nut, bitter leaf, and botanical bitters that awaken the senses and elevate
              every wellness ritual.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Current Release</span>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Price ({currency})</p>
                  <p className="text-3xl font-semibold text-slate-900">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/products/${heroProduct.slug}`}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-emerald-500"
            >
              View Product Detail
              <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" size={16} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Browse Collection
            </Link>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <dt className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{stat.label}</dt>
                <dd className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      <section className="container space-y-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Collections</span>
            <h2 className="text-3xl font-semibold text-slate-900">Our Featured Signatures</h2>
          </div>
          <CurrencyToggle onChange={(value) => setCurrency(value)} defaultCurrency={currency} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} currency={currency} />
          ))}
        </div>
      </section>

      <section className="container space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Why Kolaq</span>
        <h2 className="text-3xl font-semibold text-slate-900 md:max-w-3xl">
          Built for premium hospitality, wellness spaces, and the discerning collector.
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {sellingPoints.map((point) => (
            <div key={point.title} className="glass-panel flex flex-col gap-4 rounded-[28px] p-7">
              <point.icon className="h-10 w-10 text-[var(--accent)]" />
              <h3 className="text-xl font-semibold text-slate-900">{point.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-slate-900">Ready to stock Kolaq Alagbo?</h3>
              <p className="max-w-xl text-sm text-slate-600">
                Review our catalogue, request reseller pricing, and integrate Paystack-powered checkout for instant fulfilment. Stripe flows ship as soon as API keys arrive.
              </p>
            </div>
            <Link
              href="/promo"
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              View Active Promos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
