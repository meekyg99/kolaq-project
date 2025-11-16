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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const nestjs_pino_1 = require("nestjs-pino");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const sentry_config_1 = require("./config/sentry.config");
const Sentry = __importStar(require("@sentry/node"));
(0, sentry_config_1.initializeSentry)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    const pinoLogger = app.get(nestjs_pino_1.Logger);
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter(pinoLogger));
    app.use(Sentry.expressIntegration());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
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