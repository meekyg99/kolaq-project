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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const analytics_service_1 = require("./analytics.service");
const broadcast_notification_dto_1 = require("./dto/broadcast-notification.dto");
const query_activity_dto_1 = require("./dto/query-activity.dto");
const analytics_dto_1 = require("./dto/analytics.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let AdminController = class AdminController {
    constructor(adminService, analyticsService) {
        this.adminService = adminService;
        this.analyticsService = analyticsService;
    }
    getDashboard() {
        return this.adminService.getDashboardStats();
    }
    getAnalytics(days) {
        const numDays = days ? parseInt(days, 10) : 30;
        return this.adminService.getAnalytics(numDays);
    }
    getTopProducts(limit) {
        const numLimit = limit ? parseInt(limit, 10) : 10;
        return this.adminService.getTopProducts(numLimit);
    }
    getCustomerInsights() {
        return this.adminService.getCustomerInsights();
    }
    broadcast(dto) {
        return this.adminService.broadcastNotification(dto);
    }
    getActivity(query) {
        return this.adminService.getActivityLogs(query);
    }
    getActivityStats() {
        return this.adminService.getActivityStats();
    }
    logActivity(data, req) {
        const user = req.user;
        return this.adminService.logActivity({
            ...data,
            userId: user?.id,
            userEmail: user?.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
    }
    getSalesMetrics(query) {
        return this.analyticsService.getSalesMetrics(query);
    }
    getProductPerformance(query) {
        return this.analyticsService.getProductPerformance(query);
    }
    getInventoryStatus() {
        return this.analyticsService.getInventoryStatus();
    }
    getInventoryForecast(query) {
        return this.analyticsService.getInventoryForecast(query.days, query.productId);
    }
    getCustomerMetrics(query) {
        return this.analyticsService.getCustomerMetrics(query);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('top-products'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTopProducts", null);
__decorate([
    (0, common_1.Get)('customer-insights'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCustomerInsights", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [broadcast_notification_dto_1.BroadcastNotificationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Get)('activity'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_activity_dto_1.QueryActivityDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Get)('activity/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getActivityStats", null);
__decorate([
    (0, common_1.Post)('activity/log'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "logActivity", null);
__decorate([
    (0, common_1.Get)('analytics/sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales metrics and revenue data' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSalesMetrics", null);
__decorate([
    (0, common_1.Get)('analytics/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product performance metrics' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getProductPerformance", null);
__decorate([
    (0, common_1.Get)('analytics/inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory status and stock levels' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getInventoryStatus", null);
__decorate([
    (0, common_1.Get)('analytics/forecast'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory forecast and reorder recommendations' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.ForecastQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getInventoryForecast", null);
__decorate([
    (0, common_1.Get)('analytics/customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer acquisition and retention metrics' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCustomerMetrics", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('api/v1/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        analytics_service_1.AnalyticsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map