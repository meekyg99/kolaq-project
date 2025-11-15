import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Currency } from '@prisma/client';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(sessionId: string, currency: Currency = 'NGN') {
    let cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                prices: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          sessionId,
          currency,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  prices: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Created new cart for session: ${sessionId}`);
    }

    return this.calculateCartTotals(cart);
  }

  async addToCart(sessionId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { prices: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    const cart = await this.getOrCreateCart(sessionId);

    const productPrice = product.prices.find(
      (p) => p.currency === cart.currency,
    );

    if (!productPrice) {
      throw new BadRequestException(
        `Product price not available in ${cart.currency}`,
      );
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      this.logger.log(
        `Updated cart item quantity: ${existingItem.quantity} -> ${existingItem.quantity + quantity}`,
      );
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: productPrice.amount,
          currency: cart.currency,
        },
      });

      this.logger.log(`Added product ${product.name} to cart`);
    }

    return this.getOrCreateCart(sessionId);
  }

  async updateCartItem(
    sessionId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    const cart = await this.getOrCreateCart(sessionId);

    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Cart item with ID '${itemId}' not found`);
    }

    if (updateDto.quantity === 0) {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });

      this.logger.log(`Removed item from cart: ${item.product.name}`);
    } else {
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: updateDto.quantity },
      });

      this.logger.log(
        `Updated cart item quantity: ${item.quantity} -> ${updateDto.quantity}`,
      );
    }

    return this.getOrCreateCart(sessionId);
  }

  async removeFromCart(sessionId: string, itemId: string) {
    const cart = await this.getOrCreateCart(sessionId);

    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Cart item with ID '${itemId}' not found`);
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    this.logger.log(`Removed item from cart: ${item.product.name}`);

    return this.getOrCreateCart(sessionId);
  }

  async clearCart(sessionId: string) {
    const cart = await this.getOrCreateCart(sessionId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    this.logger.log(`Cleared cart for session: ${sessionId}`);

    return this.getOrCreateCart(sessionId);
  }

  private calculateCartTotals(cart: any) {
    const itemsWithTotals = cart.items.map((item) => {
      const itemTotal = Number(item.price) * item.quantity;
      return {
        ...item,
        itemTotal,
      };
    });

    const subtotal = itemsWithTotals.reduce(
      (sum, item) => sum + item.itemTotal,
      0,
    );

    return {
      ...cart,
      items: itemsWithTotals,
      subtotal,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}
