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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const extension_optimize_1 = require("@prisma/extension-optimize");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor(configService) {
        const nodeEnv = configService.get('NODE_ENV') ?? 'development';
        const databaseUrl = configService.get('DATABASE_URL') ??
            'postgresql://postgres:postgres@localhost:5432/postgres';
        super({
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
            log: nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
        });
        this.configService = configService;
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.isTestEnv = nodeEnv === 'test' || Boolean(process.env.JEST_WORKER_ID);
        const optimizeKey = configService.get('OPTIMIZE_API_KEY');
        if (optimizeKey) {
            const optimizedClient = this.$extends((0, extension_optimize_1.withOptimize)({
                apiKey: optimizeKey,
            }));
            Object.assign(this, optimizedClient);
            this.logger.log('Prisma Optimize extension enabled');
        }
    }
    async onModuleInit() {
        if (this.isTestEnv) {
            this.logger.log('Skipping Prisma connection in test environment');
            return;
        }
        try {
            await this.$connect();
            this.logger.log('Connected to Postgres via Prisma');
        }
        catch (error) {
            this.logger.error('Failed to connect to Postgres - will retry on first request');
        }
    }
    enableShutdownHooks(app) {
        this.$on('beforeExit', async () => {
            this.logger.log('Prisma is shutting down');
            await app.close();
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map