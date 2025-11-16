"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const os = __importStar(require("os"));
let MonitoringService = class MonitoringService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async healthCheck() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: 'connected',
            };
        }
        catch (error) {
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: 'disconnected',
                error: error.message,
            };
        }
    }
    async getMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const [productCount, orderCount, adminUserCount, cartCount,] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.adminUser.count(),
            this.prisma.cart.count(),
        ]);
        return {
            timestamp: new Date().toISOString(),
            process: {
                uptime: process.uptime(),
                pid: process.pid,
                memory: {
                    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
                },
                cpu: {
                    user: `${Math.round(cpuUsage.user / 1000)}ms`,
                    system: `${Math.round(cpuUsage.system / 1000)}ms`,
                },
            },
            database: {
                products: productCount,
                orders: orderCount,
                adminUsers: adminUserCount,
                carts: cartCount,
            },
        };
    }
    async getSystemStatus() {
        const loadAverage = os.loadavg();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        return {
            timestamp: new Date().toISOString(),
            system: {
                platform: os.platform(),
                arch: os.arch(),
                nodeVersion: process.version,
                uptime: os.uptime(),
                loadAverage: loadAverage.map((load) => load.toFixed(2)),
                memory: {
                    total: `${Math.round(totalMemory / 1024 / 1024 / 1024)}GB`,
                    free: `${Math.round(freeMemory / 1024 / 1024 / 1024)}GB`,
                    used: `${Math.round((totalMemory - freeMemory) / 1024 / 1024 / 1024)}GB`,
                    usagePercent: `${Math.round(((totalMemory - freeMemory) / totalMemory) * 100)}%`,
                },
                cpu: {
                    count: os.cpus().length,
                    model: os.cpus()[0].model,
                },
            },
            application: await this.healthCheck(),
        };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map