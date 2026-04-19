# Kirana - Premium Grocery Platform 🛒

**Live Demo**: [https://kirana-three.vercel.app/](https://kirana-three.vercel.app/)

Kirana is a production-grade, full-stack grocery platform built with a **split-monolith architecture**. It features a high-performance **Node.js/Express** backend with **Prisma ORM** deployed on **Render**, and a sleek, responsive **React/Vite** frontend deployed on **Vercel**.

## 🚀 Deployment Architecture
The platform is optimized for performance and security using professional cloud services:
- **Frontend**: [Vercel](https://vercel.com) (Static hosting with Vite optimization).
- **Backend**: [Render](https://render.com) (Compute-optimized Web Service).
- **Database**: [Render PostgreSQL](https://render.com/docs/databases) (Managed relational database).

---

## 🏗️ Architecture & OOP Design
This project serves as a showcase of **Clean Architecture** and robust **Object-Oriented Programming (OOP)** patterns:

- **Clean Architecture Layers**:
  - `Domain`: Pure business logic and entity definitions.
  - `Repositories`: Abstracted data access via Prisma.
  - `Services`: Core business rule orchestration.
  - `Controllers`: Standardized RESTful endpoints.

- **Implemented Design Patterns**:
  - **Singleton**: Managed Database connection via [PrismaService](src/config/prisma.ts).
  - **Factory**: Polymorphic order creation using the [OrderFactory](src/domain/factories/OrderFactory.ts).
  - **Strategy**: Dynamic pricing algorithms based on festival or regular status.
  - **State**: Precise order lifecycle management (Pending → Paid → Shipped → Delivered).

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Core API framework.
- **TypeScript**: Ensuring type-safety across business logic.
- **Prisma ORM**: Modern database mapping and automated schema handling.
- **PostgreSQL**: Scalable relational data storage.
- **JWT & Bcrypt**: Secure, stateless authentication system.

### Frontend
- **React.js (Vite)**: Ultra-fast frontend development and building.
- **Context API**: Clean state management for global Auth and Cart states.
- **Lucide Icons**: Modern, premium iconography.
- **Axios**: Standardized, interceptor-based API communication.

---

## 🚦 Quick Start (Local)

1. **Install Dependencies**:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```
2. **Environment Setup**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/kirana"
   JWT_SECRET="your-secret"
   ALLOWED_ORIGINS="http://localhost:5173"
   ```
3. **Database Initialization**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. **Run Application**:
   ```bash
   npm run dev
   ```

Developed with ❤️ by the Kirana Team.
