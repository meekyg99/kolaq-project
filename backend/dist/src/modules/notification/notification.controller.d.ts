import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(dto: SendNotificationDto): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        status: import(".prisma/client").$Enums.NotificationStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        recipient: string;
        subject: string | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
    }>;
    sendOrderConfirmation(orderId: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        status: import(".prisma/client").$Enums.NotificationStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        recipient: string;
        subject: string | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
    }>;
    sendOrderStatusUpdate(orderId: string, body: {
        status: string;
        message?: string;
    }): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        status: import(".prisma/client").$Enums.NotificationStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        recipient: string;
        subject: string | null;
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
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            recipient: string;
            subject: string | null;
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
