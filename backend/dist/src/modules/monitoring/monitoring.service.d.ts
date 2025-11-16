import { PrismaService } from '../prisma/prisma.service';
export declare class MonitoringService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    healthCheck(): Promise<{
        databaseError: any;
        status: string;
        timestamp: string;
        uptime: number;
        database: string;
    }>;
    getMetrics(): Promise<{
        timestamp: string;
        process: {
            uptime: number;
            pid: number;
            memory: {
                rss: string;
                heapTotal: string;
                heapUsed: string;
                external: string;
            };
            cpu: {
                user: string;
                system: string;
            };
        };
        database: {
            products: number;
            orders: number;
            adminUsers: number;
            carts: number;
        };
    }>;
    getSystemStatus(): Promise<{
        timestamp: string;
        system: {
            platform: NodeJS.Platform;
            arch: string;
            nodeVersion: string;
            uptime: number;
            loadAverage: string[];
            memory: {
                total: string;
                free: string;
                used: string;
                usagePercent: string;
            };
            cpu: {
                count: number;
                model: string;
            };
        };
        application: {
            databaseError: any;
            status: string;
            timestamp: string;
            uptime: number;
            database: string;
        };
    }>;
}
