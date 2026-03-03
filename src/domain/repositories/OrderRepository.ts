import { Order } from '../entities/Order';

/**
 * Generic Base Repository Interface (Abstraction)
 */
export abstract class BaseRepository<T> {
    abstract findById(id: string): Promise<T | null>;
    abstract save(entity: T): Promise<void>;
    abstract delete(id: string): Promise<void>;
}

/**
 * Order Repository Interface
 */
export abstract class OrderRepository extends BaseRepository<Order> {
    abstract findByUserId(userId: string): Promise<Order[]>;
    abstract updateStatus(orderId: string, status: string): Promise<void>;
}
