import { OrderRepository } from '../domain/repositories/OrderRepository';
import { Customer } from '../domain/entities/User';
import { OrderFactory } from '../domain/factories/OrderFactory';
import { PricingStrategy } from '../domain/strategies/PricingStrategy';
import { PaymentStrategy } from '../domain/strategies/PricingStrategy'; // Reusing for structure

/**
 * Order Service (Application Layer)
 * Encapsulates the business process of placing an order.
 */
export class OrderService {
    private orderRepo: OrderRepository;

    constructor(orderRepo: OrderRepository) {
        this.orderRepo = orderRepo;
    }

    public async placeOrder(
        customer: Customer, 
        cartItems: any[], 
        pricing: PricingStrategy,
        payment: PaymentStrategy
    ): Promise<any> {
        // 1. Create order through Factory
        const order = OrderFactory.createOrder(customer, cartItems, pricing);

        // 2. Process payment (Polymorphism)
        const paymentResult = await payment.processPayment(order.totalAmount);
        
        if (!paymentResult) {
            throw new Error('Payment failed');
        }

        order.updateStatus('PAID' as any); // Type safety in status logic

        // 3. Persist order (Abstraction)
        await this.orderRepo.save(order);

        return order;
    }
}
