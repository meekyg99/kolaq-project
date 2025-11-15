import { ActivityService } from './activity.service';
import { ActivityType } from '@prisma/client';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findAll(userId?: string, type?: ActivityType, startDate?: string, endDate?: string, page?: string, limit?: string): Promise<{
        logs: {
            description: string | null;
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.ActivityType;
            userId: string | null;
            userEmail: string | null;
            action: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ActivityType;
        userId: string | null;
        userEmail: string | null;
        action: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
