"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CatalogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogService = CatalogService_1 = class CatalogService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CatalogService_1.name);
    }
    async createProduct(createProductDto) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { slug: createProductDto.slug },
        });
        if (existingProduct) {
            throw new common_1.ConflictException(`Product with slug '${createProductDto.slug}' already exists`);
        }
        const { prices, ...productData } = createProductDto;
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                updatedAt: new Date(),
                prices: {
                    create: prices.map((price) => ({
                        currency: price.currency,
                        amount: price.amount,
                    })),
                },
            },
            include: {
                prices: true,
            },
        });
        this.logger.log(`Created product: ${product.name} (${product.slug})`);
        return product;
    }
    async findAll(query) {
        const { category, search, isFeatured, currency, limit = 50, offset = 0, } = query;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }
        const products = await this.prisma.product.findMany({
            where,
            include: {
                prices: currency ? { where: { currency } } : true,
                variants: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
        const total = await this.prisma.product.count({ where });
        return {
            products,
            total,
            limit,
            offset,
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                prices: true,
                variants: {
                    where: { isActive: true },
                    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                prices: true,
                variants: {
                    where: { isActive: true },
                    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug '${slug}' not found`);
        }
        return product;
    }
    async updateProduct(id, updateProductDto) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        if (updateProductDto.slug && updateProductDto.slug !== existingProduct.slug) {
            const slugExists = await this.prisma.product.findUnique({
                where: { slug: updateProductDto.slug },
            });
            if (slugExists) {
                throw new common_1.ConflictException(`Product with slug '${updateProductDto.slug}' already exists`);
            }
        }
        const { prices, ...productData } = updateProductDto;
        const updateData = {
            ...productData,
            updatedAt: new Date(),
        };
        if (prices && prices.length > 0) {
            await this.prisma.price.deleteMany({
                where: { productId: id },
            });
            updateData.prices = {
                create: prices.map((price) => ({
                    currency: price.currency,
                    amount: price.amount,
                })),
            };
        }
        const product = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                prices: true,
                variants: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        this.logger.log(`Updated product: ${product.name} (${product.id})`);
        return product;
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        await this.prisma.product.delete({
            where: { id },
        });
        this.logger.log(`Deleted product: ${product.name} (${product.id})`);
        return { message: 'Product deleted successfully' };
    }
    async getCategories() {
        const categories = await this.prisma.product.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
            orderBy: {
                category: 'asc',
            },
        });
        return categories.map((c) => c.category);
    }
    async getFeaturedProducts(currency) {
        const products = await this.prisma.product.findMany({
            where: { isFeatured: true },
            include: {
                prices: currency ? { where: { currency } } : true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return products;
    }
    async createVariant(productId, createVariantDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${productId}' not found`);
        }
        if (createVariantDto.sku) {
            const existingSku = await this.prisma.productVariant.findUnique({
                where: { sku: createVariantDto.sku },
            });
            if (existingSku) {
                throw new common_1.ConflictException(`Variant with SKU '${createVariantDto.sku}' already exists`);
            }
        }
        const variant = await this.prisma.productVariant.create({
            data: {
                ...createVariantDto,
                productId,
            },
        });
        this.logger.log(`Created variant: ${variant.name} for product ${product.name}`);
        return variant;
    }
    async getProductVariants(productId, activeOnly = false) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${productId}' not found`);
        }
        const where = { productId };
        if (activeOnly) {
            where.isActive = true;
        }
        const variants = await this.prisma.productVariant.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
        return variants;
    }
    async getVariantById(variantId) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID '${variantId}' not found`);
        }
        return variant;
    }
    async updateVariant(variantId, updateVariantDto) {
        const existingVariant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!existingVariant) {
            throw new common_1.NotFoundException(`Variant with ID '${variantId}' not found`);
        }
        if (updateVariantDto.sku && updateVariantDto.sku !== existingVariant.sku) {
            const skuExists = await this.prisma.productVariant.findUnique({
                where: { sku: updateVariantDto.sku },
            });
            if (skuExists) {
                throw new common_1.ConflictException(`Variant with SKU '${updateVariantDto.sku}' already exists`);
            }
        }
        const variant = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: updateVariantDto,
        });
        this.logger.log(`Updated variant: ${variant.name} (${variant.id})`);
        return variant;
    }
    async deleteVariant(variantId) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID '${variantId}' not found`);
        }
        await this.prisma.productVariant.delete({
            where: { id: variantId },
        });
        this.logger.log(`Deleted variant: ${variant.name} (${variant.id})`);
        return { message: 'Variant deleted successfully' };
    }
    async updateVariantStock(variantId, stock) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID '${variantId}' not found`);
        }
        const updated = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: { stock },
        });
        this.logger.log(`Updated stock for variant ${variant.name}: ${stock} units`);
        return updated;
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = CatalogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map