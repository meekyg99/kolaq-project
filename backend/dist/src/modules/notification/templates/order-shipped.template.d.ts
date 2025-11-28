interface OrderShippedData {
    customerName: string;
    orderNumber: string;
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    estimatedDelivery?: string;
}
export declare function orderShippedTemplate(data: OrderShippedData): string;
export {};
