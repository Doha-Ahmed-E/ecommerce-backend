# E-commerce Backend API

A complete e-commerce backend built with **Next.js**, **Prisma**, **PostgreSQL**, and **JWT authentication** 

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL installed and running

### Database Setup

1. **Set up PostgreSQL database:**
   ```sql
   psql postgres
   CREATE USER ecommerce_user WITH PASSWORD 'your_password';
   CREATE DATABASE ecommerce_db OWNER ecommerce_user;
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
   \q
   ```

2. **Configure environment variables:**
   Create `.env` in the `ecommerce-backend` directory
   ```env
   DATABASE_URL="postgresql://ecommerce_user:your_password@localhost:5432/ecommerce_db?schema=public"
   JWT_SECRET="your_jwt_secret_here"
   NEXTAUTH_SECRET="your_nextauth_secret"
   ```

3. **Install dependencies:**
   Navigate to the `ecommerce-backend` directory and install packages:
   ```bash
   cd ecommerce-backend
   npm install
   ```

4. **Initialize database:**
   Make sure you're in the `ecommerce-backend` directory:
   ```bash
   npm run db:setup
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

---

## 🔐 Authentication System

This API uses **JWT (JSON Web Token)** authentication for simplicity and ease of testing.

### How to Authenticate

**Step 1: Create a User**
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "test123"
}
```

**Step 2: Login to Get JWT Token**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "test123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Step 3: Use Token in Requests**
Add this header to all protected endpoint requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 API Endpoints

| Method | URL                        | Description          | Auth Required |
| ------ | -------------------------- | -------------------- | ------------- |
| POST   | /api/auth/signup           | Register new user    | No            |
| POST   | /api/auth/login            | Login user (get JWT) | No            |
| GET    | /api/users                 | Get current user     | Yes           |
| PATCH  | /api/users                 | Update user details  | Yes           |
| GET    | /api/products              | Get all products     | No            |
| POST   | /api/products              | Create product       | Yes           |
| GET    | /api/products/:id          | Get product by ID    | No            |
| PATCH  | /api/products/:id          | Update product       | Yes           |
| DELETE | /api/products/:id          | Delete product       | Yes           |
| GET    | /api/categories            | Get all categories   | No            |
| POST   | /api/categories            | Create category      | Yes           |
| GET    | /api/categories/:id        | Get category by ID   | No            |
| PATCH  | /api/categories/:id        | Update category      | Yes           |
| DELETE | /api/categories/:id        | Delete category      | Yes           |
| POST   | /api/cart                  | Create cart          | Yes           |
| DELETE | /api/cart                  | Delete cart          | Yes           |
| GET    | /api/cartItems/:cartId     | Get cart items       | Yes           |
| POST   | /api/cartItems/:cartId     | Add item to cart     | Yes           |
| GET    | /api/cartitems/:cartItemId | Get cart item by ID  | Yes           |
| PATCH  | /api/cartitems/:cartItemId | Update cart item     | Yes           |

---

## 🧪 Testing Guide

### Using Insomnia/Postman

**1. Setup Environment**
- Base URL: `http://localhost:3000`
- Create environment variable: `token` for storing JWT

**2. Authentication Flow**
```bash
# 1. Create user
POST {{base_url}}/api/auth/signup
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123"
}

# 2. Login and get token
POST {{base_url}}/api/auth/login
{
  "username": "testuser", 
  "password": "test123"
}
# Copy the "token" value from response

# 3. Set Authorization header for protected endpoints
Authorization: Bearer {{token}}
```

**3. Test CRUD Operations**

**Categories:**
```bash
# Create category
POST {{base_url}}/api/categories
Authorization: Bearer {{token}}
{
  "name": "Electronics",
  "description": "Electronic devices"
}

# Get all categories (public)
GET {{base_url}}/api/categories

# Update category
PATCH {{base_url}}/api/categories/1
Authorization: Bearer {{token}}
{
  "name": "Updated Electronics"
}
```

**Products:**
```bash
# Create product
POST {{base_url}}/api/products
Authorization: Bearer {{token}}
{
  "name": "iPhone 15",
  "description": "Latest iPhone",
  "price": 999.99,
  "stock": 50,
  "categoryId": 1
}

# Get all products (public)
GET {{base_url}}/api/products

# Update product
PATCH {{base_url}}/api/products/1
Authorization: Bearer {{token}}
{
  "price": 899.99,
  "stock": 45
}
```

**Shopping Cart:**
```bash
# Create cart
POST {{base_url}}/api/cart
Authorization: Bearer {{token}}
{}

# Add item to cart
POST {{base_url}}/api/cartItems/1
Authorization: Bearer {{token}}
{
  "productId": 1,
  "quantity": 2
}

# Get cart items
GET {{base_url}}/api/cartItems/1
Authorization: Bearer {{token}}

# Update cart item quantity
PATCH {{base_url}}/api/cartitems/1
Authorization: Bearer {{token}}
{
  "quantity": 3
}
```

---

## ✅ Expected Results

### Public Endpoints
- `GET /api/products` → `[]` (empty array initially)
- `GET /api/categories` → `[]` (empty array initially)

### Authentication
- `POST /api/auth/signup` → `201 Created` with user object
- `POST /api/auth/login` → `200 OK` with JWT token and user data

### Protected Endpoints
- **Without Authorization header:** `401 Unauthorized`
- **With valid JWT token:** `200 OK` with requested data

### CRUD Operations
- **Create operations:** Return `201 Created` with created object
- **Read operations:** Return `200 OK` with data
- **Update operations:** Return `200 OK` with updated object
- **Delete operations:** Return `200 OK` with success message

---