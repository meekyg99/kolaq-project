import { PrismaService } from '../prisma/prisma.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
export declare class InventoryService {
    private readonly prisma;
    private readonly logger;
    private readonly LOW_STOCK_THRESHOLD;
    constructor(prisma: PrismaService);
    adjustInventory(adjustInventoryDto: AdjustInventoryDto): Promise<{
        event: {
            product: {
                slug: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            delta: number;
            reason: string;
            actorEmail: string | null;
        };
        previousStock: number;
        newStock: number;
        lowStockAlert: boolean;
    }>;
    getCurrentStock(productId: string): Promise<number>;
    getInventoryHistory(query: QueryInventoryDto): Promise<{
        events: ({
            product: {
                slug: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            delta: number;
            reason: string;
            actorEmail: string | null;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getProductInventory(productId: string): Promise<{
        product: {
            id: string;
            name: string;
            slug: string;
        };
        currentStock: number;
        lowStockAlert: boolean;
        recentEvents: {
            id: string;
            createdAt: Date;
            productId: string;
            delta: number;
            reason: string;
            actorEmail: string | null;
        }[];
    }>;
    getLowStockProducts(): Promise<any[]>;
    getInventorySummary(): Promise<{
        totalProducts: number;
        totalStock: number;
        lowStockCount: number;
        outOfStockCount: number;
        lowStockThreshold: number;
    }>;
}
