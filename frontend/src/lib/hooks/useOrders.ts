import useSWR from 'swr';
import { ordersApi, Order } from '../api/orders';

export const useOrder = (orderNumber: string) => {
  const { data, error, mutate, isLoading } = useSWR<Order>(
    orderNumber ? [`/api/v1/orders/number`, orderNumber] : null,
    () => ordersApi.getByOrderNumber(orderNumber),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    order: data,
    isLoading,
    error,
    mutate,
  };
};

export const useOrders = (params?: {
  status?: string;
  customerEmail?: string;
  limit?: number;
  offset?: number;
}) => {
  const key = params ? ['/api/v1/orders', params] : '/api/v1/orders';
  
  const { data, error, mutate, isLoading } = useSWR(
    key,
    () => ordersApi.getAll(params),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    orders: data?.orders,
    total: data?.total,
    isLoading,
    error,
    mutate,
  };
};

export const useOrderStats = () => {
  const { data, error, isLoading } = useSWR(
    '/api/v1/orders/stats',
    ordersApi.getStats,
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, // 1 minute
    }
  );

  return {
    stats: data,
    isLoading,
    error,
  };
};
