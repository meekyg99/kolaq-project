import { Queue } from 'bullmq';
export declare class InventoryScheduler {
    private inventoryQueue;
    private readonly logger;
    constructor(inventoryQueue: Queue);
    scheduleInventoryReconciliation(): Promise<void>;
    scheduleLowStockCheck(): Promise<void>;
}
