import { AdminService } from './admin.service';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        overview: {
            totalProducts: number;
            totalVariants: number;
            activeVariants: number;
            totalOrders: number;
            totalCustomers: number;
            revenue: {
                NGN: number;
                USD: number;
            };
            ordersLast30Days: number;
            ordersLast7Days: number;
        };
        recentOrders: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: import("@prisma/client/runtime/library").Decimal;
            customerName: string;
            orderNumber: string;
        }[];
        lowStockProducts: any[];
        lowStockVariants: {
            name: string;
            id: string;
            product: {
                slug: string;
                name: string;
                id: string;
            };
            sku: string;
            bottleSize: string;
            stock: number;
        }[];
        notifications: {
            totalNotifications: number;
            sentNotifications: number;
            failedNotifications: number;
            pendingNotifications: number;
            byType: {
                email: number;
                sms: number;
                whatsapp: number;
            };
            successRate: string;
        };
    }>;
    getAnalytics(days?: string): Promise<{
        period: string;
        dailyStats: unknown[];
        summary: {
            totalOrders: number;
            totalRevenue: {
                NGN: number;
                USD: number;
            };
            averageOrderValue: {
                NGN: number;
                USD: number;
            };
        };
    }>;
    getTopProducts(limit?: string): Promise<{
        totalQuantitySold: number;
        totalOrders: number;
        slug: string;
        name: string;
        category: string;
        id: string;
    }[]>;
    getCustomerInsights(): Promise<{
        totalCustomers: number;
        topCustomers: unknown[];
        repeatCustomers: number;
        repeatRate: string;
    }>;
    broadcast(dto: BroadcastNotificationDto): Promise<{
        totalRecipients: number;
        successful: number;
        failed: number;
        recipients: string[];
    }>;
    getActivity(query: QueryActivityDto): Promise<{
        logs: {
            description: string | null;
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.ActivityType;
            userId: string | null;
            userEmail: string | null;
            action: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getActivityStats(): Promise<{
        totalActivities: number;
        todayActivities: number;
        byType: {};
        recentActivities: {
            description: string | null;
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.ActivityType;
            userId: string | null;
            userEmail: string | null;
            action: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
    }>;
    logActivity(data: any, req: any): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ActivityType;
        userId: string | null;
        userEmail: string | null;
        action: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
