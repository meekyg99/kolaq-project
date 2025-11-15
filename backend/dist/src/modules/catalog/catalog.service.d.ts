import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class CatalogService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createProduct(createProductDto: CreateProductDto): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
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
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            image: string | null;
            category: string;
            size: string | null;
            isFeatured: boolean;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findOne(id: string): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
    }>;
    findBySlug(slug: string): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
    }>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    getCategories(): Promise<string[]>;
    getFeaturedProducts(currency?: 'NGN' | 'USD'): Promise<({
        prices: {
            id: string;
            createdAt: Date;
            currency: import(".prisma/client").$Enums.Currency;
            amount: import("@prisma/client/runtime/library").Decimal;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string | null;
        category: string;
        size: string | null;
        isFeatured: boolean;
    })[]>;
}
