interface LowStockProduct {
    name: string;
    currentStock: number;
    threshold: number;
    sku?: string;
}
interface LowStockAlertData {
    products: LowStockProduct[];
}
export declare function lowStockAlertTemplate(data: LowStockAlertData): string;
export {};
