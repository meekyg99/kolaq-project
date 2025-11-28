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
var ResendProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let ResendProvider = ResendProvider_1 = class ResendProvider {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ResendProvider_1.name);
        this.resend = null;
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
            this.logger.log('Resend email provider initialized');
        }
    }
    isConfigured() {
        return this.resend !== null;
    }
    getProviderName() {
        return 'resend';
    }
    async send(options) {
        if (!this.resend) {
            return {
                success: false,
                error: 'Resend API not configured',
                provider: 'resend',
            };
        }
        try {
            const fromEmail = options.from ||
                this.configService.get('EMAIL_FROM', 'KOLAQ ALAGBO <support@kolaqalagbo.org>');
            const result = await this.resend.emails.send({
                from: fromEmail,
                to: Array.isArray(options.to) ? options.to : [options.to],
                subject: options.subject,
                html: options.html,
                replyTo: options.replyTo,
            });
            this.logger.log(`Email sent via Resend to ${options.to}`);
            return {
                success: true,
                messageId: result.data?.id,
                provider: 'resend',
            };
        }
        catch (error) {
            this.logger.error(`Resend email failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                provider: 'resend',
            };
        }
    }
};
exports.ResendProvider = ResendProvider;
exports.ResendProvider = ResendProvider = ResendProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ResendProvider);
//# sourceMappingURL=resend.provider.js.map