import { v4 as uuidv4 } from 'uuid';
import { OrderState } from '../states/OrderState';
import { PendingState, ProcessingState, DeliveredState, CancelledState } from '../states/ConcreteStates';

export enum OrderType {
    STANDARD = 'STANDARD',
    EXPRESS = 'EXPRESS'
}

export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
}

/**
 * Order Entity
 * Encapsulates internal state and validation via State Pattern.
 */
export class Order {
    public id: string;
    public userId: string;
    public totalAmount: number;
    public items: OrderItem[];
    public orderedAt: Date;
    public type: OrderType;
    private state: OrderState;

    constructor(data: any) {
        this.id = data.id || uuidv4();
        this.userId = data.userId;
        this.totalAmount = data.totalAmount || 0;
        this.items = data.items || [];
        this.orderedAt = data.orderedAt || new Date();
        this.type = data.type || OrderType.STANDARD;
        
        // Initial state mapping from data or PENDING
        this.state = this.mapStatusToState(data.status || 'PENDING');
    }

    private mapStatusToState(status: string): OrderState {
        switch (status) {
            case 'PROCESSING': return new ProcessingState();
            case 'DELIVERED': return new DeliveredState();
            case 'CANCELLED': return new CancelledState();
            default: return new PendingState();
        }
    }

    /**
     * State Delegation (Behavioral Pattern)
     */
    public next(): void {
        this.state.next(this);
    }

    public cancel(): void {
        this.state.cancel(this);
    }

    public getStatus(): string {
        return this.state.getStatus();
    }

    public setState(state: OrderState): void {
        this.state = state;
    }

    public addItem(item: OrderItem): void {
        this.items.push(item);
        this.calculateTotal();
    }

    private calculateTotal(): void {
        this.totalAmount = this.items.reduce(
            (acc, item) => acc + (item.priceAtPurchase * item.quantity), 
            0
        );
    }
}
