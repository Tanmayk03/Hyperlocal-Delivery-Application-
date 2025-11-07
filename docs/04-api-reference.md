## 📡 API Reference

This section documents all major REST API endpoints for the Hyperlocal Delivery Application. The backend is powered by **Express.js**, and routes are organized by resource: auth, products, cart, and orders.

> ✅ **Authentication Required:** All protected routes require a valid JWT in the `Authorization` header:  
> `Authorization: Bearer <token>`

---

### 🧑‍💼 Auth Routes

#### 🔹 Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "Tanmay",
  "email": "tanmay@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Tanmay",
    "email": "tanmay@example.com"
  }
}
```

#### 🔹 Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "tanmay@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { "id": "user_id", "name": "Tanmay", "email": "tanmay@example.com" }
}
```

---

### 📦 Product Routes

#### 🔹 Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `search` - Search products by name
- `category` - Filter by category  
- `sort` - Sort by price, name, etc.

**Example:**
```http
GET /api/products?search=apple&category=fruits&sort=price
```

**Response:** Array of products

#### 🔹 Get Product by ID
```http
GET /api/products/:id
```

**Response:** Product object

#### 🔹 Create New Product (Admin only)
```http
POST /api/products
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Fresh Apples",
  "price": 120,
  "description": "Organic red apples",
  "image": "cloudinary_url",
  "category": "fruits",
  "discount": 10
}
```

**Response:** Newly created product

#### 🔹 Update Product (Admin only)
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
```

**Request Body:** Any updated product fields

#### 🔹 Delete Product (Admin only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 🛒 Cart Routes

#### 🔹 Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 2
}
```

#### 🔹 Get User Cart
```http
GET /api/cart/
Authorization: Bearer <token>
```

**Response:** Cart items with total amount

#### 🔹 Update Cart Item Quantity
```http
PUT /api/cart/update/:productId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

#### 🔹 Remove Item from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <token>
```

---

### 💳 Checkout & Payment Routes

#### 🔹 Create Stripe Checkout Session
```http
POST /api/checkout/stripe-session
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cartItems": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 120
    }
  ],
  "userId": "user_id"
}
```

**Response:**
```json
{
  "sessionUrl": "https://checkout.stripe.com/pay/..."
}
```

#### 🔹 Place Order (Cash on Delivery)
```http
POST /api/order/cod
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cartItems": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 120
    }
  ],
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "9876543210"
  },
  "userId": "user_id"
}
```

---

### 📃 Order Routes

#### 🔹 Get User Orders
```http
GET /api/orders/
Authorization: Bearer <token>
```

**Response:** Order history of the logged-in user

#### 🔹 Get All Orders (Admin)
```http
GET /api/orders/admin
Authorization: Bearer <admin_token>
```

**Response:** All orders placed on the platform

---

### 🛡️ Admin Routes

**Admin Login:** Uses the same login route but with an admin-verified account.

---

### 📝 Notes

- All routes returning data use standard JSON responses
- Error responses include `message`, `status`, and `code`
- File/image uploads (e.g., product image) use **Cloudinary**
- All timestamps are in ISO 8601 format

### 🧪 Testing Tools

Use these tools to test API endpoints:

- **[Postman](https://www.postman.com/)** - Complete API testing suite
- **[Thunder Client](https://www.thunderclient.com/)** - VS Code extension for API testing
- **[Insomnia](https://insomnia.rest/)** - Alternative API testing tool

### 🔧 Base URL

**Development:** `http://localhost:5000/api`  
**Production:** `https://your-api-domain.com/api`