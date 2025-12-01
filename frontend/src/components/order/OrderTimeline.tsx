'use client';

import { CheckCircle, Clock, Package, Truck, Home, XCircle, Ban } from 'lucide-react';

interface StatusHistoryItem {
  id: string;
  status: string;
  note?: string;
  createdAt: string;
}

interface OrderTimelineProps {
  statusHistory: StatusHistoryItem[];
  currentStatus: string;
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  PENDING: { label: 'Order Received', icon: Clock, color: 'text-gray-500' },
  PAYMENT_PENDING: { label: 'Awaiting Payment', icon: Clock, color: 'text-yellow-600' },
  PAID: { label: 'Payment Confirmed', icon: CheckCircle, color: 'text-green-600' },
  PROCESSING: { label: 'Processing Order', icon: Package, color: 'text-blue-600' },
  READY_FOR_DISPATCH: { label: 'Ready to Ship', icon: Package, color: 'text-blue-700' },
  DISPATCHED: { label: 'Dispatched', icon: Truck, color: 'text-indigo-600' },
  IN_TRANSIT: { label: 'In Transit', icon: Truck, color: 'text-purple-600' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: Truck, color: 'text-orange-600' },
  DELIVERED: { label: 'Delivered', icon: Home, color: 'text-green-700' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
  REFUNDED: { label: 'Refunded', icon: Ban, color: 'text-gray-600' },
  FAILED: { label: 'Delivery Failed', icon: XCircle, color: 'text-red-700' },
};

export function OrderTimeline({ statusHistory, currentStatus }: OrderTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {/* Timeline items */}
        <div className="space-y-6">
          {statusHistory.map((history, index) => {
            const config = statusConfig[history.status] || statusConfig.PENDING;
            const Icon = config.icon;
            const isCurrent = history.status === currentStatus;
            
            return (
              <div key={history.id} className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white ${
                    isCurrent ? 'border-[#1a4d2e] ring-4 ring-[#1a4d2e]/10' : 'border-gray-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isCurrent ? 'text-[#1a4d2e]' : config.color}`} />
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-[#1a4d2e]' : 'text-gray-900'}`}>
                        {config.label}
                        {isCurrent && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-[#1a4d2e] px-2 py-0.5 text-xs font-medium text-white">
                            Current
                          </span>
                        )}
                      </p>
                      {history.note && <p className="mt-1 text-sm text-gray-600">{history.note}</p>}
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(history.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
