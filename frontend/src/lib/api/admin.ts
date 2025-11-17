import { apiClient } from './client';

export interface SalesAnalytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalItems: number;
    currencyBreakdown: {
      NGN: number;
      USD: number;
    };
  };
  dailySales: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ProductPerformance {
  product: {
    id: string;
    name: string;
    category: string;
    image: string;
  };
  unitsSold: number;
  orderCount: number;
  revenue: number;
}

export interface InventoryStatus {
  summary: {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  inventory: Array<{
    id: string;
    name: string;
    category: string;
    totalStock: number;
    variants: Array<{
      id: string;
      name: string;
      bottleSize: string;
      stock: number;
      status: string;
    }>;
    status: string;
    eventsCount: number;
  }>;
}

export interface InventoryForecast {
  forecastPeriodDays: number;
  lookbackPeriodDays: number;
  forecasts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    dailyAverageSales: number;
    forecastedDemand: number;
    projectedStockoutDays: number | null;
    reorderPoint: number;
    needsReorder: boolean;
    recommendedOrderQuantity: number;
  }>;
}

export interface CustomerMetrics {
  uniqueCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  averageCustomerValue: number;
  retentionRate: number;
}

export const adminApi = {
  getDashboard: async () => {
    const response = await apiClient.get('/api/v1/admin/dashboard');
    return response.data;
  },

  getAnalytics: async (days: number = 30) => {
    const response = await apiClient.get('/api/v1/admin/analytics', {
      params: { days },
    });
    return response.data;
  },

  getTopProducts: async (limit: number = 10) => {
    const response = await apiClient.get('/api/v1/admin/top-products', {
      params: { limit },
    });
    return response.data;
  },

  getCustomerInsights: async () => {
    const response = await apiClient.get('/api/v1/admin/customer-insights');
    return response.data;
  },

  broadcast: async (data: {
    subject: string;
    message: string;
    filter?: 'all' | 'recent-customers' | 'high-value';
    recipients?: string[];
  }) => {
    const response = await apiClient.post('/api/v1/admin/broadcast', data);
    return response.data;
  },

  getActivity: async (params?: {
    type?: string;
    userId?: string;
    userEmail?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get('/api/v1/admin/activity', { params });
    return response.data;
  },

  getActivityStats: async () => {
    const response = await apiClient.get('/api/v1/admin/activity/stats');
    return response.data;
  },

  // New Analytics & Forecasting endpoints
  getSalesAnalytics: async (params?: {
    range?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
  }): Promise<SalesAnalytics> => {
    const response = await apiClient.get('/api/v1/admin/analytics/sales', { params });
    return response.data;
  },

  getProductPerformance: async (params?: {
    range?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
  }): Promise<ProductPerformance[]> => {
    const response = await apiClient.get('/api/v1/admin/analytics/products', { params });
    return response.data;
  },

  getInventoryStatus: async (): Promise<InventoryStatus> => {
    const response = await apiClient.get('/api/v1/admin/analytics/inventory');
    return response.data;
  },

  getInventoryForecast: async (params?: {
    days?: number;
    productId?: string;
  }): Promise<InventoryForecast> => {
    const response = await apiClient.get('/api/v1/admin/analytics/forecast', { params });
    return response.data;
  },

  getCustomerMetrics: async (params?: {
    range?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
  }): Promise<CustomerMetrics> => {
    const response = await apiClient.get('/api/v1/admin/analytics/customers', { params });
    return response.data;
  },
};
