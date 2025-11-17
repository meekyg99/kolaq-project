"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const email_processor_1 = require("./processors/email.processor");
const inventory_processor_1 = require("./processors/inventory.processor");
const email_service_1 = require("./services/email.service");
const inventory_scheduler_1 = require("./schedulers/inventory.scheduler");
const prisma_service_1 = require("../modules/prisma/prisma.service");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const redisUrl = config.get('REDIS_URL');
                    if (!redisUrl) {
                        console.warn('⚠️  Redis not configured - Background jobs will be disabled');
                        return {
                            redis: {
                                host: 'localhost',
                                port: 6379,
                                maxRetriesPerRequest: 1,
                                enableOfflineQueue: false,
                                connectTimeout: 1000,
                                lazyConnect: true,
                            },
                        };
                    }
                    return { redis: redisUrl };
                },
            }),
            bull_1.BullModule.registerQueue({ name: 'emails' }, { name: 'inventory' }, { name: 'webhooks' }),
        ],
        providers: [
            email_processor_1.EmailProcessor,
            inventory_processor_1.InventoryProcessor,
            email_service_1.EmailService,
            inventory_scheduler_1.InventoryScheduler,
            prisma_service_1.PrismaService,
        ],
        exports: [bull_1.BullModule, email_service_1.EmailService],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map