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
var SmtpProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let SmtpProvider = SmtpProvider_1 = class SmtpProvider {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SmtpProvider_1.name);
        this.transporter = null;
        this.initializeTransporter();
    }
    initializeTransporter() {
        const host = this.configService.get('SMTP_HOST');
        const port = this.configService.get('SMTP_PORT');
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port: port || 587,
                secure: port === 465,
                auth: {
                    user,
                    pass,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            this.transporter.verify((error) => {
                if (error) {
                    this.logger.error(`SMTP connection failed: ${error.message}`);
                    this.transporter = null;
                }
                else {
                    this.logger.log('SMTP email provider initialized (Hostinger)');
                }
            });
        }
    }
    isConfigured() {
        return this.transporter !== null;
    }
    getProviderName() {
        return 'smtp';
    }
    async send(options) {
        if (!this.transporter) {
            return {
                success: false,
                error: 'SMTP not configured',
                provider: 'smtp',
            };
        }
        try {
            const fromEmail = options.from ||
                this.configService.get('EMAIL_FROM', 'KOLAQ ALAGBO <support@kolaqalagbo.org>');
            const mailOptions = {
                from: fromEmail,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                replyTo: options.replyTo,
            };
            if (options.attachments) {
                mailOptions.attachments = options.attachments;
            }
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent via SMTP to ${options.to}`);
            return {
                success: true,
                messageId: result.messageId,
                provider: 'smtp',
            };
        }
        catch (error) {
            this.logger.error(`SMTP email failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                provider: 'smtp',
            };
        }
    }
};
exports.SmtpProvider = SmtpProvider;
exports.SmtpProvider = SmtpProvider = SmtpProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmtpProvider);
//# sourceMappingURL=smtp.provider.js.map