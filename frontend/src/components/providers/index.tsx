"use client";

import { CurrencyProvider } from "./currency-provider";
import { InventoryProvider } from "./inventory-provider";
import { APIProductsProvider } from "./api-products-provider";
import { ProductSearchProvider } from "./product-search-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <APIProductsProvider>
        <InventoryProvider>
          <ProductSearchProvider>{children}</ProductSearchProvider>
        </InventoryProvider>
      </APIProductsProvider>
    </CurrencyProvider>
  );
}
