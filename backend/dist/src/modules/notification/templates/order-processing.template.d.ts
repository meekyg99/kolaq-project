interface OrderProcessingData {
    customerName: string;
    orderNumber: string;
    message?: string;
}
export declare function orderProcessingTemplate(data: OrderProcessingData): string;
export {};
