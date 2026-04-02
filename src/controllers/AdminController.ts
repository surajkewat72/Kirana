import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { ProductService } from '../services/ProductService';

export class AdminController {
    private adminService: AdminService;
    private productService: ProductService;

    constructor(adminService: AdminService, productService: ProductService) {
        this.adminService = adminService;
        this.productService = productService;
    }

    async getStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.adminService.getDashboardStats();
            res.json({ success: true, data: stats });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async addProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async restockProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const product = await this.productService.updateStock(id, quantity);
            res.json({ success: true, data: product });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.adminService.getAllUsers();
            res.json({ success: true, data: users });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
