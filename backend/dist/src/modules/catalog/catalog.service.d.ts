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
    findOne(id: string): Promise<{
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
    findBySlug(slug: string): Promise<{
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
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<{
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
}
