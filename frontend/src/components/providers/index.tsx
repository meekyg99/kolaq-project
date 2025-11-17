"use client";

import { CartProvider } from "./cart-provider";
import { CurrencyProvider } from "./currency-provider";
import { InventoryProvider } from "./inventory-provider";
import { APIProductsProvider } from "./api-products-provider";
import { ProductSearchProvider } from "./product-search-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <APIProductsProvider>
        <InventoryProvider>
          <CartProvider>
            <ProductSearchProvider>{children}</ProductSearchProvider>
          </CartProvider>
        </InventoryProvider>
      </APIProductsProvider>
    </CurrencyProvider>
  );
}
