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
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = CartService_1 = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CartService_1.name);
    }
    async getOrCreateCart(sessionId, currency = 'NGN') {
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
    async addToCart(sessionId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { prices: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${productId}' not found`);
        }
        const cart = await this.getOrCreateCart(sessionId);
        const productPrice = product.prices.find((p) => p.currency === cart.currency);
        if (!productPrice) {
            throw new common_1.BadRequestException(`Product price not available in ${cart.currency}`);
        }
        const existingItem = cart.items.find((item) => item.productId === productId);
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
            this.logger.log(`Updated cart item quantity: ${existingItem.quantity} -> ${existingItem.quantity + quantity}`);
        }
        else {
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
    async updateCartItem(sessionId, itemId, updateDto) {
        const cart = await this.getOrCreateCart(sessionId);
        const item = cart.items.find((i) => i.id === itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Cart item with ID '${itemId}' not found`);
        }
        if (updateDto.quantity === 0) {
            await this.prisma.cartItem.delete({
                where: { id: itemId },
            });
            this.logger.log(`Removed item from cart: ${item.product.name}`);
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity: updateDto.quantity },
            });
            this.logger.log(`Updated cart item quantity: ${item.quantity} -> ${updateDto.quantity}`);
        }
        return this.getOrCreateCart(sessionId);
    }
    async removeFromCart(sessionId, itemId) {
        const cart = await this.getOrCreateCart(sessionId);
        const item = cart.items.find((i) => i.id === itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Cart item with ID '${itemId}' not found`);
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        this.logger.log(`Removed item from cart: ${item.product.name}`);
        return this.getOrCreateCart(sessionId);
    }
    async clearCart(sessionId) {
        const cart = await this.getOrCreateCart(sessionId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        this.logger.log(`Cleared cart for session: ${sessionId}`);
        return this.getOrCreateCart(sessionId);
    }
    calculateCartTotals(cart) {
        const itemsWithTotals = cart.items.map((item) => {
            const itemTotal = Number(item.price) * item.quantity;
            return {
                ...item,
                itemTotal,
            };
        });
        const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.itemTotal, 0);
        return {
            ...cart,
            items: itemsWithTotals,
            subtotal,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map