import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

export const useCart = () => {
  const {
    cart,
    isLoading,
    error,
    currency,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setCurrency,
    clearError,
  } = useCartStore();

  // Fetch cart on mount
  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, []);

  const itemCount = cart?.itemCount || 0;
  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];

  return {
    cart,
    items,
    itemCount,
    subtotal,
    currency,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setCurrency,
    clearError,
    refreshCart: fetchCart,
  };
};
