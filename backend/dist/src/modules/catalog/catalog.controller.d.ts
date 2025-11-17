import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    create(createProductDto: CreateProductDto): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        slug: string;
        name: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: QueryProductDto): Promise<{
        products: ({
            prices: {
                id: string;
                createdAt: Date;
                currency: import(".prisma/client").$Enums.Currency;
                amount: import("@prisma/client/runtime/library").Decimal;
                productId: string;
            }[];
            variants: {
                name: string;
                image: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                sku: string | null;
                bottleSize: string;
                priceNGN: import("@prisma/client/runtime/library").Decimal;
                priceUSD: import("@prisma/client/runtime/library").Decimal;
                stock: number;
                isActive: boolean;
                sortOrder: number;
            }[];
        } & {
            slug: string;
            name: string;
            description: string;
            image: string | null;
            category: string;
            size: string | null;
            isFeatured: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getCategories(): Promise<string[]>;
    getFeatured(currency?: 'NGN' | 'USD'): Promise<({
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        slug: string;
        name: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findBySlug(slug: string): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
        variants: {
            name: string;
            image: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string | null;
            bottleSize: string;
            priceNGN: import("@prisma/client/runtime/library").Decimal;
            priceUSD: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            isActive: boolean;
            sortOrder: number;
        }[];
    } & {
        slug: string;
        name: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
        variants: {
            name: string;
            image: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string | null;
            bottleSize: string;
            priceNGN: import("@prisma/client/runtime/library").Decimal;
            priceUSD: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            isActive: boolean;
            sortOrder: number;
        }[];
    } & {
        slug: string;
        name: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
        variants: {
            name: string;
            image: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string | null;
            bottleSize: string;
            priceNGN: import("@prisma/client/runtime/library").Decimal;
            priceUSD: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            isActive: boolean;
            sortOrder: number;
        }[];
    } & {
        slug: string;
        name: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    createVariant(productId: string, createVariantDto: CreateVariantDto): Promise<{
        name: string;
        image: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sku: string | null;
        bottleSize: string;
        priceNGN: import("@prisma/client/runtime/library").Decimal;
        priceUSD: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        sortOrder: number;
    }>;
    getProductVariants(productId: string, activeOnly?: string): Promise<{
        name: string;
        image: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sku: string | null;
        bottleSize: string;
        priceNGN: import("@prisma/client/runtime/library").Decimal;
        priceUSD: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    getVariantById(variantId: string): Promise<{
        product: {
            slug: string;
            name: string;
            id: string;
        };
    } & {
        name: string;
        image: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sku: string | null;
        bottleSize: string;
        priceNGN: import("@prisma/client/runtime/library").Decimal;
        priceUSD: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        sortOrder: number;
    }>;
    updateVariant(variantId: string, updateVariantDto: UpdateVariantDto): Promise<{
        name: string;
        image: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sku: string | null;
        bottleSize: string;
        priceNGN: import("@prisma/client/runtime/library").Decimal;
        priceUSD: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        sortOrder: number;
    }>;
    updateVariantStock(variantId: string, stock: number): Promise<{
        name: string;
        image: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        sku: string | null;
        bottleSize: string;
        priceNGN: import("@prisma/client/runtime/library").Decimal;
        priceUSD: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        sortOrder: number;
    }>;
    removeVariant(variantId: string): Promise<{
        message: string;
    }>;
}
