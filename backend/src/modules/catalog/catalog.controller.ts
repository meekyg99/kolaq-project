import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/products')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.catalogService.createProduct(createProductDto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.catalogService.findAll(query);
  }

  @Get('categories')
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('featured')
  getFeatured(@Query('currency') currency?: 'NGN' | 'USD') {
    return this.catalogService.getFeaturedProducts(currency);
  }

  @Get('promo')
  getPromo(@Query('currency') currency?: 'NGN' | 'USD') {
    return this.catalogService.getPromoProducts(currency);
  }

  @Patch(':id/promo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ADMIN', 'SUPER_ADMIN')
  setPromoStatus(
    @Param('id') id: string,
    @Body() body: {
      isPromo: boolean;
      promoPrice?: number;
      promoStartDate?: string;
      promoEndDate?: string;
      promoLabel?: string;
    },
  ) {
    return this.catalogService.setPromoStatus(
      id,
      body.isPromo,
      body.promoPrice,
      body.promoStartDate,
      body.promoEndDate,
      body.promoLabel,
    );
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.catalogService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.catalogService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.catalogService.deleteProduct(id);
  }

  // Product Variant Endpoints
  @Post(':productId/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createVariant(
    @Param('productId') productId: string,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.catalogService.createVariant(productId, createVariantDto);
  }

  @Get(':productId/variants')
  getProductVariants(
    @Param('productId') productId: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.catalogService.getProductVariants(
      productId,
      activeOnly === 'true',
    );
  }

  @Get('variants/:variantId')
  getVariantById(@Param('variantId') variantId: string) {
    return this.catalogService.getVariantById(variantId);
  }

  @Patch('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateVariant(
    @Param('variantId') variantId: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.catalogService.updateVariant(variantId, updateVariantDto);
  }

  @Patch('variants/:variantId/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateVariantStock(
    @Param('variantId') variantId: string,
    @Body('stock') stock: number,
  ) {
    return this.catalogService.updateVariantStock(variantId, stock);
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeVariant(@Param('variantId') variantId: string) {
    return this.catalogService.deleteVariant(variantId);
  }
}
