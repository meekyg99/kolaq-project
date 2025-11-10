import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, type Currency } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { ProductCard } from "@/components/ui/product-card";
import { Bot, ChevronRight, ShieldCheck } from "lucide-react";
import { AddToCartButtons } from "@/components/ui/add-to-cart-buttons";

interface ProductPageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: { currency?: Currency };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const requestedCurrency = searchParams?.currency;
  const currency: Currency = requestedCurrency === "USD" || requestedCurrency === "NGN" ? requestedCurrency : "NGN";

  return (
    <div className="container space-y-12">
      <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        <Link href="/shop" className="transition hover:text-slate-900">
          Shop
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <div className="relative flex items-center justify-center rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            width={380}
            height={480}
            className="h-auto w-full max-w-sm drop-shadow-[0_25px_60px_rgba(74,222,128,0.35)]"
          />
        </div>

        <div className="space-y-8">
          <header className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">SKU {product.sku}</span>
            <h1 className="text-4xl font-semibold text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-600">{product.description}</p>
          </header>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Price ({currency})</span>
              <span className="text-2xl font-semibold text-slate-900">
                {formatCurrency(product.price[currency], currency)}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Paystack checkout activates instantly for ₦ orders. USD checkout via Stripe ships as soon as keys are
              provisioned.
            </p>
            <div className="mt-6">
              <AddToCartButtons product={product} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</h2>
            <ul className="flex flex-wrap gap-3 text-xs text-slate-600">
              {product.tastingNotes.map((note) => (
                <li key={note} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[var(--accent)]" />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Quality Credentials</h3>
                <p className="mt-2 text-sm text-slate-600">
                  GMP-certified production, NAFDAC compliance, and international-friendly labelling.
                </p>
              </div>
            </div>
            <Link
              href="https://wa.me/2349027342185"
              rel="noreferrer"
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]"
            >
              <Bot size={16} /> Talk to our WhatsApp concierge
            </Link>
          </div>
        </div>
      </div>

      <RelatedProducts currentSlug={product.slug} currency={currency} />
    </div>
  );
}

function RelatedProducts({ currentSlug, currency }: { currentSlug: string; currency: Currency }) {
  const others = products.filter((item) => item.slug !== currentSlug).slice(0, 3);

  if (others.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="container text-2xl font-semibold text-slate-900">You may also like</h2>
      <div className="container grid gap-6 md:grid-cols-3">
        {others.map((item) => (
          <ProductCard key={item.id} product={item} currency={currency} />
        ))}
      </div>
    </div>
  );
}
