import { Order } from '../entities/Order';

/**
 * Strategy Interface for Order states (Behavioral Pattern)
 * Defines the common interface for various order status behaviors.
 */
export interface OrderState {
    next(order: Order): void;
    cancel(order: Order): void;
    getStatus(): string;
}
