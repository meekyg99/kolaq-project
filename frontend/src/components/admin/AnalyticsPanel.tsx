'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Package, Users, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import { adminApi, type SalesAnalytics, type ProductPerformance, type InventoryForecast, type CustomerMetrics, type InventoryStatus } from '@/lib/api/admin';
import { formatCurrency } from '@/lib/currency';

type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

export function AnalyticsPanel() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics | null>(null);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null);
  const [forecast, setForecast] = useState<InventoryForecast | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [sales, products, customers, inventory, forecastData] = await Promise.all([
        adminApi.getSalesAnalytics({ range: timeRange }),
        adminApi.getProductPerformance({ range: timeRange }),
        adminApi.getCustomerMetrics({ range: timeRange }),
        adminApi.getInventoryStatus(),
        adminApi.getInventoryForecast({ days: 30 }),
      ]);
      setSalesData(sales);
      setProductPerformance(products);
      setCustomerMetrics(customers);
      setInventoryStatus(inventory);
      setForecast(forecastData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const needsReorder = forecast?.forecasts.filter(f => f.needsReorder) || [];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analytics & Forecasting</h2>
          <p className="text-sm text-gray-600">Business insights and inventory predictions</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'quarter', 'year'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Metrics */}
      {salesData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(salesData.summary.totalRevenue, 'NGN')}
            subtitle={`${formatCurrency(salesData.summary.currencyBreakdown.USD, 'USD')} USD`}
            trend="up"
          />
          <MetricCard
            icon={Package}
            title="Total Orders"
            value={salesData.summary.totalOrders.toString()}
            subtitle={`${salesData.summary.totalItems} items`}
            trend="up"
          />
          <MetricCard
            icon={TrendingUp}
            title="Avg Order Value"
            value={formatCurrency(salesData.summary.averageOrderValue, 'NGN')}
            trend="neutral"
          />
          {customerMetrics && (
            <MetricCard
              icon={Users}
              title="Customers"
              value={customerMetrics.uniqueCustomers.toString()}
              subtitle={`${customerMetrics.retentionRate.toFixed(1)}% retention`}
              trend="up"
            />
          )}
        </div>
      )}

      {/* Inventory Alerts */}
      {inventoryStatus && (inventoryStatus.summary.lowStock > 0 || inventoryStatus.summary.outOfStock > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Inventory Alerts</h3>
              <p className="text-sm text-yellow-800 mt-1">
                {inventoryStatus.summary.outOfStock > 0 && (
                  <span className="font-medium">{inventoryStatus.summary.outOfStock} products out of stock. </span>
                )}
                {inventoryStatus.summary.lowStock > 0 && (
                  <span>{inventoryStatus.summary.lowStock} products running low.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Recommendations */}
      {needsReorder.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reorder Recommendations</h3>
          <div className="space-y-3">
            {needsReorder.slice(0, 5).map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-600">
                    Current stock: {item.currentStock} units • 
                    Avg daily sales: {item.dailyAverageSales.toFixed(1)} • 
                    {item.projectedStockoutDays && (
                      <span className="text-red-600 font-medium"> Stockout in {item.projectedStockoutDays} days</span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Recommended order</p>
                  <p className="text-lg font-semibold text-red-600">{item.recommendedOrderQuantity} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {productPerformance.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-3">
            {productPerformance.slice(0, 10).map((product, index) => (
              <div key={product.product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-600 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                <img
                  src={product.product.image || '/placeholder.png'}
                  alt={product.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.product.name}</p>
                  <p className="text-sm text-gray-600">{product.unitsSold} units sold • {product.orderCount} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue, 'NGN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Sales Chart (Simple) */}
      {salesData && salesData.dailySales.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="space-y-2">
            {salesData.dailySales.slice(-7).map((day) => {
              const maxRevenue = Math.max(...salesData.dailySales.map(d => d.revenue));
              const width = (day.revenue / maxRevenue) * 100;
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-amber-600 flex items-center justify-end px-2"
                      style={{ width: `${width}%` }}
                    >
                      {width > 20 && (
                        <span className="text-xs font-medium text-white">{formatCurrency(day.revenue, 'NGN')}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">{day.orders} orders</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Metrics */}
      {customerMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">New Customers</p>
            <p className="text-2xl font-semibold text-gray-900">{customerMetrics.newCustomers}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Returning Customers</p>
            <p className="text-2xl font-semibold text-gray-900">{customerMetrics.returningCustomers}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Avg Customer Value</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(customerMetrics.averageCustomerValue, 'NGN')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Icon className="w-5 h-5 text-amber-600" />
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`p-1 rounded ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
