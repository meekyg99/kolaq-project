'use client';

import { useEffect } from 'react';
import { generateProductSchema, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo';
import type { Product, ProductVariant } from '@/data/products';

interface ProductSchemaProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  currency: 'NGN' | 'USD';
}

export function ProductSchema({ product, selectedVariant, currency }: ProductSchemaProps) {
  useEffect(() => {
    const price = selectedVariant
      ? currency === 'NGN' ? (selectedVariant.priceNGN || 0) : (selectedVariant.priceUSD || 0)
      : product.price[currency];

    const sku = selectedVariant?.sku || product.sku || 'N/A';
    const stock = selectedVariant?.stock ?? 100;

    const productSchema = generateProductSchema({
      name: product.name,
      description: product.description,
      price,
      currency,
      image: product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`,
      sku,
      availability: stock > 0 ? 'InStock' : 'OutOfStock',
      url: `${BASE_URL}/products/${product.slug}`,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: product.name, url: `/products/${product.slug}` },
    ]);

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify([productSchema, breadcrumbSchema]);
    schemaScript.id = 'product-schema';

    const existingScript = document.getElementById('product-schema');
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(schemaScript);

    return () => {
      const script = document.getElementById('product-schema');
      if (script) {
        script.remove();
      }
    };
  }, [product, selectedVariant, currency]);

  return null;
}
