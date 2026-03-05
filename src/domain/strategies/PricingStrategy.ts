/**
 * Strategy Interface for Pricing (Abstraction/Polymorphism)
 */
export interface PricingStrategy {
    calculateTotal(items: any[]): number;
}

/**
 * Strategy 1: Regular Pricing
 * Standard calculation without any discounts.
 */
export class RegularPricingStrategy implements PricingStrategy {
    calculateTotal(items: any[]): number {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
}

/**
 * Strategy 2: Discount Pricing (Volume Based)
 * Applies a 10% discount if the total exceeds ₹500.
 */
export class BulkDiscountPricingStrategy implements PricingStrategy {
    calculateTotal(items: any[]): number {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return total > 500 ? total * 0.9 : total;
    }
}

/**
 * Strategy 3: Festival Pricing (Seasonal)
 * Applies a flat 20% discount on all items regardless of volume.
 */
export class FestivalPricingStrategy implements PricingStrategy {
    calculateTotal(items: any[]): number {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return total * 0.8; // 20% flat discount
    }
}

/**
 * Strategy Interface for Payment (Abstraction/Polymorphism)
 */
export interface PaymentStrategy {
    processPayment(amount: number): Promise<boolean>;
}

export class UPIPaymentStrategy implements PaymentStrategy {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Processing UPI payment for ₹${amount}`);
        return true;
    }
}

export class CashPaymentStrategy implements PaymentStrategy {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Cash on delivery for ₹${amount}`);
        return true;
    }
}
