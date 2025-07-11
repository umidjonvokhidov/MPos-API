# MPos Restaurant API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require authentication using JWT Bearer tokens.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- **admin**: Full access to all resources
- **chef**: Can manage products and view transactions
- **waiter**: Can manage transactions and view products
- **customer**: Can create transactions and view their own data

---

## 🔐 Authentication Endpoints

### 1. User Registration
```http
POST /auth/sign-up
```

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

### 2. User Login
```http
POST /auth/sign-in
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

### 3. Refresh Token
```http
POST /auth/refresh-token
```

**Response:**
```json
{
  "accessToken": "new_jwt_token_here"
}
```

### 4. User Logout
```http
POST /auth/sign-out
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out"
}
```

### 5. OAuth Login (Google/Apple)
```http
GET /auth/google
GET /auth/apple
```

---

## 👥 User Management Endpoints

### 1. Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer <admin_token>
```

### 2. Get User Profile
```http
GET /users/:id
Authorization: Bearer <token>
```

### 3. Create User (Public)
```http
POST /users
Content-Type: multipart/form-data
```

**Form Data:**
- `firstname`: "John"
- `lastname`: "Doe"
- `email`: "john@example.com"
- `password`: "password123"
- `role`: "customer"
- `profilePicture`: [file] (optional)

### 4. Update User Profile
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### 5. Delete User (Admin Only)
```http
DELETE /users/:id
Authorization: Bearer <admin_token>
```

### 6. Get User Settings
```http
GET /users/settings/user/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "language": "en",
    "region": "Tashkent",
    "timeFormat": "24h",
    "dateFormat": "DD-MM-YYYY",
    "notifications": {
      "productUpdated": true,
      "statusOrder": true
    },
    "email": {
      "dailyDigest": true
    }
  }
}
```

### 7. Update User Settings
```http
PUT /users/settings/user/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "language": "en",
  "region": "Tashkent",
  "timeFormat": "24h",
  "dateFormat": "DD-MM-YYYY",
  "notifications": {
    "productUpdated": true,
    "statusOrder": true
  },
  "email": {
    "dailyDigest": true
  }
}
```

---

## 🍽️ Product Management Endpoints

### 1. Get All Products (Public)
```http
GET /products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Margherita Pizza",
      "description": "Classic tomato and mozzarella pizza",
      "price": 15.99,
      "category": "Food",
      "image": "uploads/products/pizza.jpg",
      "ingredients": ["tomato", "mozzarella", "basil"],
      "stock": 50,
      "createdBy": "user_id"
    }
  ]
}
```

### 2. Get Single Product (Public)
```http
GET /products/:id
```

### 3. Create Product (Chef/Admin Only)
```http
POST /products
Authorization: Bearer <chef_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name`: "Margherita Pizza"
- `description`: "Classic tomato and mozzarella pizza"
- `price`: 15.99
- `category`: "Food"
- `ingredients`: ["tomato", "mozzarella", "basil"]
- `stock`: 50
- `image`: [file]

### 4. Update Product (Chef/Admin Only)
```http
PUT /products/:id
Authorization: Bearer <chef_token>
Content-Type: multipart/form-data
```

### 5. Delete Product (Chef/Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <chef_token>
```

---

## 💳 Transaction Management Endpoints

### 1. Get All Transactions (Waiter/Chef/Admin Only)
```http
GET /transactions
Authorization: Bearer <waiter_token>
```

**Query Parameters:**
- `type_service`: "Delivery" | "Take Away" | "Dine In"
- `product_category`: "Drink" | "Food" | "Dessert" | "Stick" | "Other"

### 2. Get Single Transaction
```http
GET /transactions/:id
Authorization: Bearer <token>
```

### 3. Create Transaction (Authenticated Users)
```http
POST /transactions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userID": "user_id",
  "fullname": "John Doe",
  "typeService": "Dine In",
  "totalPrice": 45.97,
  "products": [
    {
      "productId": "product_id",
      "count": 2,
      "price": 15.99
    }
  ],
  "paymentMethod": "Credit Card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "transaction_id",
    "userID": "user_id",
    "fullname": "John Doe",
    "typeService": "Dine In",
    "totalPrice": 45.97,
    "status": "pending",
    "products": [...],
    "paymentMethod": "Credit Card",
    "paymentStatus": "pending"
  }
}
```

### 4. Update Transaction (Waiter/Chef/Admin Only)
```http
PUT /transactions/:id
Authorization: Bearer <waiter_token>
```

**Request Body:**
```json
{
  "status": "completed",
  "paymentStatus": "completed"
}
```

### 5. Delete Transaction (Waiter/Chef/Admin Only)
```http
DELETE /transactions/:id
Authorization: Bearer <waiter_token>
```

---

## 🔔 Notification Endpoints

### 1. Get All Notifications (Admin Only)
```http
GET /notifications
Authorization: Bearer <admin_token>
```

### 2. Get User Notifications
```http
GET /notifications/user/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "notification_id",
      "user": "user_id",
      "title": "Order Completed",
      "message": "Your order has been completed successfully!",
      "status": "unread",
      "type": "order_status"
    }
  ]
}
```

### 3. Get Single Notification
```http
GET /notifications/:id
Authorization: Bearer <token>
```

### 4. Update Notification
```http
PUT /notifications/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "read"
}
```

### 5. Mark All Notifications as Read
```http
POST /notifications/markAllasRead/:id
Authorization: Bearer <token>
```

### 6. Create Notification (Admin Only)
```http
POST /notifications
Authorization: Bearer <admin_token>
```

### 7. Delete Notification (Admin Only)
```http
DELETE /notifications/:id
Authorization: Bearer <admin_token>
```

---

## 💰 Stripe Payment Endpoints

### 1. Create Payment Intent
```http
POST /stripe/create-payment-intent
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "usd"
}
```

**Response:**
```json
{
  "clientSecret": "..."
}
```

---

## 📁 File Upload

### Supported File Types
- **User Profile Pictures**: JPG, PNG, GIF (max 5MB)
- **Product Images**: JPG, PNG, GIF (max 10MB)

### Upload Directories
- User photos: `uploads/users/`
- Product images: `uploads/products/`

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied. Role waiter is not authorized to access this resource."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "User not found!"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "User already exists"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "error": "Email is required, Password is required"
}
```

---

## 🚦 Rate Limiting & Security

- **Rate limiting:** 100 requests per 15 minutes per IP
- **Security headers:** Provided by Helmet middleware
- **CORS:** Enabled for cross-origin requests

---

## 🧪 Automated Testing

- Run all major endpoint tests with:
  ```bash
  npm test
  ```
- See `test-api.js` for test script details.

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create `.env.development.local`:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=15m
   REFRESH_SECRET=your_refresh_secret
   STRIPE_API_KEY=your_stripe_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   APPLE_CLIENT_ID=your_apple_client_id
   # ...other variables as needed
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Test API:**
   ```bash
   curl http://localhost:5000/api/v1/
   ```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Object IDs are MongoDB ObjectId strings
- File uploads use multipart/form-data
- JWT tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Rate limiting: 100 requests per 15 minutes per IP 