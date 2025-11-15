declare class PriceDto {
    currency?: 'NGN' | 'USD';
    amount?: number;
}
export declare class UpdateProductDto {
    slug?: string;
    name?: string;
    description?: string;
    image?: string;
    category?: string;
    size?: string;
    isFeatured?: boolean;
    prices?: PriceDto[];
}
export {};
