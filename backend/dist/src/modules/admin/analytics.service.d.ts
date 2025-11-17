import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics.dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSalesMetrics(query: AnalyticsQueryDto): Promise<{
        summary: {
            totalRevenue: number;
            totalOrders: number;
            averageOrderValue: number;
            totalItems: number;
            currencyBreakdown: Record<string, number>;
        };
        dailySales: {
            date: string;
            revenue: number;
            orders: number;
        }[];
        period: {
            startDate: string;
            endDate: string;
        };
    }>;
    getProductPerformance(query: AnalyticsQueryDto): Promise<{
        product: {
            name: string;
            image: string;
            category: string;
            id: string;
        };
        unitsSold: number;
        orderCount: number;
        revenue: number;
    }[]>;
    getInventoryStatus(): Promise<{
        summary: {
            totalProducts: number;
            inStock: number;
            lowStock: number;
            outOfStock: number;
        };
        inventory: {
            id: string;
            name: string;
            category: string;
            totalStock: number;
            variants: {
                id: string;
                name: string;
                bottleSize: string;
                stock: number;
                status: string;
            }[];
            status: string;
            eventsCount: number;
        }[];
    }>;
    getInventoryForecast(days?: number, productId?: string): Promise<{
        forecastPeriodDays: number;
        lookbackPeriodDays: number;
        forecasts: any[];
    }>;
    getCustomerMetrics(query: AnalyticsQueryDto): Promise<{
        uniqueCustomers: number;
        returningCustomers: number;
        newCustomers: number;
        averageCustomerValue: number;
        retentionRate: number;
    }>;
    private getDailySales;
    private getDateRange;
}
