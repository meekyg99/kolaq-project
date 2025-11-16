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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const env_validation_1 = require("./config/env.validation");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const catalog_module_1 = require("./modules/catalog/catalog.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const cart_module_1 = require("./modules/cart/cart.module");
const order_module_1 = require("./modules/order/order.module");
const notification_module_1 = require("./modules/notification/notification.module");
const admin_module_1 = require("./modules/admin/admin.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const order_service_1 = require("./modules/order/order.service");
const notification_service_1 = require("./modules/notification/notification.service");
const activity_module_1 = require("./modules/activity/activity.module");
const orders_module_1 = require("./modules/orders/orders.module");
const jobs_module_1 = require("./jobs/jobs.module");
let AppModule = class AppModule {
    constructor(orderService, notificationService) {
        this.orderService = orderService;
        this.notificationService = notificationService;
    }
    onModuleInit() {
        this.orderService.setNotificationService(this.notificationService);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: ['.env.local', '.env'],
                validate: env_validation_1.validateEnv,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 10,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 50,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            catalog_module_1.CatalogModule,
            inventory_module_1.InventoryModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            notification_module_1.NotificationModule,
            admin_module_1.AdminModule,
            activity_module_1.ActivityModule,
            orders_module_1.OrdersModule,
            jobs_module_1.JobsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    }),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        notification_service_1.NotificationService])
], AppModule);
//# sourceMappingURL=app.module.js.map