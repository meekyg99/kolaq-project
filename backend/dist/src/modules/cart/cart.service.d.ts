import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Currency } from '@prisma/client';
export declare class CartService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getOrCreateCart(sessionId: string, currency?: Currency): Promise<any>;
    addToCart(sessionId: string, addToCartDto: AddToCartDto): Promise<any>;
    updateCartItem(sessionId: string, itemId: string, updateDto: UpdateCartItemDto): Promise<any>;
    removeFromCart(sessionId: string, itemId: string): Promise<any>;
    clearCart(sessionId: string): Promise<any>;
    private calculateCartTotals;
}
