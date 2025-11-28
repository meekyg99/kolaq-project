'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

// Route label mappings for automatic breadcrumb generation
const routeLabels: Record<string, string> = {
  shop: 'Shop',
  products: 'Products',
  cart: 'Shopping Cart',
  checkout: 'Checkout',
  about: 'About Us',
  contact: 'Contact',
  support: 'Support',
  'track-order': 'Track Order',
  shipping: 'Shipping',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  cookies: 'Cookie Policy',
  reseller: 'Reseller Program',
  account: 'My Account',
  orders: 'My Orders',
  'order-confirmation': 'Order Confirmation',
};

export function Breadcrumbs({ items, showHome = true, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Check if this is a dynamic segment (like product slug)
      const isLastSegment = index === segments.length - 1;
      const label = routeLabels[segment] || formatSegment(segment);
      
      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  // Format segment to readable label (e.g., "my-orders" -> "My Orders")
  const formatSegment = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;

  return (
    <nav 
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-sm ${className}`}
    >
      {showHome && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              href="/"
              className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-[var(--accent-green)]"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </motion.div>
          {breadcrumbs.length > 0 && (
            <ChevronRight className="w-4 h-4 text-slate-300" />
          )}
        </>
      )}

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
            className="flex items-center gap-1.5"
          >
            {isLast ? (
              <span 
                className="font-medium text-slate-700 truncate max-w-[200px]"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <>
                <Link 
                  href={item.href}
                  className="text-slate-400 transition-colors hover:text-[var(--accent-green)] truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}

// Compact version for product pages
export function BreadcrumbsCompact({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.href} className="flex items-center gap-2">
            {isLast ? (
              <span className="text-slate-600">{item.label}</span>
            ) : (
              <>
                <Link 
                  href={item.href}
                  className="transition hover:text-slate-900"
                >
                  {item.label}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
