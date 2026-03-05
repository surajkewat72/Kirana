import { Order } from '../entities/Order';
import { OrderState } from './OrderState';

/**
 * PENDING STATE
 */
export class PendingState implements OrderState {
    getStatus(): string { return 'PENDING'; }
    
    next(order: Order): void {
        console.log("Order moving from PENDING to PROCESSING.");
        order.setState(new ProcessingState());
    }

    cancel(order: Order): void {
        console.log("Order CANCELLED from PENDING.");
        order.setState(new CancelledState());
    }
}

/**
 * PROCESSING STATE
 */
export class ProcessingState implements OrderState {
    getStatus(): string { return 'PROCESSING'; }

    next(order: Order): void {
        console.log("Order moving from PROCESSING to DELIVERED.");
        order.setState(new DeliveredState());
    }

    cancel(order: Order): void {
        console.log("Order CANCELLED from PROCESSING.");
        order.setState(new CancelledState());
    }
}

/**
 * DELIVERED STATE (Final State)
 */
export class DeliveredState implements OrderState {
    getStatus(): string { return 'DELIVERED'; }

    next(order: Order): void {
        throw new Error("Cannot move next from DELIVERED. It is a final state.");
    }

    cancel(order: Order): void {
        throw new Error("Cannot cancel a DELIVERED order.");
    }
}

/**
 * CANCELLED STATE (Final State)
 */
export class CancelledState implements OrderState {
    getStatus(): string { return 'CANCELLED'; }

    next(order: Order): void {
        throw new Error("Cannot move next from CANCELLED.");
    }

    cancel(order: Order): void {
        throw new Error("Order is already CANCELLED.");
    }
}
