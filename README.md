# Kirana - Full-Stack Grocery Platform

Kirana is a production-grade, modular monolith grocery platform built with **Node.js**, **Express**, **Prisma ORM**, and **React.js**. It follows **Clean Architecture** principles and implements several advanced **OOP Design Patterns** to ensure scalability and maintainability.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (Running on port 5432)
- **Git**

### 2. Setup
1. Clone the repository and install root dependencies:
   ```bash
   npm install
   ```
2. Configure your environment in [`.env`](file:///Users/surajkewat/Desktop/Kirana/.env):
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kirana_db"
   JWT_SECRET="your-secret-key"
   ```
3. Initialize the database and seed data:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### 3. Run
Start both the backend and frontend simultaneously:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

---

## 🏗️ Architecture & OOP Design

This project is a showcase of clean, architectural code:

- **Clean Architecture Layers**:
  - `Domain`: Pure business logic and entity definitions.
  - `Repositories`: Abstracted data access (Primary implementations use Prisma).
  - `Services`: Orchestrates business rules (e.g., Order Factory, Pricing Strategy).
  - `Controllers`: Express handlers for REST endpoints.

- **Implemented Design Patterns**:
  - **Singleton**: Managed Database connection via [PrismaService](file:///Users/surajkewat/Desktop/Kirana/src/config/prisma.ts).
  - **Factory**: [OrderFactory](file:///Users/surajkewat/Desktop/Kirana/src/domain/factories/OrderFactory.ts) for polymorphic order creation.
  - **Strategy**: Dynamic pricing logic (Festival vs. Regular) in [PricingStrategy.ts](file:///Users/surajkewat/Desktop/Kirana/src/domain/strategies/PricingStrategy.ts).
  - **State**: Precise order lifecycle management (Pending -> Processing -> Delivered) in [OrderState.ts](file:///Users/surajkewat/Desktop/Kirana/src/domain/states/OrderState.ts).

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Core framework.
- **TypeScript**: Type-safe business logic.
- **Prisma ORM**: Modern database mapping and migrations.
- **PostgreSQL**: Robust relational data storage.
- **JWT & Bcrypt**: Secure stateless authentication.

### Frontend
- **React.js (Vite)**: Modern, fast frontend library.
- **Context API**: Clean state management for Auth and Cart.
- **Lucide Icons**: Premium iconography.
- **Axios**: Standardized API communication.

---

## 📊 Analytics & Admin
The platform includes a dedicated **Admin Dashboard** allowing store owners to:
- Monitor **Real-time Revenue**.
- Track **Order Statuses**.
- Manage **Inventory** with automated low-stock alerts.

Developed with ❤️ by the Kirana Team.
