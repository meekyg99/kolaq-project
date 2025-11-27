'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/data/products';

const MAX_RECENTLY_VIEWED = 4;
const STORAGE_KEY = 'kolaq-recently-viewed';

export function useRecentlyViewed(currentProductId?: string) {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Load from localStorage once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recently viewed:', error);
      }
    }
  }, []);

  // Persist whenever recentlyViewed changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      return updated;
    });
  }, []);

  const getRecentlyViewedProducts = (allProducts: Product[]) => {
    return recentlyViewed
      .filter((id) => id !== currentProductId)
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewedProducts,
  };
}
