"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const nestjs_pino_1 = require("nestjs-pino");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const sentry_config_1 = require("./config/sentry.config");
(0, sentry_config_1.initializeSentry)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    const pinoLogger = app.get(nestjs_pino_1.Logger);
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter(pinoLogger));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://kolaqbitters.com',
            'https://www.kolaqbitters.com',
            'https://kolaq-project-production.up.railway.app',
            /\.netlify\.app$/,
            /\.vercel\.app$/,
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    pinoLogger.log(`🚀 Backend running on http://0.0.0.0:${port}`);
    pinoLogger.log(`📚 API endpoints available at http://0.0.0.0:${port}/api/v1`);
    pinoLogger.log(`🔍 Health check: http://0.0.0.0:${port}/api/v1/monitoring/health`);
    pinoLogger.log(`📊 Metrics: http://0.0.0.0:${port}/api/v1/monitoring/metrics`);
}
void bootstrap();
//# sourceMappingURL=main.js.map