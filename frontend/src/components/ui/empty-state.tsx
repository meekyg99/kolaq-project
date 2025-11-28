'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Search, Package, AlertCircle } from 'lucide-react';

type EmptyStateType = 'cart' | 'search' | 'products' | 'error';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  searchQuery?: string;
  onAction?: () => void;
}

const illustrations: Record<EmptyStateType, React.ReactNode> = {
  cart: (
    <div className="relative">
      {/* Shopping bag with floating items */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg">
          <ShoppingBag className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
        </div>
        {/* Floating dots representing empty items */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[var(--accent-green)]/30"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute top-4 -left-3 w-3 h-3 rounded-full bg-amber-300/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-300/40"
        />
      </motion.div>
      {/* Bottle silhouettes */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute -left-8 bottom-0"
      >
        <svg width="40" height="60" viewBox="0 0 40 60" className="text-slate-300">
          <path
            d="M15 10 L25 10 L25 15 L28 20 L28 55 C28 57 26 60 20 60 C14 60 12 57 12 55 L12 20 L15 15 Z"
            fill="currentColor"
          />
          <rect x="16" y="2" width="8" height="8" rx="2" fill="currentColor" />
        </svg>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute -right-6 bottom-2"
      >
        <svg width="35" height="50" viewBox="0 0 35 50" className="text-slate-300">
          <path
            d="M12 8 L23 8 L23 12 L26 16 L26 45 C26 47 24 50 17.5 50 C11 50 9 47 9 45 L9 16 L12 12 Z"
            fill="currentColor"
          />
          <rect x="13" y="1" width="9" height="7" rx="2" fill="currentColor" />
        </svg>
      </motion.div>
    </div>
  ),
  
  search: (
    <div className="relative">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg">
          <Search className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
        </div>
        {/* Question marks floating */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [-5, -20] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="absolute -top-4 right-2 text-2xl text-slate-300"
        >
          ?
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [-5, -25] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute -top-2 -left-2 text-xl text-slate-300"
        >
          ?
        </motion.span>
      </motion.div>
      {/* Magnifying effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-3xl border-4 border-dashed border-slate-200"
      />
    </div>
  ),
  
  products: (
    <div className="relative">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg">
          <Package className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
        </div>
        {/* Sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            className="absolute"
            style={{
              top: `${10 + i * 20}%`,
              left: i % 2 === 0 ? '-10%' : '90%',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-amber-400">
              <path
                d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        ))}
      </motion.div>
    </div>
  ),
  
  error: (
    <div className="relative">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-400" strokeWidth={1.5} />
        </div>
      </motion.div>
    </div>
  ),
};

const defaultContent: Record<EmptyStateType, { title: string; description: string; actionLabel: string; actionHref: string }> = {
  cart: {
    title: "Your cart is empty",
    description: "Explore the collection and add KOLAQ ALAGBO BITTERS signatures to continue to checkout.",
    actionLabel: "Browse Products",
    actionHref: "/shop",
  },
  search: {
    title: "No results found",
    description: "We couldn't find any products matching your search. Try a different keyword.",
    actionLabel: "Clear Search",
    actionHref: "/shop",
  },
  products: {
    title: "No products available",
    description: "There are no products in this category yet. Check back soon or explore other categories.",
    actionLabel: "View All Products",
    actionHref: "/shop",
  },
  error: {
    title: "Something went wrong",
    description: "We encountered an error loading the products. Please try again later.",
    actionLabel: "Try Again",
    actionHref: "/shop",
  },
};

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  searchQuery,
  onAction,
}: EmptyStateProps) {
  const content = defaultContent[type];
  const displayTitle = title || content.title;
  const displayDescription = searchQuery 
    ? `No products match "${searchQuery}". Try a different keyword.` 
    : (description || content.description);
  const displayActionLabel = actionLabel || content.actionLabel;
  const displayActionHref = actionHref || content.actionHref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 py-16 text-center"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {illustrations[type]}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-semibold text-slate-900">{displayTitle}</h2>
        <p className="max-w-md text-sm text-slate-600">{displayDescription}</p>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-3 rounded-full bg-[var(--accent-green)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[var(--accent-green-hover)] shadow-lg shadow-[var(--accent-green)]/25"
          >
            {displayActionLabel}
          </button>
        ) : (
          <Link
            href={displayActionHref}
            className="inline-flex items-center gap-3 rounded-full bg-[var(--accent-green)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[var(--accent-green-hover)] shadow-lg shadow-[var(--accent-green)]/25"
          >
            {displayActionLabel}
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
