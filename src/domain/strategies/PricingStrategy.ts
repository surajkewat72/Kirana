import { Order } from '../entities/Order';

/**
 * Strategy Interface for Pricing (Abstraction/Polymorphism)
 */
export interface PricingStrategy {
    calculateTotal(items: any[]): number;
}

/**
 * Strategy Implementation for Regular Pricing
 */
export class RegularPricingStrategy implements PricingStrategy {
    calculateTotal(items: any[]): number {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
}

/**
 * Strategy Implementation for Discounted Pricing
 */
export class BulkDiscountPricingStrategy implements PricingStrategy {
    calculateTotal(items: any[]): number {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return total > 500 ? total * 0.9 : total; // 10% discount for orders over 500
    }
}

/**
 * Strategy Interface for Payment (Abstraction/Polymorphism)
 */
export interface PaymentStrategy {
    processPayment(amount: number): Promise<boolean>;
}

/**
 * Strategy Implementation for UPI Payment
 */
export class UPIPaymentStrategy implements PaymentStrategy {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Processing UPI payment for ${amount}`);
        return true;
    }
}

/**
 * Strategy Implementation for Cash Payment
 */
export class CashPaymentStrategy implements PaymentStrategy {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Cash on delivery for ${amount}`);
        return true;
    }
}
