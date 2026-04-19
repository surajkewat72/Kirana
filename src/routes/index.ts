import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

// Database Health Diagnostic
router.get('/health/db', async (req: Request, res: Response) => {
    try {
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        res.json({ 
            success: true, 
            database: 'Connected', 
            stats: { products: productCount, categories: categoryCount },
            env: { node_env: process.env.NODE_ENV }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, database: 'Error', message: error.message });
    }
});

// Force Seed Trigger (Diagnostic)
router.get('/admin/seed-now', async (req: Request, res: Response) => {
    try {
        console.log('--- Force Seed Triggered via Browser ---');
        const { exec } = require('child_process');
        
        // Use a Promise to wait for the seed output
        exec('npx prisma db seed', (error: any, stdout: string, stderr: string) => {
            if (error) {
                console.error(`[Seed Error] \${error}`);
            }
            console.log(`[Seed Output] \${stdout}`);
        });
        
        res.json({ 
            success: true, 
            message: 'Force seeding started in the background.',
            next_step: 'Refresh /api/v1/health/db in 30 seconds to see the count increase.'
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
