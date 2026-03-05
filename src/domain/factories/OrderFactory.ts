import { Order, OrderItem, OrderType } from '../entities/Order';
import { Customer } from '../entities/User';
import { PricingStrategy } from '../strategies/PricingStrategy';

/**
 * Order Factory (Creation Pattern)
 * Encapsulates the logic of complex Order entity creation for different types.
 */
export class OrderFactory {
    
    /**
     * Create a Standard Order
     */
    public static createStandardOrder(
        customer: Customer, 
        items: any[], 
        strategy: PricingStrategy
    ): Order {
        return this.createOrder(customer, items, strategy, OrderType.STANDARD);
    }

    /**
     * Create an Express Order (with priority fee)
     */
    public static createExpressOrder(
        customer: Customer, 
        items: any[], 
        strategy: PricingStrategy
    ): Order {
        const order = this.createOrder(customer, items, strategy, OrderType.EXPRESS);
        // Express orders might have a mandatory ₹50 priority fee
        order.totalAmount += 50; 
        return order;
    }

    /**
     * Private base creation logic
     */
    private static createOrder(
        customer: Customer, 
        items: any[], 
        strategy: PricingStrategy,
        type: OrderType
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
            type: type,
            orderedAt: new Date()
        });
    }
}
