import { prisma } from '../config/prisma';

export class ProductService {
    async getAllProducts(filters: any): Promise<any> {
        const { search, categoryId, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        return prisma.product.findMany({
            where: {
                deletedAt: null,
                categoryId: categoryId || undefined,
                name: search ? { contains: search, mode: 'insensitive' } : undefined
            },
            include: { category: true },
            skip: Number(skip),
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });
    }

    async getProductById(id: string): Promise<any> {
        return prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
    }

    async createProduct(data: any): Promise<any> {
        return prisma.product.create({
            data: {
                name: data.name,
                brand: data.brand,
                categoryId: data.categoryId,
                salePrice: data.salePrice,
                marketPrice: data.marketPrice,
                stockQuantity: data.stockQuantity,
                description: data.description,
                imageUrl: data.imageUrl
            }
        });
    }

    async updateStock(id: string, quantity: number): Promise<any> {
        return prisma.product.update({
            where: { id },
            data: { stockQuantity: { increment: quantity } }
        });
    }
}
