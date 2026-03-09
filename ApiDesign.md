# Kirana RESTful API Documentation

This document defines the RESTful API standards and endpoints for the Kirana platform, focusing on security, consistency, and scalability.

## 1. Global Standards

### Base URL
`/api/v1`

### Standard Response Format
All successful responses will be wrapped in a consistent JSON structure.

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "metadata": {
    "pagination": { "page": 1, "limit": 10, "total": 100 }
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "USR_ORD_001",
    "message": "Validation failed",
    "details": { "email": "Invalid format" }
  }
}
```

### Common Status Codes
- `200 OK`: Success.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or client-side error.
- `401 Unauthorized`: Token missing or invalid.
- `403 Forbidden`: Insufficient permissions (e.g., Customer accessing Admin API).
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Unexpected server error.

---

## 2. Authentication APIs
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/auth/register` | POST | Register a new CUSTOMER. | No |
| `/auth/login` | POST | Authenticate and get JWT. | No |
| `/auth/profile` | GET | Retrieve own profile data. | Yes |

### POST `/auth/register`
- **Body**: `{ "name", "email", "password", "phone", "address" }`
- **Response**: `201 Created` with User data.

---

## 3. Product APIs
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/products` | GET | List and search products. | No |
| `/products/:id` | GET | Detailed product info. | No |
| `/categories` | GET | List all available categories. | No |

### GET `/products`
- **Query Params**: `search`, `category_id`, `sort_by`, `page`, `limit`.
- **Response**: `200 OK` with prioritized results (B-Tree/GIN lookup).

---

## 4. Cart APIs (Requires Login)
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/cart` | GET | View current cart items. | Yes |
| `/cart/items` | POST | Add or Update quantity. | Yes |
| `/cart/items/:id` | DELETE | Remove item from cart. | Yes |

### POST `/cart/items`
- **Body**: `{ "product_id", "quantity" }`
- **Response**: `200 OK` with updated Cart summary.

---

## 5. Order APIs (Requires Login)
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/orders` | POST | Place an order from current cart. | Yes |
| `/orders` | GET | List own order history. | Yes |
| `/orders/:id` | GET | Detailed order info + tracking. | Yes |

### POST `/orders`
- **Body**: `{ "payment_method", "shipping_address_override" }`
- **Logic**: Uses `OrderFactory` and `PricingStrategy`.
- **Response**: `201 Created` with Order ID and Amount.

---

## 6. Admin APIs (Requires ADMIN Role)
| Endpoint | Method | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `/admin/products` | POST | Add new product. | ADMIN |
| `/admin/products/:id` | PUT | Update inventory/stock. | ADMIN |
| `/admin/orders` | GET | View all customer orders. | ADMIN |
| `/admin/orders/:id/status` | PATCH | Update order tracking (PENDING, SHIPPED, etc.). | ADMIN |
| `/admin/analytics` | GET | Sales and Popular product reports. | ADMIN |

---

## 7. Middleware & Validation Strategy

### Validation Strategy (e.g., Zod / Joi)
Incoming requests are validated against strict schemas before they reach the controller. This prevents Malformed bodies and Type mismatches at the entry point.

### Middleware Layer
1. **Request Logger**: Logs `[Timestamp] Method URL UserAgent` for observability.
2. **Auth Guard**:
   - `verifyJWT`: Decodes the Bearer token and populates `req.user`.
   - `checkRole(['ADMIN'])`: Restricts access based on the role in the token payload.
3. **Internal Error Handler**:
   - Catches all uncaught exceptions.
   - Masks internal stack traces in production.
   - Logs errors to a central monitoring system (e.g., Sentry, CloudWatch).
