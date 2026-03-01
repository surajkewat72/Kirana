# Kirana Database Design Documentation

This document provides a deep dive into the relational database architecture designed for the Kirana platform, optimized for high performance and scalability.

## 1. Relationship Mapping

| Entities | Relationship | Description |
| :--- | :--- | :--- |
| **User : Order** | 1:N | A customer can place multiple orders over time. |
| **Order : Product** | M:N | An order can contain multiple products, and a product can be part of multiple orders. Resolved via `order_items`. |
| **Category : Product** | 1:N | A category contains many products. A product belongs to one primary category. |
| **User : Cart** | 1:1 | Each user has exactly one active cart for session persistence. |
| **Order : Payment** | 1:1 | Every order maps to exactly one payment record (even if failed). |

---

## 2. Indexing Strategy

To ensure sub-second response times, the following indices have been implemented:

- **Primary B-Tree Indices**: Automatically created on all UUID primary keys.
- **Foreign Key Indices**: Created on `category_id`, `user_id`, and `order_id` to speed up joins.
- **Full-Text Search (GIN)**: A Generalized Inverted Index (GIN) is placed on `products.name` to allow fast searching for items like "Rice" or "Oil".
  - `CREATE INDEX idx_products_name ON products USING gin (to_tsvector('english', name));`
- **Partial Indexing**: An index on `users.email` that only includes non-deleted users to keep the unique constraint while allowing soft-deleted duplicates.
  - `CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;`

---

## 3. Optimization Suggestions

### Batch Updates
For the **Admin Inventory CRUD**, utilize bulk inserts/updates when processing CSV files into the database. This reduces the number of round-trips to the DB.

### Materialized Views
For **Analytics**, use Materialized Views for complex sales reports. These can be refreshed periodically (e.g., every hour) instead of calculating total sales on every request.

### Connection Pooling
Implement a connection pooler like **PgBouncer** in front of PostgreSQL to manage thousands of concurrent client connections efficiently.

---

## 4. Scalability Analysis

### Primary Key Selection (UUID v4)
Using UUIDs prevents ID enumeration attacks and allows for seamless record merges across different database shards if the system grows beyond a single instance.

### Vertical & Horizontal Scaling
- **Read Replicas**: The "Product Catalog" and "Search" features (read-heavy) can be offloaded to Read Replicas, while the "Orders" and "Cart" (write-heavy) stay on the Primary instance.
- **Partitioning**: As the `orders` and `order_items` tables grow into the millions, we can implement **Table Partitioning** by `ordered_at` (e.g., monthly partitions) to keep index sizes manageable and improve query performance for recent data.

### Normalization vs Denormalization
The schema is normalized to **3NF** to ensure data integrity. However, for extreme scale, we could selectively denormalize `price_at_purchase` into `order_items` (already implemented) to avoid costly joins with the `products` table for historical orders.
