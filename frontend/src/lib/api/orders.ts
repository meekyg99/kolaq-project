import { apiClient } from './client';
import { Product } from './products';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  currency: 'NGN' | 'USD';
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: string;
  currency: 'NGN' | 'USD';
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  paymentRef?: string;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: string;
  currency: 'NGN' | 'USD';
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  notes?: string;
  sessionId?: string;
}

export const ordersApi = {
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post('/api/v1/orders', data);
    return response.data;
  },

  getByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get(`/api/v1/orders/number/${orderNumber}`);
    return response.data;
  },

  getAll: async (params?: {
    status?: string;
    customerEmail?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get('/api/v1/orders', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/api/v1/orders/stats');
    return response.data;
  },

  updateStatus: async (id: string, status: string, paymentRef?: string): Promise<Order> => {
    const response = await apiClient.patch(`/api/v1/orders/${id}/status`, {
      status,
      paymentRef,
    });
    return response.data;
  },
};
