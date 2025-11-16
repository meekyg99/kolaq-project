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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const email_service_1 = require("../services/email.service");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor {
    constructor(emailService) {
        this.emailService = emailService;
        this.logger = new common_1.Logger(EmailProcessor_1.name);
    }
    async handleEmailJob(job) {
        this.logger.log(`Processing email job ${job.id}: ${job.data.type}`);
        try {
            switch (job.data.type) {
                case 'order_confirmation':
                    await this.emailService.sendOrderConfirmation(job.data.data.orderId, job.data.data.email);
                    break;
                case 'low_stock':
                    await this.emailService.sendLowStockAlert(job.data.data.productName, job.data.data.currentStock);
                    break;
                case 'broadcast':
                    await this.emailService.sendBroadcast(job.data.data.recipients, job.data.data.subject, job.data.data.html);
                    break;
                case 'generic':
                    await this.emailService.sendEmail(job.data.data);
                    break;
                default:
                    this.logger.warn(`Unknown email job type: ${job.data.type}`);
            }
            this.logger.log(`Email job ${job.id} completed successfully`);
        }
        catch (error) {
            this.logger.error(`Email job ${job.id} failed: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handleEmailJob", null);
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bull_1.Processor)('emails'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map