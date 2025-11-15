import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(sessionId: string): Promise<any>;
    addToCart(sessionId: string, addToCartDto: AddToCartDto): Promise<any>;
    updateItem(sessionId: string, itemId: string, updateDto: UpdateCartItemDto): Promise<any>;
    removeItem(sessionId: string, itemId: string): Promise<any>;
    clearCart(sessionId: string): Promise<any>;
}
