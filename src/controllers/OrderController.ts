import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { Customer } from '../domain/entities/User';
import { RegularPricingStrategy, BulkDiscountPricingStrategy, UPIPaymentStrategy, CashPaymentStrategy } from '../domain/strategies/PricingStrategy';

/**
 * Order Controller (Presentation Layer)
 * Handles incoming REST requests.
 */
export class OrderController {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
        this.placeOrder = this.placeOrder.bind(this);
    }

    public async placeOrder(req: Request, res: Response): Promise<void> {
        // ... (existing code omitted for brevity in replacement, but I'll provide full block)
        try {
            const { cartItems, paymentMethod } = req.body;
            const customerData = (req as any).user || {
                id: 'mock-id',
                name: 'Guest User',
                email: 'guest@example.com'
            };
            const customer = new Customer(customerData);
            const pricing = cartItems.length > 5 ? new BulkDiscountPricingStrategy() : new RegularPricingStrategy();
            const payment = paymentMethod === 'UPI' ? new UPIPaymentStrategy() : new CashPaymentStrategy();
            const result = await this.orderService.placeOrder(customer, cartItems, pricing, payment);

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                order: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    public async getUserOrders(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (!user) {
                res.status(401).json({ success: false, message: 'Not authenticated' });
                return;
            }

            const orders = await this.orderService.getUserOrders(user.id);
            res.json({ success: true, data: orders });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
