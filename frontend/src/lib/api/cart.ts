import { apiClient } from './client';
import { Product } from './products';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  currency: 'NGN' | 'USD';
  product: Product;
  itemTotal: number;
}

export interface Cart {
  id: string;
  sessionId: string;
  currency: 'NGN' | 'USD';
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export const cartApi = {
  getCart: async (sessionId: string): Promise<Cart> => {
    const response = await apiClient.get('/api/v1/cart', {
      params: { sessionId },
    });
    return response.data;
  },

  addItem: async (sessionId: string, productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.post(
      '/api/v1/cart/add',
      { productId, quantity },
      { params: { sessionId } }
    );
    return response.data;
  },

  updateItem: async (sessionId: string, itemId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.patch(
      `/api/v1/cart/items/${itemId}`,
      { quantity },
      { params: { sessionId } }
    );
    return response.data;
  },

  removeItem: async (sessionId: string, itemId: string): Promise<Cart> => {
    const response = await apiClient.delete(`/api/v1/cart/items/${itemId}`, {
      params: { sessionId },
    });
    return response.data;
  },

  clearCart: async (sessionId: string): Promise<Cart> => {
    const response = await apiClient.delete('/api/v1/cart/clear', {
      params: { sessionId },
    });
    return response.data;
  },
};

// Helper to generate/get session ID
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
