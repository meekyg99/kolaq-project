"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InventoryScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
let InventoryScheduler = InventoryScheduler_1 = class InventoryScheduler {
    constructor(inventoryQueue) {
        this.inventoryQueue = inventoryQueue;
        this.logger = new common_1.Logger(InventoryScheduler_1.name);
    }
    async scheduleInventoryReconciliation() {
        this.logger.log('Scheduling daily inventory reconciliation');
        await this.inventoryQueue.add('reconcile', {
            checkLowStock: true,
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });
    }
    async scheduleLowStockCheck() {
        this.logger.log('Scheduling daily low stock check');
        await this.inventoryQueue.add('low-stock-check', {}, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });
    }
};
exports.InventoryScheduler = InventoryScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryScheduler.prototype, "scheduleInventoryReconciliation", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryScheduler.prototype, "scheduleLowStockCheck", null);
exports.InventoryScheduler = InventoryScheduler = InventoryScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('inventory')),
    __metadata("design:paramtypes", [bullmq_1.Queue])
], InventoryScheduler);
//# sourceMappingURL=inventory.scheduler.js.map