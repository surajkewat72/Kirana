import { Pool } from 'pg';

/**
 * Singleton Database Connection Pool
 * Ensures only one pool instance is created throughout the application lifecycle.
 */
export class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getPool(): Pool {
        return this.pool;
    }

    /**
     * Helper to execute queries
     */
    public async query(text: string, params?: any[]) {
        return this.pool.query(text, params);
    }
}
