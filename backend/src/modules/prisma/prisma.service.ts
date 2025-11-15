import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { withOptimize } from '@prisma/extension-optimize';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private readonly isTestEnv: boolean;

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
    const databaseUrl =
      configService.get<string>('DATABASE_URL') ??
      'postgresql://postgres:postgres@localhost:5432/postgres';

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
    });

    this.isTestEnv = nodeEnv === 'test' || Boolean(process.env.JEST_WORKER_ID);

    const optimizeKey = configService.get<string>('OPTIMIZE_API_KEY');
    if (optimizeKey) {
      const optimizedClient = this.$extends(
        withOptimize({
          apiKey: optimizeKey,
        }),
      );

      Object.assign(this, optimizedClient);
      this.logger.log('Prisma Optimize extension enabled');
    }
  }

  async onModuleInit(): Promise<void> {
    if (this.isTestEnv) {
      this.logger.log('Skipping Prisma connection in test environment');
      return;
    }

    try {
      await this.$connect();
      this.logger.log('Connected to Postgres via Prisma');
    } catch (error) {
      this.logger.error('Failed to connect to Postgres - will retry on first request');
      // Don't throw - allow server to start and retry connection on first query
    }
  }

  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit' as never, async () => {
      this.logger.log('Prisma is shutting down');
      await app.close();
    });
  }
}
