import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts(req.query);
            res.json({ success: true, data: products });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await this.productService.getProductById(req.params.id);
            if (!product) {
                res.status(404).json({ success: false, message: 'Product not found' });
                return;
            }
            res.json({ success: true, data: product });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
