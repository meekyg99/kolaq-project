import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';
export interface CreateActivityLogDto {
    type: ActivityType;
    userId?: string;
    userEmail?: string;
    action: string;
    description?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
export declare class ActivityService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: CreateActivityLogDto): Promise<{
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
    findAll(filters?: {
        userId?: string;
        type?: ActivityType;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
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
    findById(id: string): Promise<{
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
