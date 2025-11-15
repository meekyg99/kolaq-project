export declare class BroadcastNotificationDto {
    subject: string;
    message: string;
    recipients?: string[];
    filter?: 'all' | 'recent-customers' | 'high-value';
}
