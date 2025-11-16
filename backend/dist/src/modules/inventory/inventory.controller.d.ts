import { InventoryService } from './inventory.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { Queue } from 'bullmq';
export declare class InventoryController {
    private readonly inventoryService;
    private inventoryQueue;
    constructor(inventoryService: InventoryService, inventoryQueue: Queue);
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
    getHistory(query: QueryInventoryDto): Promise<{
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
    getSummary(): Promise<{
        totalProducts: number;
        totalStock: number;
        lowStockCount: number;
        outOfStockCount: number;
        lowStockThreshold: number;
    }>;
    getLowStock(): Promise<any[]>;
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
    triggerReconciliation(body: {
        productId?: string;
        threshold?: number;
    }): Promise<{
        message: string;
        jobId: string;
        productId: string;
    }>;
    triggerLowStockCheck(): Promise<{
        message: string;
        jobId: string;
    }>;
}
