import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
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
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
