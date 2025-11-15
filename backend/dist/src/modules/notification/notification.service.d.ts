import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
export declare class NotificationService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private resend;
    constructor(prisma: PrismaService, configService: ConfigService);
    sendNotification(dto: SendNotificationDto): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        status: import(".prisma/client").$Enums.NotificationStatus;
        recipient: string;
        subject: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
    }>;
    private sendEmail;
    private sendSMS;
    private sendWhatsApp;
    sendOrderConfirmation(orderId: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        status: import(".prisma/client").$Enums.NotificationStatus;
        recipient: string;
        subject: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
    }>;
    sendOrderStatusUpdate(orderId: string, status: string, customMessage?: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        status: import(".prisma/client").$Enums.NotificationStatus;
        recipient: string;
        subject: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
    }>;
    findAll(query: QueryNotificationDto): Promise<{
        notifications: {
            error: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            message: string;
            type: import(".prisma/client").$Enums.NotificationType;
            status: import(".prisma/client").$Enums.NotificationStatus;
            recipient: string;
            subject: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            sentAt: Date | null;
            deliveredAt: Date | null;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getStats(): Promise<{
        totalNotifications: number;
        sentNotifications: number;
        failedNotifications: number;
        pendingNotifications: number;
        byType: {
            email: number;
            sms: number;
            whatsapp: number;
        };
        successRate: string;
    }>;
}
