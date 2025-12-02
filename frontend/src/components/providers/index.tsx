"use client";

import { AuthProvider } from "./auth-provider";
import { CurrencyProvider } from "./currency-provider";
import { InventoryProvider } from "./inventory-provider";
import { APIProductsProvider } from "./api-products-provider";
import { ProductSearchProvider } from "./product-search-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <APIProductsProvider>
          <InventoryProvider>
            <ProductSearchProvider>{children}</ProductSearchProvider>
          </InventoryProvider>
        </APIProductsProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
