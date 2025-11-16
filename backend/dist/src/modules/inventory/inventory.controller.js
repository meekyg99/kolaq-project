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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const adjust_inventory_dto_1 = require("./dto/adjust-inventory.dto");
const query_inventory_dto_1 = require("./dto/query-inventory.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
let InventoryController = class InventoryController {
    constructor(inventoryService, inventoryQueue) {
        this.inventoryService = inventoryService;
        this.inventoryQueue = inventoryQueue;
    }
    adjustInventory(adjustInventoryDto) {
        return this.inventoryService.adjustInventory(adjustInventoryDto);
    }
    getHistory(query) {
        return this.inventoryService.getInventoryHistory(query);
    }
    getSummary() {
        return this.inventoryService.getInventorySummary();
    }
    getLowStock() {
        return this.inventoryService.getLowStockProducts();
    }
    getProductInventory(productId) {
        return this.inventoryService.getProductInventory(productId);
    }
    async triggerReconciliation(body) {
        const job = await this.inventoryQueue.add('reconcile', {
            productId: body.productId,
            threshold: body.threshold || 10,
        });
        return {
            message: 'Inventory reconciliation job queued',
            jobId: job.id,
            productId: body.productId || 'all',
        };
    }
    async triggerLowStockCheck() {
        const job = await this.inventoryQueue.add('low-stock-check', {});
        return {
            message: 'Low stock check job queued',
            jobId: job.id,
        };
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('adjust'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [adjust_inventory_dto_1.AdjustInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustInventory", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inventory_dto_1.QueryInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProductInventory", null);
__decorate([
    (0, common_1.Post)('reconcile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "triggerReconciliation", null);
__decorate([
    (0, common_1.Post)('check-low-stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "triggerLowStockCheck", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('api/v1/inventory'),
    __param(1, (0, bull_1.InjectQueue)('inventory')),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService,
        bullmq_1.Queue])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map