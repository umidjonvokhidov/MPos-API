# MPos-API

MPos-API is a backend RESTful API for a restaurant Point-of-Sale (POS) system. The project provides robust authentication, user and role management, product and transaction handling, notification services, and file upload support, designed for seamless integration with frontend applications.

---

## 🚀 Features

- **JWT-based authentication** with refresh tokens
- **Role-based access control**: admin, chef, waiter, customer
- **User management**: registration, profile, settings
- **Product management**: create, update, delete, and view products
- **Transaction management**: order and payment processing
- **Real-time notifications** system
- **File uploads** (profile pictures, etc.)
- **Comprehensive error handling**
- **Rate limiting:** 100 requests per 15 minutes per IP
- **API documentation:** see [`API_ENDPOINTS.md`](API_ENDPOINTS.md)

---

## 🛠️ Technology Stack

- **Node.js** + **Express.js**
- **MongoDB** (with Mongoose)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **dotenv** for environment configuration

---

## 📦 Installation & Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/umidjonvokhidov/MPos-API.git
   cd MPos-API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.development.local` file in the root directory with contents like:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=15m
   REFRESH_SECRET=your_refresh_secret
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Test the API:**
   ```bash
   curl http://localhost:5000/api/v1/
   ```

---

## 🧑‍💻 API Overview

- **Base URL:** `http://localhost:5000/api/v1/`
- **Authentication:** Most endpoints require a JWT bearer token in the `Authorization` header.

### Example Endpoints

- **Auth:** `POST /auth/sign-in`, `POST /auth/sign-up`, `POST /auth/refresh-token`, `POST /auth/sign-out`
- **Users:** `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
- **Products:** `GET /products`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
- **Transactions:** `GET /transactions`, `POST /transactions`
- **Notifications:** `GET /notifications`, `POST /notifications`

See [`API_ENDPOINTS.md`](API_ENDPOINTS.md) for full details and example requests/responses.

---

## 🛡️ User Roles

- **admin:** Full access
- **chef:** Manage products, view transactions
- **waiter:** Manage/view transactions, view products
- **customer:** Create/view own transactions & data

---

## 📋 Response Format

All API responses follow:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": { ... }
}
```
Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 📝 Notes

- Timestamps: ISO 8601 format
- Object IDs: MongoDB ObjectId strings
- File uploads: `multipart/form-data`
- JWT tokens: expire in 15 minutes, refresh tokens in 7 days

---

## 📚 Documentation

- Full API endpoint documentation: [`API_ENDPOINTS.md`](API_ENDPOINTS.md)
- Backend implementation summary: [`BACKEND_SUMMARY.md`](BACKEND_SUMMARY.md)

---

---

## 📄 License

Distributed under the MIT License.
