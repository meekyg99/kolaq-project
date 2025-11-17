import { apiClient } from './client';

export interface Price {
  id: string;
  currency: 'NGN' | 'USD';
  amount: number;
}

export interface ProductVariantAPI {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  bottleSize: string;
  priceNGN: number;
  priceUSD: number;
  image?: string;
  stock: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  size?: string;
  isFeatured: boolean;
  prices: Price[];
  variants?: ProductVariantAPI[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateProductRequest {
  slug: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  size?: string;
  isFeatured?: boolean;
  prices: Array<{ currency: 'NGN' | 'USD'; amount: number }>;
}

export const productsApi = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    isFeatured?: boolean;
    currency?: 'NGN' | 'USD';
    limit?: number;
    offset?: number;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get('/api/v1/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/api/v1/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get(`/api/v1/products/slug/${slug}`);
    return response.data;
  },

  getFeatured: async (currency?: 'NGN' | 'USD'): Promise<Product[]> => {
    const response = await apiClient.get('/api/v1/products/featured', {
      params: { currency },
    });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/v1/products/categories');
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post('/api/v1/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await apiClient.patch(`/api/v1/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/products/${id}`);
  },
};

// Helper to transform API product to frontend format
export const transformProduct = (apiProduct: Product) => ({
  ...apiProduct,
  price: apiProduct.prices.reduce((acc, p) => {
    acc[p.currency] = p.amount;
    return acc;
  }, {} as Record<'NGN' | 'USD', number>),
  variants: apiProduct.variants?.map(v => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    bottleSize: v.bottleSize,
    priceNGN: Number(v.priceNGN),
    priceUSD: Number(v.priceUSD),
    image: v.image,
    stock: v.stock,
    isActive: v.isActive,
    sortOrder: v.sortOrder,
  })) || [],
});
