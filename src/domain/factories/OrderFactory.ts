import { Order, OrderItem } from '../entities/Order';
import { Customer } from '../entities/User';
import { PricingStrategy } from '../strategies/PricingStrategy';

/**
 * Order Factory (Creation Pattern)
 * Encapsulates the logic of complex Order entity creation.
 */
export class OrderFactory {
    public static createOrder(
        customer: Customer, 
        items: any[], 
        strategy: PricingStrategy
    ): Order {
        const total = strategy.calculateTotal(items);
        
        const orderItems: OrderItem[] = items.map(p => ({
            productId: p.id,
            quantity: p.quantity,
            priceAtPurchase: p.price
        }));

        return new Order({
            userId: customer.id,
            totalAmount: total,
            items: orderItems,
            status: 'PENDING',
            orderedAt: new Date()
        });
    }
}
