import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { initializeSentry } from './config/sentry.config';
import * as Sentry from '@sentry/node';

// Initialize Sentry before app creation
initializeSentry();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Setup Pino logger
  app.useLogger(app.get(Logger));
  const pinoLogger = app.get(Logger);

  // Setup global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(pinoLogger as any));

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://kolaqalagbo.org',
      'https://www.kolaqalagbo.org',
      'https://kolaqbitters.com',
      'https://www.kolaqbitters.com',
      'https://kolaq-project-production.up.railway.app',
      /\.netlify\.app$/,
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  pinoLogger.log(`🚀 Backend running on http://0.0.0.0:${port}`);
  pinoLogger.log(`📚 API endpoints available at http://0.0.0.0:${port}/api/v1`);
  pinoLogger.log(`🔍 Health check: http://0.0.0.0:${port}/api/v1/monitoring/health`);
  pinoLogger.log(`📊 Metrics: http://0.0.0.0:${port}/api/v1/monitoring/metrics`);
}
void bootstrap();
