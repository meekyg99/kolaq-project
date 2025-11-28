import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${createProductDto.slug}' already exists`,
      );
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

  async findAll(query: QueryProductDto) {
    const {
      category,
      search,
      isFeatured,
      currency,
      limit = 50,
      offset = 0,
    } = query;

    const where: any = {};

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

  async findOne(id: string) {
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
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
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
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    if (updateProductDto.slug && updateProductDto.slug !== existingProduct.slug) {
      const slugExists = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (slugExists) {
        throw new ConflictException(
          `Product with slug '${updateProductDto.slug}' already exists`,
        );
      }
    }

    const { prices, ...productData } = updateProductDto;

    const updateData: any = {
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

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    // Check if product has order history - prevent deletion if it does
    if (product.orderItems.length > 0) {
      throw new BadRequestException(
        `Cannot delete product '${product.name}' because it has ${product.orderItems.length} order(s) associated with it. Consider deactivating it instead.`,
      );
    }

    // Delete related records in a transaction
    await this.prisma.$transaction([
      // Delete prices
      this.prisma.price.deleteMany({ where: { productId: id } }),
      // Delete cart items
      this.prisma.cartItem.deleteMany({ where: { productId: id } }),
      // Delete inventory events
      this.prisma.inventoryEvent.deleteMany({ where: { productId: id } }),
      // Delete variants (already cascades, but just to be safe)
      this.prisma.productVariant.deleteMany({ where: { productId: id } }),
      // Finally delete the product
      this.prisma.product.delete({ where: { id } }),
    ]);

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

  async getFeaturedProducts(currency?: 'NGN' | 'USD') {
    const products = await this.prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        prices: currency ? { where: { currency } } : true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async getPromoProducts(currency?: 'NGN' | 'USD') {
    const now = new Date();
    
    const products = await this.prisma.product.findMany({
      where: {
        isPromo: true,
        OR: [
          // Promo with dates: must be within range
          {
            promoStartDate: { lte: now },
            promoEndDate: { gte: now },
          },
          // Promo without dates: always active
          {
            promoStartDate: null,
            promoEndDate: null,
          },
        ],
      },
      include: {
        prices: currency ? { where: { currency } } : true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async setPromoStatus(
    id: string,
    isPromo: boolean,
    promoPrice?: number,
    promoStartDate?: string,
    promoEndDate?: string,
    promoLabel?: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    const updateData: any = {
      isPromo,
      updatedAt: new Date(),
    };

    if (isPromo) {
      updateData.promoPrice = promoPrice ?? null;
      updateData.promoStartDate = promoStartDate ? new Date(promoStartDate) : null;
      updateData.promoEndDate = promoEndDate ? new Date(promoEndDate) : null;
      updateData.promoLabel = promoLabel ?? null;
    } else {
      // Clear promo fields when disabling
      updateData.promoPrice = null;
      updateData.promoStartDate = null;
      updateData.promoEndDate = null;
      updateData.promoLabel = null;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        prices: true,
      },
    });

    this.logger.log(`Updated promo status for product: ${updatedProduct.name} (${id}) - isPromo: ${isPromo}`);
    return updatedProduct;
  }

  // Product Variant Methods
  async createVariant(productId: string, createVariantDto: CreateVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    if (createVariantDto.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: createVariantDto.sku },
      });

      if (existingSku) {
        throw new ConflictException(
          `Variant with SKU '${createVariantDto.sku}' already exists`,
        );
      }
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        ...createVariantDto,
        productId,
      },
    });

    this.logger.log(
      `Created variant: ${variant.name} for product ${product.name}`,
    );
    return variant;
  }

  async getProductVariants(productId: string, activeOnly = false) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    const where: any = { productId };
    if (activeOnly) {
      where.isActive = true;
    }

    const variants = await this.prisma.productVariant.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return variants;
  }

  async getVariantById(variantId: string) {
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
      throw new NotFoundException(`Variant with ID '${variantId}' not found`);
    }

    return variant;
  }

  async updateVariant(variantId: string, updateVariantDto: UpdateVariantDto) {
    const existingVariant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existingVariant) {
      throw new NotFoundException(`Variant with ID '${variantId}' not found`);
    }

    if (updateVariantDto.sku && updateVariantDto.sku !== existingVariant.sku) {
      const skuExists = await this.prisma.productVariant.findUnique({
        where: { sku: updateVariantDto.sku },
      });

      if (skuExists) {
        throw new ConflictException(
          `Variant with SKU '${updateVariantDto.sku}' already exists`,
        );
      }
    }

    const variant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: updateVariantDto,
    });

    this.logger.log(`Updated variant: ${variant.name} (${variant.id})`);
    return variant;
  }

  async deleteVariant(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID '${variantId}' not found`);
    }

    await this.prisma.productVariant.delete({
      where: { id: variantId },
    });

    this.logger.log(`Deleted variant: ${variant.name} (${variant.id})`);
    return { message: 'Variant deleted successfully' };
  }

  async updateVariantStock(variantId: string, stock: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID '${variantId}' not found`);
    }

    const updated = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
    });

    this.logger.log(
      `Updated stock for variant ${variant.name}: ${stock} units`,
    );
    return updated;
  }
}
