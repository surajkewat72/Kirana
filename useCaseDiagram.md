# Kirana Use Case Diagram

> [!NOTE]
> Since standard `usecaseDiagram` syntax was failing to render, this diagram has been converted to the widely compatible `graph` syntax. It represents the same information.

```mermaid
graph TD
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px;
    classDef uc fill:#e1f5fe,stroke:#333,stroke-width:1px;

    Customer((Customer)):::actor
    Admin((Store Admin)):::actor

    subgraph "Kirana System"
        UC1(Register / Login):::uc
        UC2(Browse Products):::uc
        UC3(Search Requirements):::uc
        UC4(Add to Cart):::uc
        UC5(View Cart):::uc
        UC6(Place Order):::uc
        UC7(View Order History):::uc
        UC8(Manage Inventory):::uc
        UC9(Process Orders):::uc
        UC10(View Sales Analytics):::uc
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7

    Admin --> UC1
    Admin --> UC1
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10

    UC6 -.-> UC1
    UC8 -.-> UC1
```
