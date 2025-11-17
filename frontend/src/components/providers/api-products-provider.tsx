"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { productsApi, type Product as APIProduct, transformProduct } from "@/lib/api/products";
import type { Product } from "@/data/products";

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function APIProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsApi.getAll();
      
      // Transform API products to frontend format
      const transformed = response.products.map((apiProduct: APIProduct) => {
        const base = transformProduct(apiProduct);
        
        // Validate image URL - reject data URLs
        let validImage = base.image || "/images/bottle.png";
        if (validImage.startsWith("data:")) {
          validImage = "/images/bottle.png";
        }
        
        return {
          id: base.id,
          slug: base.slug,
          name: base.name,
          description: base.description,
          price: base.price,
          sku: `SKU-${base.id.slice(0, 8).toUpperCase()}`,
          stock: 50, // Default stock
          isFeatured: base.isFeatured,
          image: validImage,
          tastingNotes: ["Herbal", "Aromatic", "Smooth"], // Default tasting notes
          category: base.category as any,
          size: base.size || "750ml",
          variants: base.variants || [], // Include variants from backend
        } as Product;
      });
      
      setProducts(transformed);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err as Error);
      // Fallback to empty array on error
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useAPIProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useAPIProducts must be used within an APIProductsProvider");
  }
  return context;
}
