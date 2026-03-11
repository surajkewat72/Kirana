import { Request, Response } from 'express';
import { CartService } from '../services/CartService';

export class CartController {
    private cartService: CartService;

    constructor(cartService: CartService) {
        this.cartService = cartService;
    }

    async getCart(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const cart = await this.cartService.getCart(userId);
            res.json({ success: true, data: cart });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async addItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const { productId, quantity } = req.body;
            const item = await this.cartService.addItem(userId, productId, quantity);
            res.json({ success: true, data: item });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async removeItem(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const { productId } = req.params;
            await this.cartService.removeItem(userId, productId);
            res.json({ success: true, message: 'Item removed from cart' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
