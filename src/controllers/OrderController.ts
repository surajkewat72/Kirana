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
        try {
            const { cartItems, paymentMethod } = req.body;
            const customerData = req.user; // Mock user middleware
            const customer = new Customer(customerData);

            // 1. Setup Strategy (Polymorphism)
            const pricing = cartItems.length > 5 ? new BulkDiscountPricingStrategy() : new RegularPricingStrategy();
            const payment = paymentMethod === 'UPI' ? new UPIPaymentStrategy() : new CashPaymentStrategy();

            // 2. Delegate to Service (Encapsulation)
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
}
