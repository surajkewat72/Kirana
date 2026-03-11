import { prisma } from '../../config/prisma';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { Order, OrderItem } from '../../domain/entities/Order';

export class PrismaOrderRepository extends OrderRepository {
    async findById(id: string): Promise<Order | null> {
        const orderData = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!orderData) return null;

        return new Order({
            id: orderData.id,
            userId: orderData.userId,
            totalAmount: orderData.totalAmount,
            status: orderData.status,
            orderedAt: orderData.orderedAt,
            items: orderData.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.priceAtPurchase
            }))
        });
    }

    async save(order: Order): Promise<void> {
        await prisma.order.upsert({
            where: { id: order.id },
            update: {
                status: order.getStatus() as any,
                totalAmount: order.totalAmount
            },
            create: {
                id: order.id,
                userId: order.userId,
                totalAmount: order.totalAmount,
                status: order.getStatus() as any,
                orderedAt: order.orderedAt,
                items: {
                    create: order.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        priceAtPurchase: item.priceAtPurchase
                    }))
                }
            }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.order.delete({ where: { id } });
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: true }
        });

        return orders.map(orderData => new Order({
            id: orderData.id,
            userId: orderData.userId,
            totalAmount: orderData.totalAmount,
            status: orderData.status,
            orderedAt: orderData.orderedAt,
            items: orderData.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.priceAtPurchase
            }))
        }));
    }

    async updateStatus(orderId: string, status: string): Promise<void> {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: status as any }
        });
    }
}
