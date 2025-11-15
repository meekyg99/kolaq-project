import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

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
      },
    });

    this.logger.log(`Updated product: ${product.name} (${product.id})`);
    return product;
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
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
}
