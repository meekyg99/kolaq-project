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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFacadeService = exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_provider_1 = require("./resend.provider");
const smtp_provider_1 = require("./smtp.provider");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService, resendProvider, smtpProvider) {
        this.configService = configService;
        this.resendProvider = resendProvider;
        this.smtpProvider = smtpProvider;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.primaryProvider = null;
        this.fallbackProvider = null;
        this.initializeProviders();
    }
    initializeProviders() {
        const preferredProvider = this.configService.get('EMAIL_PROVIDER', 'auto');
        if (preferredProvider === 'smtp') {
            this.primaryProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
            this.fallbackProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
        }
        else if (preferredProvider === 'resend') {
            this.primaryProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
            this.fallbackProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
        }
        else {
            if (this.resendProvider.isConfigured()) {
                this.primaryProvider = this.resendProvider;
                this.fallbackProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
            }
            else if (this.smtpProvider.isConfigured()) {
                this.primaryProvider = this.smtpProvider;
                this.fallbackProvider = null;
            }
        }
        if (this.primaryProvider) {
            this.logger.log(`Primary email provider: ${this.primaryProvider.getProviderName()}`);
        }
        if (this.fallbackProvider) {
            this.logger.log(`Fallback email provider: ${this.fallbackProvider.getProviderName()}`);
        }
        if (!this.primaryProvider) {
            this.logger.warn('No email provider configured! Emails will not be sent.');
        }
    }
    isConfigured() {
        return this.primaryProvider !== null;
    }
    async send(options) {
        if (!this.primaryProvider) {
            this.logger.warn('No email provider available, email not sent');
            return {
                success: false,
                error: 'No email provider configured',
                provider: 'resend',
            };
        }
        let result = await this.primaryProvider.send(options);
        if (!result.success && this.fallbackProvider) {
            this.logger.warn(`Primary provider failed, trying fallback: ${this.fallbackProvider.getProviderName()}`);
            result = await this.fallbackProvider.send(options);
        }
        return result;
    }
    async sendWelcomeEmail(to, customerName) {
        const { welcomeEmailTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/welcome.template')));
        return this.send({
            to,
            subject: 'Welcome to KOLAQ ALAGBO! 🌿',
            html: welcomeEmailTemplate({ customerName }),
        });
    }
    async sendPasswordResetEmail(to, resetToken, customerName) {
        const { passwordResetTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/password-reset.template')));
        const resetUrl = `${this.configService.get('FRONTEND_URL', 'https://kolaqalagbo.org')}/reset-password?token=${resetToken}`;
        return this.send({
            to,
            subject: 'Reset Your Password - KOLAQ ALAGBO',
            html: passwordResetTemplate({ customerName, resetUrl }),
        });
    }
    async sendOrderConfirmation(to, orderData) {
        const { orderConfirmationTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/order-confirmation.template')));
        return this.send({
            to,
            subject: `Order Confirmed! #${orderData.orderNumber} 🎉`,
            html: orderConfirmationTemplate(orderData),
        });
    }
    async sendOrderProcessing(to, orderData) {
        const { orderProcessingTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/order-processing.template')));
        return this.send({
            to,
            subject: `Your Order #${orderData.orderNumber} is Being Processed 📦`,
            html: orderProcessingTemplate(orderData),
        });
    }
    async sendOrderShipped(to, orderData) {
        const { orderShippedTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/order-shipped.template')));
        return this.send({
            to,
            subject: `Your Order #${orderData.orderNumber} Has Shipped! 🚚`,
            html: orderShippedTemplate(orderData),
        });
    }
    async sendOrderDelivered(to, orderData) {
        const { orderDeliveredTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/order-delivered.template')));
        return this.send({
            to,
            subject: `Your Order #${orderData.orderNumber} Has Been Delivered! ✅`,
            html: orderDeliveredTemplate(orderData),
        });
    }
    async sendLowStockAlert(to, products) {
        const { lowStockAlertTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/low-stock-alert.template')));
        return this.send({
            to,
            subject: `⚠️ Low Stock Alert: ${products.length} product(s) need attention`,
            html: lowStockAlertTemplate({ products }),
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        resend_provider_1.ResendProvider,
        smtp_provider_1.SmtpProvider])
], EmailService);
class EmailFacadeService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger('EmailFacadeService');
        this.primaryProvider = null;
        this.fallbackProvider = null;
        this.resendProvider = new resend_provider_1.ResendProvider(configService);
        this.smtpProvider = new smtp_provider_1.SmtpProvider(configService);
        this.initializeProviders();
    }
    initializeProviders() {
        const useResendPrimary = this.configService.get('RESEND_PRIMARY', 'true') === 'true';
        if (useResendPrimary) {
            this.primaryProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
            this.fallbackProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
        }
        else {
            this.primaryProvider = this.smtpProvider.isConfigured() ? this.smtpProvider : null;
            this.fallbackProvider = this.resendProvider.isConfigured() ? this.resendProvider : null;
        }
        if (!this.primaryProvider && this.fallbackProvider) {
            this.primaryProvider = this.fallbackProvider;
            this.fallbackProvider = null;
        }
        if (this.primaryProvider) {
            this.logger.log(`Email primary provider: ${this.primaryProvider.getProviderName()}`);
        }
        if (this.fallbackProvider) {
            this.logger.log(`Email fallback provider: ${this.fallbackProvider.getProviderName()}`);
        }
        if (!this.primaryProvider) {
            this.logger.warn('No email provider configured - emails will not be sent');
        }
    }
    async sendRawEmail(options) {
        if (!this.primaryProvider) {
            return { success: false, error: 'No email provider configured', provider: 'smtp' };
        }
        let result = await this.primaryProvider.send(options);
        if (!result.success && this.fallbackProvider) {
            this.logger.warn(`Primary provider failed, trying fallback`);
            result = await this.fallbackProvider.send(options);
        }
        return result;
    }
}
exports.EmailFacadeService = EmailFacadeService;
//# sourceMappingURL=email.service.js.map