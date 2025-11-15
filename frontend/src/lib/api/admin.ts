import { apiClient } from './client';

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
};
