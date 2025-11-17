import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi, Cart, getSessionId } from '../api/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  currency: 'NGN' | 'USD';
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCurrency: (currency: 'NGN' | 'USD') => void;
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      currency: 'NGN',

      fetchCart: async () => {
        if (typeof window === 'undefined') return;
        set({ isLoading: true, error: null });
        try {
          const sessionId = getSessionId();
          const cart = await cartApi.getCart(sessionId);
          set({ cart, isLoading: false });
        } catch (error: any) {
          console.error('Fetch cart error:', error);
          set({
            error: error.response?.data?.message || 'Failed to fetch cart',
            isLoading: false,
          });
        }
      },

      addToCart: async (productId: string, quantity: number) => {
        if (typeof window === 'undefined') return;
        set({ isLoading: true, error: null });
        try {
          const sessionId = getSessionId();
          const cart = await cartApi.addItem(sessionId, productId, quantity);
          set({ cart, isLoading: false });
        } catch (error: any) {
          console.error('Add to cart error:', error);
          set({
            error: error.response?.data?.message || 'Failed to add item',
            isLoading: false,
          });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        if (typeof window === 'undefined') return;
        set({ isLoading: true, error: null });
        try {
          const sessionId = getSessionId();
          const cart = await cartApi.updateItem(sessionId, itemId, quantity);
          set({ cart, isLoading: false });
        } catch (error: any) {
          console.error('Update quantity error:', error);
          set({
            error: error.response?.data?.message || 'Failed to update item',
            isLoading: false,
          });
        }
      },

      removeItem: async (itemId: string) => {
        if (typeof window === 'undefined') return;
        set({ isLoading: true, error: null });
        try {
          const sessionId = getSessionId();
          const cart = await cartApi.removeItem(sessionId, itemId);
          set({ cart, isLoading: false });
        } catch (error: any) {
          console.error('Remove item error:', error);
          set({
            error: error.response?.data?.message || 'Failed to remove item',
            isLoading: false,
          });
        }
      },

      clearCart: async () => {
        if (typeof window === 'undefined') return;
        set({ isLoading: true, error: null });
        try {
          const sessionId = getSessionId();
          const cart = await cartApi.clearCart(sessionId);
          set({ cart, isLoading: false });
        } catch (error: any) {
          console.error('Clear cart error:', error);
          set({
            error: error.response?.data?.message || 'Failed to clear cart',
            isLoading: false,
          });
        }
      },

      setCurrency: (currency: 'NGN' | 'USD') => {
        set({ currency });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ currency: state.currency }),
      skipHydration: true,
    }
  )
);
