"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/components/providers/currency-provider";
import { useAPIProducts } from "@/components/providers/api-products-provider";

export default function PromotionsPage() {
  const { currency } = useCurrency();
  const { products, isLoading } = useAPIProducts();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Featured products (limited to 3)
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  // Calculate time remaining until end of month for promo
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const difference = endOfMonth.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container space-y-12 py-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Special Offers</span>
        <h1 className="text-4xl font-semibold text-slate-900">Exclusive Promotions</h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Discover our limited-time offers and seasonal bundles. Get premium KOLAQ ALAGBO BITTERS at special prices.
        </p>
      </div>

      {/* Main Promo Banner */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 shadow-sm md:p-12">
        <div className="relative z-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              <Clock size={14} />
              Limited Time
            </div>
            <h2 className="text-3xl font-semibold text-slate-900">
              End of Month Sale
              <br />
              <span className="text-[var(--accent)]">Up to 25% Off</span>
            </h2>
            <p className="text-sm text-slate-600">
              Stock up on your favorite KOLAQ ALAGBO BITTERS products. Offer valid on selected items while supplies last.
            </p>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-bold text-slate-900">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <span className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/50 to-transparent rounded-3xl" />
            <Image
              src="/images/promo-banner.jpg"
              alt="Promotion"
              width={500}
              height={400}
              className="relative z-10 rounded-2xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      {/* Featured Promo Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Deals</h2>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] transition hover:text-neutral-900"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => {
              const price = product.price[currency];
              const discountedPrice = price * 0.85; // 15% off

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    15% Off
                  </div>

                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-50">
                    <Image
                      src={product.image || "/placeholder-product.png"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <p className="line-clamp-2 text-xs text-slate-600">{product.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(discountedPrice, currency)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(price, currency)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bundle Offer */}
      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 md:p-12">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">Bundle & Save</h2>
          <p className="text-sm text-slate-600">
            Purchase any 3 bottles and get <span className="font-semibold text-[var(--accent)]">20% off</span> your entire order.
            Mix and match your favorites!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)] bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
          >
            Create Your Bundle
          </Link>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs text-slate-600">
        <h3 className="mb-3 font-semibold uppercase tracking-[0.2em] text-slate-900">Terms & Conditions</h3>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Promotions valid until the end of the current month</li>
          <li>Discounts apply automatically at checkout on eligible items</li>
          <li>Cannot be combined with other offers unless stated</li>
          <li>Bundle discounts require minimum purchase of 3 bottles</li>
          <li>Limited quantities available, first come first served</li>
        </ul>
      </div>
    </div>
  );
}
