export declare function orderConfirmationTemplate(data: {
    customerName: string;
    orderNumber: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    shippingCost: number;
    total: number;
    currency: string;
    shippingAddress: string;
}): string;
