import { prisma } from '../config/prisma';

export class AdminService {
    async getDashboardStats(): Promise<any> {
        const [totalOrders, totalRevenue, totalUsers, stockAlerts] = await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: 'CANCELLED' } }
            }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.product.count({ where: { stockQuantity: { lt: 10 } } })
        ]);

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalUsers,
            criticalStockItems: stockAlerts
        };
    }

    async getRecentOrders(): Promise<any> {
        return prisma.order.findMany({
            take: 10,
            orderBy: { orderedAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
    }
}
