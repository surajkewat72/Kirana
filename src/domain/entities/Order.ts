import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
}

/**
 * Order Entity
 * Encapsulates internal state and validation.
 */
export class Order {
    public id: string;
    public userId: string;
    public totalAmount: number;
    public status: OrderStatus;
    public items: OrderItem[];
    public orderedAt: Date;

    constructor(data: any) {
        this.id = data.id || uuidv4();
        this.userId = data.userId;
        this.totalAmount = data.totalAmount || 0;
        this.status = data.status || OrderStatus.PENDING;
        this.items = data.items || [];
        this.orderedAt = data.orderedAt || new Date();
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

    public updateStatus(status: OrderStatus): void {
        this.status = status;
    }
}
