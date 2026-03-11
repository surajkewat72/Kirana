import { prisma } from '../config/prisma';

export class CartService {
    async getCart(userId: string): Promise<any> {
        return prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
    }

    async addItem(userId: string, productId: string, quantity: number): Promise<any> {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error('Cart not found');

        return prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId
                }
            },
            update: { quantity: { increment: quantity } },
            create: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            }
        });
    }

    async removeItem(userId: string, productId: string): Promise<any> {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error('Cart not found');

        return prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId
                }
            }
        });
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
    }
}
