import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Public: Get top rated reviews for testimonials section
  @Get('top-rated')
  async getTopRated(
    @Query('minRating') minRating?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewService.findTopRated(
      minRating ? parseInt(minRating) : 4,
      limit ? parseInt(limit) : 10,
    );
  }

  // Public: Submit a review (anyone can submit, but needs approval)
  @Post()
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // Public: Get reviews for a product
  @Get('product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    return this.reviewService.findByProduct(productId);
  }

  // Public: Get product rating stats
  @Get('product/:productId/stats')
  async getProductStats(@Param('productId') productId: string) {
    return this.reviewService.getProductStats(productId);
  }

  // Admin: Get all reviews with pagination
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('approved') approved?: string,
  ) {
    return this.reviewService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      approved !== undefined ? approved === 'true' : undefined,
    );
  }

  // Admin: Get pending reviews
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('pending')
  async findPending() {
    return this.reviewService.findPending();
  }

  // Admin: Approve a review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.reviewService.approve(id);
  }

  // Admin: Reject (delete) a review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id/reject')
  async reject(@Param('id') id: string) {
    return this.reviewService.reject(id);
  }

  // Admin: Delete a review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }
}
