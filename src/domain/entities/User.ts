import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER'
}

/**
 * Base User Entity (Abstract Inheritance)
 */
export abstract class BaseUser {
    public id: string;
    public name: string;
    public email: string;
    protected passwordHash: string;
    public role: UserRole;

    constructor(data: any) {
        this.id = data.id || uuidv4();
        this.name = data.name;
        this.email = data.email;
        this.passwordHash = data.passwordHash;
        this.role = data.role;
    }

    abstract getDashboardAccess(): string[];
}

/**
 * Customer Entity
 */
export class Customer extends BaseUser {
    public address: string;
    public phone: string;

    constructor(data: any) {
        super({ ...data, role: UserRole.CUSTOMER });
        this.address = data.address;
        this.phone = data.phone;
    }

    getDashboardAccess(): string[] {
        return ['ORDERS', 'CART', 'PROFILE'];
    }
}

/**
 * Admin Entity
 */
export class Admin extends BaseUser {
    public accessLevel: number;

    constructor(data: any) {
        super({ ...data, role: UserRole.ADMIN });
        this.accessLevel = data.accessLevel || 1;
    }

    getDashboardAccess(): string[] {
        return ['INVENTORY', 'SALES_ANALYTICS', 'USERS', 'ORDERS'];
    }
}
