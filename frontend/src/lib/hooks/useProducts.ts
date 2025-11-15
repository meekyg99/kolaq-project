import useSWR from 'swr';
import { productsApi, Product, ProductsResponse } from '../api/products';

export const useProducts = (params?: {
  category?: string;
  search?: string;
  isFeatured?: boolean;
  currency?: 'NGN' | 'USD';
  limit?: number;
  offset?: number;
}) => {
  const key = params ? ['/api/v1/products', params] : '/api/v1/products';
  
  const { data, error, mutate, isLoading } = useSWR<ProductsResponse>(
    key,
    () => productsApi.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    products: data?.products,
    total: data?.total,
    isLoading,
    error,
    mutate,
  };
};

export const useProduct = (slugOrId: string, type: 'slug' | 'id' = 'slug') => {
  const { data, error, mutate, isLoading } = useSWR<Product>(
    slugOrId ? [`/api/v1/products/${type}`, slugOrId] : null,
    () => type === 'slug' ? productsApi.getBySlug(slugOrId) : productsApi.getById(slugOrId),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    product: data,
    isLoading,
    error,
    mutate,
  };
};

export const useFeaturedProducts = (currency?: 'NGN' | 'USD') => {
  const { data, error, mutate, isLoading } = useSWR<Product[]>(
    currency ? ['/api/v1/products/featured', currency] : '/api/v1/products/featured',
    () => productsApi.getFeatured(currency),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    products: data,
    isLoading,
    error,
    mutate,
  };
};

export const useCategories = () => {
  const { data, error, isLoading } = useSWR<string[]>(
    '/api/v1/products/categories',
    productsApi.getCategories,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  return {
    categories: data,
    isLoading,
    error,
  };
};
