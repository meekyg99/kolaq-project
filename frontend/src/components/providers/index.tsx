"use client";

import { CartProvider } from "./cart-provider";
import { InventoryProvider } from "./inventory-provider";
import { ProductSearchProvider } from "./product-search-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      <CartProvider>
        <ProductSearchProvider>{children}</ProductSearchProvider>
      </CartProvider>
    </InventoryProvider>
  );
}
