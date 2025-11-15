import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Query('sessionId') sessionId: string) {
    return this.cartService.getOrCreateCart(sessionId);
  }

  @Post('add')
  addToCart(
    @Query('sessionId') sessionId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(sessionId, addToCartDto);
  }

  @Patch('items/:itemId')
  updateItem(
    @Query('sessionId') sessionId: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(sessionId, itemId, updateDto);
  }

  @Delete('items/:itemId')
  removeItem(
    @Query('sessionId') sessionId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeFromCart(sessionId, itemId);
  }

  @Delete('clear')
  clearCart(@Query('sessionId') sessionId: string) {
    return this.cartService.clearCart(sessionId);
  }
}
