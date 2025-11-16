import { Job } from 'bullmq';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { Queue } from 'bullmq';
export interface InventoryReconciliationJob {
    productId?: string;
    checkLowStock?: boolean;
}
export declare class InventoryProcessor {
    private prisma;
    private emailQueue;
    private readonly logger;
    constructor(prisma: PrismaService, emailQueue: Queue);
    handleReconciliation(job: Job<InventoryReconciliationJob>): Promise<void>;
    handleLowStockCheck(job: Job): Promise<void>;
}
