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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
        const apiKey = this.config.get('RESEND_API_KEY');
        if (!apiKey) {
            this.logger.warn('RESEND_API_KEY not configured');
        }
        this.resend = new resend_1.Resend(apiKey);
    }
    async sendEmail(data) {
        try {
            const from = data.from || this.config.get('SUPPORT_EMAIL', 'support@kolaqbitters.com');
            const result = await this.resend.emails.send({
                from,
                to: Array.isArray(data.to) ? data.to : [data.to],
                subject: data.subject,
                html: data.html,
            });
            this.logger.log(`Email sent successfully: ${result.data?.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendOrderConfirmation(orderId, email) {
        return this.sendEmail({
            to: email,
            subject: 'Order Confirmation - Kolaq Bitters',
            html: `
        <h1>Thank you for your order!</h1>
        <p>Your order #${orderId} has been received and is being processed.</p>
        <p>We'll send you another email when your order ships.</p>
      `,
        });
    }
    async sendLowStockAlert(productName, currentStock) {
        const adminEmail = this.config.get('ADMIN_EMAIL', 'admin@kolaqbitters.com');
        return this.sendEmail({
            to: adminEmail,
            subject: `Low Stock Alert: ${productName}`,
            html: `
        <h2>Low Stock Alert</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Current Stock:</strong> ${currentStock}</p>
        <p>Please restock this item soon.</p>
      `,
        });
    }
    async sendBroadcast(recipients, subject, html) {
        const results = await Promise.allSettled(recipients.map(email => this.sendEmail({ to: email, subject, html })));
        const success = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        this.logger.log(`Broadcast complete: ${success} sent, ${failed} failed`);
        return { success, failed };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map