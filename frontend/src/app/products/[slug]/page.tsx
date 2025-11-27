'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Bot, ChevronRight, ShieldCheck, Loader2 } from "lucide-react";

import { formatCurrency } from "@/lib/currency";
import { ProductCard } from "@/components/ui/product-card";
import { AddToCartButtons } from "@/components/ui/add-to-cart-buttons";
import { ProductVariantSelector } from "@/components/ui/product-variant-selector";
import { ProductImageZoom } from "@/components/ui/product-image-zoom";
import { ProductReviews } from "@/components/ui/product-reviews";
import { ProductSchema } from "@/components/seo/product-schema";
import { useAPIProducts } from "@/components/providers/api-products-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import type { ProductVariant } from "@/data/products";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading } = useAPIProducts();
  const { currency, setCurrency } = useCurrency();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const product = useMemo(
    () => products.find((item) => item.slug === params?.slug),
    [params?.slug, products]
  );

  const { addToRecentlyViewed, getRecentlyViewedProducts } = useRecentlyViewed(product?.id);
  const recentlyViewedProducts = useMemo(
    () => getRecentlyViewedProducts(products),
    [products, getRecentlyViewedProducts]
  );

  // Track product view
  useEffect(() => {
    if (!product?.id) return;
    addToRecentlyViewed(product.id);
  }, [product?.id, addToRecentlyViewed]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      const defaultVariant = product.variants
        .filter((v) => v.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)[0];
      setSelectedVariant(defaultVariant || null);
    }
  }, [product, selectedVariant]);

  const requestedCurrency = searchParams?.get("currency");
  useEffect(() => {
    if (!requestedCurrency) {
      return;
    }
    if ((requestedCurrency === "USD" || requestedCurrency === "NGN") && requestedCurrency !== currency) {
      setCurrency(requestedCurrency);
    }
  }, [currency, requestedCurrency, setCurrency]);

  const related = useMemo(
    () => products.filter((item) => item.slug !== product?.slug).slice(0, 3),
    [product?.slug, products]
  );

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-sm text-slate-600">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container space-y-6 py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Product not found</h1>
        <p className="text-sm text-slate-600">
          The requested product is no longer available. Browse the catalogue to discover other blends.
        </p>
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isDynamicImage = product.image.startsWith("http") || product.image.startsWith("data:");

  return (
    <>
      <ProductSchema product={product} selectedVariant={selectedVariant} currency={currency} />
      <div className="container space-y-10">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        <Link href="/shop" className="transition hover:text-slate-900">
          Shop
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-600">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <ProductImageZoom 
          src={product.image}
          alt={product.name}
          isDynamic={isDynamicImage}
        />

        <div className="space-y-6">
          <header className="space-y-2.5">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              SKU {selectedVariant?.sku || product.sku}
            </span>
            <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-600">{product.description}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="uppercase tracking-[0.3em]">{product.category}</span>
              <span>•</span>
              <span>{selectedVariant?.bottleSize || product.size}</span>
            </div>
          </header>

          {product.variants && product.variants.length > 0 && (
            <ProductVariantSelector
              variants={product.variants}
              currency={currency}
              selectedVariant={selectedVariant || undefined}
              onVariantChange={setSelectedVariant}
            />
          )}

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Price ({currency})</span>
              <span className="text-2xl font-semibold text-slate-900">
                {selectedVariant
                  ? formatCurrency(
                      currency === 'NGN' ? selectedVariant.priceNGN : selectedVariant.priceUSD,
                      currency
                    )
                  : formatCurrency(product.price[currency], currency)}
              </span>
            </div>
            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
              <p className="mt-2 text-xs text-amber-600">
                Only {selectedVariant.stock} left in stock
              </p>
            )}
            {selectedVariant && selectedVariant.stock === 0 && (
              <p className="mt-2 text-xs text-red-600 font-semibold">
                Out of stock
              </p>
            )}
            <p className="mt-3 text-xs text-slate-500">
              Paystack checkout activates instantly for ₦ orders. USD checkout via Stripe ships as soon as keys are provisioned.
            </p>
            <div className="mt-5">
              <AddToCartButtons product={product} selectedVariant={selectedVariant} />
            </div>
          </div>

          <div className="space-y-3.5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</h2>
            <ul className="flex flex-wrap gap-2.5 text-xs text-slate-600">
              {product.tastingNotes.map((note) => (
                <li key={note} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[var(--accent)]" />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Quality Credentials</h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  GMP-certified production, NAFDAC compliance, and international-friendly labelling.
                </p>
              </div>
            </div>
            <Link
              href="https://wa.me/2348157065742"
              rel="noreferrer"
              target="_blank"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-whatsapp)] transition hover:text-[#16a34a]"
            >
              <Bot size={16} className="text-[var(--brand-whatsapp)]" /> Talk to our WhatsApp concierge
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <ProductReviews productId={product.id} />
      </div>

      {/* Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-slate-900">Recently Viewed</h2>
          <div className="grid gap-5 md:grid-cols-4">
            {recentlyViewedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                currency={currency}
                showAddToCart
              />
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="space-y-5">
          <h2 className="container text-xl font-semibold text-slate-900">You may also like</h2>
          <div className="container grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                currency={currency}
                showAddToCart
              />
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
