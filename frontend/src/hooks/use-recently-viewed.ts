'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/data/products';

const MAX_RECENTLY_VIEWED = 4;
const STORAGE_KEY = 'kolaq-recently-viewed';

export function useRecentlyViewed(currentProductId?: string) {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recently viewed:', error);
      }
    }
  }, []);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((id) => id !== productId);
      // Add to beginning
      const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getRecentlyViewedProducts = (allProducts: Product[]) => {
    return recentlyViewed
      .filter((id) => id !== currentProductId) // Exclude current product
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewedProducts,
  };
}
