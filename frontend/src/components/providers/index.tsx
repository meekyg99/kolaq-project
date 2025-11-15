"use client";

import { CartProvider } from "./cart-provider";
import { CurrencyProvider } from "./currency-provider";
import { InventoryProvider } from "./inventory-provider";
import { ProductSearchProvider } from "./product-search-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <InventoryProvider>
        <CartProvider>
          <ProductSearchProvider>{children}</ProductSearchProvider>
        </CartProvider>
      </InventoryProvider>
    </CurrencyProvider>
  );
}
