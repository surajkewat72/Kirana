# Project Idea: KiranaConnect

**KiranaConnect** is a comprehensive Full Stack Application designed to modernize local Kirana stores by providing a robust digital platform for inventory management and online customer ordering. It bridges the gap between traditional local grocery stores and modern e-commerce convenience.

## Scope
The application will serve two primary types of users: **Store Administrators (Owners)** and **Customers**.
-   **For Store Owners**: A powerful dashboard to manage the vast inventory (derived from `Kirana.csv`), track sales, and manage customer orders efficiently.
-   **For Customers**: A user-friendly interface to browse products, search for daily essentials, manage a shopping cart, and place orders for home delivery.

## Key Features

### 1. Public / Customer Facing
-   **Product Catalog**: Browse products by Category, Sub-Category, and Brand.
-   **Smart Search**: Search functionality to find products by name or description.
-   **Product Details**: View detailed information including sale price vs market price (discounts), ratings, and descriptions.
-   **Shopping Cart**: Add items, adjust quantities, and view total cost in real-time.
-   **Secure Checkout**: Place orders with delivery details.
-   **Order History**: View past orders and current order status.
-   **User Authentication**: Sign up and Login secure access.

### 2. Admin / Store Operations (Backend Heavy)
-   **Inventory Management**: Full CRUD capabilities for Products. Capability to bulk import/export data (leveraging the CSV structure).
-   **Order Management**: View incoming orders, update status (Pending, Processing, Delivered, Cancelled).
-   **Analytics (Basic)**: View total sales, popular products, and low stock alerts.
-   **User Management**: View registered customers.

## Technical Highlights (Scoring Focus)
-   **Backend Architecture**: Built with a clean **Layered Architecture** (Controller -> Service -> Repository).
-   **Database**: Relational Database (SQL) to handle complex relationships between Products, Categories, Orders, and Users.
-   **OOP Design**: Extensive use of Object-Oriented Programming principles.
    -   **Inheritance**: Base entities and specialized users.
    -   **Polymorphism**: Payment methods (Cash/Card - placeholder implementation), Order states.
    -   **Encapsulation**: Strict data access control within services.
-   **Design Patterns**:
    -   **Singleton**: For Database connections.
    -   **Factory**: For creating Order objects.
    -   **Strategy**: For price calculation (handling discounts/offers).
-   **RESTful API**: Standardized API endpoints for frontend consumption.
