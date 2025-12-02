'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  RefreshCcw,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Mail,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Send,
  RotateCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

export type OrderStatus = 
  | 'PENDING' 
  | 'PAYMENT_PENDING' 
  | 'PAID' 
  | 'PROCESSING' 
  | 'READY_FOR_DISPATCH' 
  | 'DISPATCHED' 
  | 'IN_TRANSIT' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'FAILED';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceNGN: number;
  priceUSD: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  status: OrderStatus;
  totalNGN: number;
  totalUSD: number;
  currency: string;
  paymentRef?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    phone?: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Clock },
  PAYMENT_PENDING: { label: 'Payment Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
  PAID: { label: 'Paid', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  PROCESSING: { label: 'Processing', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Package },
  READY_FOR_DISPATCH: { label: 'Ready to Ship', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Package },
  DISPATCHED: { label: 'Dispatched', color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: Truck },
  IN_TRANSIT: { label: 'In Transit', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
  REFUNDED: { label: 'Refunded', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: RefreshCcw },
  FAILED: { label: 'Failed', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAYMENT_PENDING', 'PAID', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['READY_FOR_DISPATCH', 'CANCELLED', 'REFUNDED'],
  READY_FOR_DISPATCH: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: ['REFUNDED'],
  REFUNDED: [],
  FAILED: ['REFUNDED', 'OUT_FOR_DELIVERY'], // Can retry or refund
};

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '' as OrderStatus,
    trackingNumber: '',
    trackingUrl: '',
    carrier: '',
    estimatedDelivery: '',
  });
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [syncingShipment, setSyncingShipment] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/v1/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !updateData.status) return;

    setIsUpdating(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');

      const payload: Record<string, any> = { status: updateData.status };
      
      if (updateData.status === 'DISPATCHED' || updateData.status === 'IN_TRANSIT') {
        if (updateData.trackingNumber) payload.trackingNumber = updateData.trackingNumber;
        if (updateData.trackingUrl) payload.trackingUrl = updateData.trackingUrl;
        if (updateData.carrier) payload.carrier = updateData.carrier;
        if (updateData.estimatedDelivery) payload.estimatedDelivery = updateData.estimatedDelivery;
      }

      const response = await fetch(`${API_URL}/api/v1/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order');
      }

      toast.success(`Order status updated to ${updateData.status}. Email notification sent to customer.`);
      setShowUpdateModal(false);
      setSelectedOrder(null);
      setUpdateData({
        status: '' as OrderStatus,
        trackingNumber: '',
        trackingUrl: '',
        carrier: '',
        estimatedDelivery: '',
      });
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateShipment = async (orderId: string) => {
    setCreatingShipment(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/create-shipment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create shipment');
      }

      const updatedOrder = await response.json();
      toast.success('Shipment created successfully! Tracking details added and customer notified.');
      
      // Update selected order if it's being viewed
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      
      fetchOrders();
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast.error(error.message || 'Failed to create shipment');
    } finally {
      setCreatingShipment(false);
    }
  };

  const handleSyncShipment = async (orderId: string) => {
    setSyncingShipment(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/sync-shipment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sync shipment');
      }

      const result = await response.json();
      toast.success(`Shipment synced! Status: ${result.status}`);
      
      fetchOrders();
    } catch (error: any) {
      console.error('Error syncing shipment:', error);
      toast.error(error.message || 'Failed to sync shipment');
    } finally {
      setSyncingShipment(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: '' as OrderStatus,
      trackingNumber: order.trackingNumber || '',
      trackingUrl: order.trackingUrl || '',
      carrier: order.carrier || '',
      estimatedDelivery: order.estimatedDelivery || '',
    });
    setShowUpdateModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[var(--accent)]" />
          <p className="text-sm text-slate-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Order Management</h2>
          <p className="text-sm text-slate-600">{orders.length} total orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm outline-none transition focus:border-[var(--accent)]"
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">No orders found</h3>
          <p className="mt-2 text-sm text-slate-500">
            {searchQuery || statusFilter !== 'ALL' ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">Order</th>
                <th className="px-4 py-3 font-medium text-slate-600">Customer</th>
                <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Total</th>
                <th className="px-4 py-3 font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const allowedTransitions = statusTransitions[order.status];
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">#{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">{order.items.length} items</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusConfig[order.status].bgColor} ${statusConfig[order.status].color}`}>
                        <StatusIcon size={12} />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">
                        {formatCurrency(order.currency === 'USD' ? order.totalUSD : order.totalNGN, order.currency as 'NGN' | 'USD')}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {allowedTransitions.length > 0 && (
                          <button
                            onClick={() => openUpdateModal(order)}
                            className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800"
                          >
                            Update Status
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Panel */}
      {selectedOrder && !showUpdateModal && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Order #{selectedOrder.orderNumber}</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Info */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-slate-900">
                <User size={16} /> Customer Information
              </h4>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{selectedOrder.user?.name}</p>
                <p className="text-sm text-slate-600">{selectedOrder.user?.email}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-slate-900">
                <MapPin size={16} /> Shipping Address
              </h4>
              <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
                {selectedOrder.shippingAddress.postalCode && <p>Postal: {selectedOrder.shippingAddress.postalCode}</p>}
                {selectedOrder.shippingAddress.phone && <p>Phone: {selectedOrder.shippingAddress.phone}</p>}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="flex items-center gap-2 font-medium text-slate-900">
                <Package size={16} /> Order Items
              </h4>
              <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-slate-900">
                      {formatCurrency(selectedOrder.currency === 'USD' ? item.priceUSD : item.priceNGN, selectedOrder.currency as 'NGN' | 'USD')}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Total</p>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(selectedOrder.currency === 'USD' ? selectedOrder.totalUSD : selectedOrder.totalNGN, selectedOrder.currency as 'NGN' | 'USD')}
                  </p>
                </div>
              </div>
            </div>

            {/* Logistics & Shipment Section */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-medium text-slate-900">
                  <Truck size={16} /> Logistics & Shipment
                </h4>
                <div className="flex items-center gap-2">
                  {/* Create Shipment Button */}
                  {selectedOrder.status === 'READY_FOR_DISPATCH' && !selectedOrder.trackingNumber && (
                    <button
                      onClick={() => handleCreateShipment(selectedOrder.id)}
                      disabled={creatingShipment}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send size={16} />
                      {creatingShipment ? 'Creating...' : 'Create Shipment with GIG'}
                    </button>
                  )}
                  {/* Sync Shipment Button */}
                  {selectedOrder.trackingNumber && (
                    <button
                      onClick={() => handleSyncShipment(selectedOrder.id)}
                      disabled={syncingShipment}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:opacity-50"
                    >
                      <RotateCw size={16} className={syncingShipment ? 'animate-spin' : ''} />
                      {syncingShipment ? 'Syncing...' : 'Sync Status'}
                    </button>
                  )}
                </div>
              </div>

              {/* Tracking Info Display */}
              {selectedOrder.trackingNumber ? (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-blue-700">Carrier</p>
                      <p className="font-medium text-blue-900">{selectedOrder.carrier || 'GIG Logistics'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Tracking Number</p>
                      <p className="font-mono font-medium text-blue-900">{selectedOrder.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Est. Delivery</p>
                      <p className="font-medium text-blue-900">
                        {selectedOrder.estimatedDelivery 
                          ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.trackingUrl && (
                    <a
                      href={selectedOrder.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      <Truck size={16} />
                      Track with {selectedOrder.carrier || 'GIG Logistics'} →
                    </a>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                  <Package className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-700">No shipment created yet</p>
                  <p className="text-xs text-slate-500">
                    {selectedOrder.status === 'READY_FOR_DISPATCH' 
                      ? 'Order is ready - click "Create Shipment" to send with GIG Logistics'
                      : `Update order status to "Ready to Ship" before creating shipment`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Update Order #{selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedOrder(null);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Status */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Current Status</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusConfig[selectedOrder.status].bgColor} ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>

              {/* New Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as OrderStatus })}
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[var(--accent)]"
                >
                  <option value="">Select new status...</option>
                  {statusTransitions[selectedOrder.status].map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Details (when status is DISPATCHED or IN_TRANSIT) */}
              {(updateData.status === 'DISPATCHED' || updateData.status === 'IN_TRANSIT' || updateData.status === 'OUT_FOR_DELIVERY') && (
                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-medium text-slate-900">Shipping Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-slate-600">Carrier</label>
                      <input
                        type="text"
                        value={updateData.carrier}
                        onChange={(e) => setUpdateData({ ...updateData, carrier: e.target.value })}
                        placeholder="e.g., DHL, FedEx"
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-600">Tracking Number</label>
                      <input
                        type="text"
                        value={updateData.trackingNumber}
                        onChange={(e) => setUpdateData({ ...updateData, trackingNumber: e.target.value })}
                        placeholder="Enter tracking number"
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-600">Tracking URL</label>
                      <input
                        type="url"
                        value={updateData.trackingUrl}
                        onChange={(e) => setUpdateData({ ...updateData, trackingUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-600">Estimated Delivery</label>
                      <input
                        type="date"
                        value={updateData.estimatedDelivery}
                        onChange={(e) => setUpdateData({ ...updateData, estimatedDelivery: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Notification Notice */}
              <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
                <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Email Notification</p>
                  <p className="text-xs text-blue-700">
                    An email will be automatically sent to the customer notifying them of this status change.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedOrder(null);
                  }}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={!updateData.status || isUpdating}
                  className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}