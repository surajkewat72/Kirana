# KiranaConnect Use Case Diagram

```mermaid
usecaseDiagram
    actor Customer as "Customer"
    actor Admin as "Store Admin"

    package "KiranaConnect System" {
        usecase "Register / Login" as UC1
        usecase "Browse Products" as UC2
        usecase "Search Requirements" as UC3
        usecase "Add to Cart" as UC4
        usecase "View Cart" as UC5
        usecase "Place Order" as UC6
        usecase "View Order History" as UC7
        usecase "Manage Inventory" as UC8
        usecase "Process Orders" as UC9
        usecase "View Sales Analytics" as UC10
    }

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7

    Admin --> UC1
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10

    UC6 ..> UC1 : <<include>>
    UC8 ..> UC1 : <<include>>
```
