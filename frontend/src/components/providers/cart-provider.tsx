"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

interface CartState {
  items: CartItem[];
}

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

type CartAction =
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "UPDATE"; productId: string; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" };

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((item) => item.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: Math.min(item.quantity + action.quantity, 99) }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: Math.min(action.quantity, 99) }],
      };
    }
    case "UPDATE":
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.productId
              ? { ...item, quantity: Math.max(Math.min(action.quantity, 99), 1) }
              : item
          )
          .filter(Boolean),
      };
    case "REMOVE":
      return { items: state.items.filter((item) => item.product.id !== action.productId) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const initialState: CartState = { items: [] };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      addItem: (product, quantity = 1) => dispatch({ type: "ADD", product, quantity }),
      updateQuantity: (productId, quantity) => dispatch({ type: "UPDATE", productId, quantity }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useCartCount() {
  const { items } = useCart();
  return useMemo(() => items.reduce((total, current) => total + current.quantity, 0), [items]);
}
