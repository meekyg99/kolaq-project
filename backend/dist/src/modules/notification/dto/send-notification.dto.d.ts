export declare class SendNotificationDto {
    type: 'EMAIL' | 'SMS' | 'WHATSAPP';
    recipient: string;
    subject?: string;
    message: string;
    metadata?: Record<string, any>;
}
