interface NewsletterData {
    recipientName?: string;
    subject: string;
    headline: string;
    content: string;
    ctaText?: string;
    ctaUrl?: string;
    unsubscribeUrl: string;
}
export declare function newsletterTemplate(data: NewsletterData): string;
interface PromotionalData {
    recipientName?: string;
    promoTitle: string;
    promoDescription: string;
    discountCode?: string;
    discountPercent?: number;
    expiryDate?: string;
    productImageUrl?: string;
    ctaText: string;
    ctaUrl: string;
    unsubscribeUrl: string;
}
export declare function promotionalTemplate(data: PromotionalData): string;
export {};
