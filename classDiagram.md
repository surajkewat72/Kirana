# Kirana Senior-Level Class Diagram

This diagram demonstrates advanced OOP principles, design patterns (Singleton, Factory, Strategy), and Clean Architecture layering.

```mermaid
classDiagram
    %% --- Design Patterns ---

    %% Singleton Pattern for DB
    class DatabaseManager {
        -static DatabaseManager instance
        -Connection connection
        -DatabaseManager()
        +static DatabaseManager getInstance()
        +getConnection() Connection
    }

    %% Strategy Pattern for Pricing
    interface PricingStrategy {
        +calculate(double baseAmount) double
    }
    class FixedPricingStrategy {
        +calculate(double baseAmount) double
    }
    class DiscountPricingStrategy {
        +calculate(double baseAmount) double
    }

    %% Factory Pattern for Orders
    class OrderFactory {
        +createOrder(Customer customer, Cart cart) Order
    }

    %% --- Core Domain Entities (Inheritance & Encapsulation) ---

    class User {
        <<Abstract>>
        -int id
        -string name
        -string email
        -string password
        +login() bool
        +logout() void
    }

    class Customer {
        -string address
        -string phone
        +viewOrderHistory()
        +placeOrder()
    }

    class Admin {
        -int accessLevel
        +manageInventory()
        +viewAnalytics()
    }

    User <|-- Customer : Inheritance
    User <|-- Admin : Inheritance

    class Product {
        -int id
        -string name
        -double salePrice
        -int stockCount
        +updateStock(int quantity)
        +isAvailable() bool
    }

    class Order {
        -int id
        -Date orderDate
        -double totalAmount
        -OrderStatus status
        +process()
        +cancel()
    }

    %% --- Layers (Clean Architecture) ---

    class OrderController {
        -OrderService orderService
        +postOrder(OrderRequest dto) Response
    }

    class OrderService {
        -OrderRepository repository
        -PricingStrategy priceStrategy
        -OrderFactory factory
        +executeOrder(OrderRequest dto) OrderResponse
    }

    class OrderRepository {
        <<Interface>>
        +save(Order order) void
        +findById(int id) Order
    }

    %% --- Relationships ---

    OrderController --> OrderService : Composition
    OrderService --> OrderRepository : Dependency Injection
    OrderService --> PricingStrategy : Strategy Usage
    OrderService --> OrderFactory : Factory Usage
    OrderService --> DatabaseManager : Singleton Access

    PricingStrategy <|.. FixedPricingStrategy : Implementation
    PricingStrategy <|.. DiscountPricingStrategy : Implementation

    Order "1" *-- "*" OrderItem : Composition
    Customer "1" -- "*" Order : Association
    Product "1" -- "*" OrderItem : Reference
```

## Implementation Details

1.  **Encapsulation**: All fields are private (`-`), accessed via methods.
2.  **Inheritance**: `User` is an abstract base class for `Customer` and `Admin`.
3.  **Abstraction**: `OrderRepository` and `PricingStrategy` are interfaces/abstracts to decouple implementation from business logic.
4.  **Singleton**: `DatabaseManager` ensures only one instance of the connection pool exists.
5.  **Factory**: `OrderFactory` centralizes the complex logic of converting a Cart into a finalized Order.
6.  **Strategy**: `PricingStrategy` allows the system to swap discount algorithms without modifying the `OrderService`.
7.  **Polymorphism**: The `OrderService` calls `priceStrategy.calculate()`, behaving differently depending on whether it's `Fixed` or `Discount` strategy.
