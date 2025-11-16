import { Job } from 'bullmq';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { Queue } from 'bullmq';
export interface InventoryReconciliationJob {
    productId?: string;
    checkLowStock?: boolean;
    threshold?: number;
}
export interface InventoryStockLevel {
    productId: string;
    productName: string;
    currentStock: number;
    status: 'ok' | 'low' | 'out_of_stock';
}
export declare class InventoryProcessor {
    private prisma;
    private emailQueue;
    private readonly logger;
    constructor(prisma: PrismaService, emailQueue: Queue);
    handleReconciliation(job: Job<InventoryReconciliationJob>): Promise<InventoryStockLevel[]>;
    private sendReconciliationReport;
    handleLowStockCheck(job: Job): Promise<void>;
}
