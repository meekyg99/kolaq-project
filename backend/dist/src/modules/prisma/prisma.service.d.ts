import { INestApplication, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private readonly isTestEnv;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    enableShutdownHooks(app: INestApplication): void;
}
