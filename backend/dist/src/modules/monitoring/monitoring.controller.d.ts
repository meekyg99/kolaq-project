import { MonitoringService } from './monitoring.service';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    health(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        database: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        uptime: number;
        database: string;
        error: any;
    }>;
    metrics(): Promise<{
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
    status(): Promise<{
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
            status: string;
            timestamp: string;
            uptime: number;
            database: string;
            error?: undefined;
        } | {
            status: string;
            timestamp: string;
            uptime: number;
            database: string;
            error: any;
        };
    }>;
}
