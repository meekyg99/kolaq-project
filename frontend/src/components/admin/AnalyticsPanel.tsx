'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Package, Users, DollarSign, AlertTriangle, RefreshCw, Download, BarChart3, MapPin } from 'lucide-react';
import { adminApi, type SalesAnalytics, type ProductPerformance, type InventoryForecast, type CustomerMetrics, type InventoryStatus } from '@/lib/api/admin';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

export function AnalyticsPanel() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics | null>(null);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null);
  const [forecast, setForecast] = useState<InventoryForecast | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

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
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = () => {
    try {
      const data = {
        timeRange,
        generatedAt: new Date().toISOString(),
        sales: salesData,
        products: productPerformance,
        customers: customerMetrics,
        inventory: inventoryStatus,
        forecast: forecast,
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kolaq-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Analytics data exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAnalytics();
      }, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

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
          <h2 className="text-2xl font-semibold text-slate-900">Analytics & Forecasting</h2>
          <p className="text-sm text-slate-600">Business insights and inventory predictions</p>
          {salesData && (
            <p className="text-xs text-slate-400 mt-1">
              Period: {new Date(salesData.period.startDate).toLocaleDateString()} - {new Date(salesData.period.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            {(['today', 'week', 'month', 'quarter', 'year'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  timeRange === range
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          >
            Auto {autoRefresh ? '✓' : '○'}
          </button>
          <button
            onClick={exportAnalytics}
            className="px-3 py-1.5 rounded-full bg-[var(--accent)] text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Export analytics data"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
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
            subtitle={`${(salesData.summary.totalRevenue / salesData.summary.totalItems).toFixed(0)} per item`}
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
        <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-[14px]">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                Inventory Alerts
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                  {inventoryStatus.summary.outOfStock + inventoryStatus.summary.lowStock}
                </span>
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                {inventoryStatus.summary.outOfStock > 0 && (
                  <span className="font-medium">{inventoryStatus.summary.outOfStock} products out of stock. </span>
                )}
                {inventoryStatus.summary.lowStock > 0 && (
                  <span>{inventoryStatus.summary.lowStock} products running low.</span>
                )}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-white rounded-[12px]">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">In Stock</p>
                  <p className="text-lg font-semibold text-green-600">{inventoryStatus.summary.inStock}</p>
                </div>
                <div className="text-center p-2 bg-white rounded-[12px]">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Low Stock</p>
                  <p className="text-lg font-semibold text-amber-600">{inventoryStatus.summary.lowStock}</p>
                </div>
                <div className="text-center p-2 bg-white rounded-[12px]">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Out</p>
                  <p className="text-lg font-semibold text-red-600">{inventoryStatus.summary.outOfStock}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Recommendations */}
      {needsReorder.length > 0 && (
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              Reorder Recommendations
              <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                {needsReorder.length}
              </span>
            </h3>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Urgent</span>
          </div>
          <div className="space-y-3">
            {needsReorder.slice(0, 5).map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-4 bg-red-50 rounded-[18px] border border-red-200">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.productName}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      Stock: <strong>{item.currentStock}</strong>
                    </span>
                    <span>•</span>
                    <span>Daily avg: <strong>{item.dailyAverageSales.toFixed(1)}</strong></span>
                    {item.projectedStockoutDays !== null && (
                      <>
                        <span>•</span>
                        <span className="text-red-600 font-semibold">
                          ⚠️ Stockout in {item.projectedStockoutDays} days
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Order</p>
                  <p className="text-2xl font-bold text-red-600">{item.recommendedOrderQuantity}</p>
                  <p className="text-xs text-slate-500">units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {productPerformance.length > 0 && (
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Performing Products
          </h3>
          <div className="space-y-2">
            {productPerformance.slice(0, 10).map((product, index) => {
              const maxRevenue = Math.max(...productPerformance.map(p => p.revenue));
              const revenuePercentage = (product.revenue / maxRevenue) * 100;
              return (
                <div key={product.product.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-[18px] transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center justify-center w-8 h-8 bg-[var(--accent)] text-white rounded-full font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <img
                    src={product.product.image || '/images/products/essence-bitter.jpg'}
                    alt={product.product.name}
                    className="w-12 h-12 object-cover rounded-[12px] border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{product.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 uppercase tracking-[0.3em]">{product.product.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600">{product.unitsSold} units • {product.orderCount} orders</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                        style={{ width: `${revenuePercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-900">{formatCurrency(product.revenue, 'NGN')}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(product.revenue / product.unitsSold, 'NGN')}/unit</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Sales Chart (Simple) */}
      {salesData && salesData.dailySales.length > 0 && (
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--accent)]" />
              Sales Trend
            </h3>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {salesData.dailySales.slice(-7).map((day) => {
              const maxRevenue = Math.max(...salesData.dailySales.map(d => d.revenue));
              const width = Math.max((day.revenue / maxRevenue) * 100, 2);
              const dayOfWeek = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              const isToday = new Date(day.date).toDateString() === new Date().toDateString();
              return (
                <div key={day.date} className={`flex items-center gap-4 p-2 rounded-[14px] ${isToday ? 'bg-amber-50 border border-amber-200' : ''}`}>
                  <div className="w-24 text-sm">
                    <p className="font-semibold text-slate-900">{dayOfWeek}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-1 h-10 bg-slate-100 rounded-[12px] overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-amber-600 flex items-center justify-end px-3 transition-all duration-300"
                      style={{ width: `${width}%` }}
                    >
                      {width > 25 && (
                        <span className="text-xs font-semibold text-white">{formatCurrency(day.revenue, 'NGN')}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <p className="text-sm font-semibold text-slate-900">{day.orders}</p>
                    <p className="text-xs text-slate-500">orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Metrics */}
      {customerMetrics && (
        <div className="bg-white rounded-[24px] border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-[18px]">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-1">Total Customers</p>
              <p className="text-2xl font-semibold text-slate-900">{customerMetrics.uniqueCustomers}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-[18px]">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 mb-1">New Customers</p>
              <p className="text-2xl font-semibold text-emerald-900">{customerMetrics.newCustomers}</p>
              <p className="text-xs text-emerald-600 mt-1">
                {((customerMetrics.newCustomers / customerMetrics.uniqueCustomers) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-[18px]">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-600 mb-1">Returning</p>
              <p className="text-2xl font-semibold text-blue-900">{customerMetrics.returningCustomers}</p>
              <p className="text-xs text-blue-600 mt-1">{customerMetrics.retentionRate.toFixed(1)}% retention rate</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-[18px]">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600 mb-1">Avg Value</p>
              <p className="text-2xl font-semibold text-amber-900">{formatCurrency(customerMetrics.averageCustomerValue, 'NGN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Growth Summary */}
        {salesData && salesData.dailySales.length > 1 && (
          <div className="bg-white rounded-[24px] border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Growth Trends
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[18px]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Daily Avg Revenue</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(
                      salesData.dailySales.reduce((sum, d) => sum + d.revenue, 0) / salesData.dailySales.length,
                      'NGN'
                    )}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[18px]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Daily Avg Orders</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {(salesData.dailySales.reduce((sum, d) => sum + d.orders, 0) / salesData.dailySales.length).toFixed(1)}
                  </p>
                </div>
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-[18px]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Items per Order</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {(salesData.summary.totalItems / salesData.summary.totalOrders).toFixed(1)}
                  </p>
                </div>
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        )}

        {/* Revenue Distribution */}
        {salesData && (
          <div className="bg-white rounded-[24px] border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Naira (₦)</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(salesData.summary.currencyBreakdown.NGN, 'NGN')}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{
                      width: `${(salesData.summary.currencyBreakdown.NGN / salesData.summary.totalRevenue) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {((salesData.summary.currencyBreakdown.NGN / salesData.summary.totalRevenue) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">USD ($)</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(salesData.summary.currencyBreakdown.USD, 'USD')}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(salesData.summary.currencyBreakdown.USD / (salesData.summary.currencyBreakdown.USD + salesData.summary.currencyBreakdown.NGN / 1500)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">International sales</p>
              </div>
            </div>
          </div>
        )}
      </div>
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
    <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-amber-100 rounded-[14px]">
          <Icon className="w-5 h-5 text-amber-600" />
        </div>
        {trend && trend !== 'neutral' && (
          <div className={`p-1.5 rounded-[10px] ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-sm text-slate-600 mt-2">{subtitle}</p>}
    </div>
  );
}
