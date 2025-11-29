import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto, userId?: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findFirst({
      where: {
        productId: dto.productId,
        userEmail: dto.userEmail,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Check if user has purchased this product (for verified badge)
    let isVerified = false;
    if (dto.userEmail) {
      const hasPurchased = await this.prisma.order.findFirst({
        where: {
          customerEmail: dto.userEmail,
          status: 'DELIVERED',
          items: {
            some: {
              productId: dto.productId,
            },
          },
        },
      });
      isVerified = !!hasPurchased;
    }

    return this.prisma.review.create({
      data: {
        productId: dto.productId,
        userId,
        userName: dto.userName,
        userEmail: dto.userEmail,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        isVerified,
        isApproved: false, // Admin must approve
      },
    });
  }

  async findByProduct(productId: string, includeUnapproved = false) {
    const where: any = { productId };
    
    if (!includeUnapproved) {
      where.isApproved = true;
    }

    const reviews = await this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate average rating
    const stats = await this.getProductStats(productId);

    return {
      reviews,
      stats,
    };
  }

  async getProductStats(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++;
    });

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  async findAll(page = 1, limit = 20, approved?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (approved !== undefined) {
      where.isApproved = approved;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPending() {
    return this.prisma.review.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findTopRated(minRating = 4, limit = 10) {
    // Get approved top-rated reviews for the testimonials section
    const reviews = await this.prisma.review.findMany({
      where: {
        isApproved: true,
        rating: { gte: minRating },
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Calculate overall stats
    const allApproved = await this.prisma.review.findMany({
      where: { isApproved: true },
      select: { rating: true },
    });

    const stats = {
      averageRating: allApproved.length > 0
        ? Math.round((allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length) * 10) / 10
        : 0,
      totalReviews: allApproved.length,
    };

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewer: {
          name: review.userName,
          email: review.userEmail,
        },
        product: review.product,
      })),
      stats,
    };
  }

  async approve(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async reject(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.delete({ where: { id } });
  }

  async delete(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.delete({ where: { id } });
  }
}
