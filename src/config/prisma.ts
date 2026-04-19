import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client
 */
export class PrismaService {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaClient({
                log: ['error', 'warn'],
            });
            
            // Log successful connection
            PrismaService.instance.$connect()
                .then(() => console.log('✅ Prisma connected to Database Successfully'))
                .catch((err) => console.error('❌ Prisma Connection Error:', err.message));
        }
        return PrismaService.instance;
    }
}

export const prisma = PrismaService.getInstance();
