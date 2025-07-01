# 📖 FlipPiece Backend — API Documentation

## Overview

FlipPiece is a backend for a multilingual e-commerce platform for handmade goods, fashion, and more.  
It supports user management, product catalog, cart, orders, admin dashboard, and shipping/tracking via DHL.

---

## 🔐 Authentication

### Firebase Authentication
- User authentication is handled via Firebase (frontend)
- Backend expects Firebase ID tokens in Authorization header
- Format: `Authorization: Bearer <firebase_id_token>`

### Authentication Flow
1. Frontend authenticates users via Firebase Auth
2. Frontend sends Firebase ID token in Authorization header
3. Backend middleware verifies the token using Firebase Admin
4. User data is attached to `req.user` for use in controllers

---

## 📦 API Endpoints

### User Management

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "id": 1,
  "firebaseUid": "user_firebase_uid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "address": {
    "street": "123 Main St",
    "city": "Berlin",
    "postalCode": "10115",
    "country": "Germany"
  }
}
```

---

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "title": "Handmade Necklace",
      "description": "Beautiful handmade necklace",
      "price": 29.99,
      "category": "fashion",
      "stock": 5,
      "isShippable": true,
      "isPickupOnly": false,
      "images": ["image1.jpg", "image2.jpg"],
      "thumbnail": "thumb.jpg",
      "options": {
        "colors": ["red", "blue"],
        "sizes": ["S", "M", "L"]
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalItems": 50
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Get Products by Category
```http
GET /api/products/category/:category
```

**Categories:** `fashion`, `möbel`, `design`

#### Search Products
```http
GET /api/products/search?query=necklace
```

#### Filter Products
```http
GET /api/products/filter?category=fashion&minPrice=10&maxPrice=50&isShippable=true
```

---

### Orders

#### Create Order
```http
POST /api/orders
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firebaseUid": "user_firebase_uid",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Berlin",
    "postalCode": "10115",
    "country": "Germany"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "Berlin",
    "postalCode": "10115",
    "country": "Germany"
  },
  "total": 89.97,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 29.99
    },
    {
      "productId": 3,
      "quantity": 1,
      "price": 29.99
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "FP-2024-001",
  "firebaseUid": "user_firebase_uid",
  "status": "pending",
  "total": 89.97,
  "subtotal": 89.97,
  "shippingCost": 0,
  "tax": 0,
  "paymentStatus": "pending",
  "createdAt": "2024-01-15T10:30:00Z",
  "items": [...]
}
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <firebase_id_token>
```

#### Get Orders by User
```http
GET /api/orders/user/:firebaseUid
Authorization: Bearer <firebase_id_token>
```

#### Get Order Status
```http
GET /api/orders/status/:id
Authorization: Bearer <firebase_id_token>
```

---

### Admin Routes

#### Get All Orders (Admin)
```http
GET /api/admin/orders
Authorization: Bearer <firebase_id_token>
```

#### Update Order Status (Admin)
```http
PUT /api/admin/orders/:id/status
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

#### Product Management (Admin)

**Create Product:**
```http
POST /api/admin/products
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 29.99,
  "category": "fashion",
  "stock": 10,
  "isShippable": true,
  "isPickupOnly": false,
  "options": {
    "colors": ["red", "blue"],
    "sizes": ["S", "M", "L"]
  }
}
```

**Update Product:**
```http
PUT /api/admin/products/:id
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Delete Product:**
```http
DELETE /api/admin/products/:id
Authorization: Bearer <firebase_id_token>
```

#### User Management (Admin)

**Get All Users:**
```http
GET /api/admin/users
Authorization: Bearer <firebase_id_token>
```

**Get User by ID:**
```http
GET /api/admin/users/:id
Authorization: Bearer <firebase_id_token>
```

---

### Gallery

#### Get All Gallery Items
```http
GET /api/gallery
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Workshop Photos",
      "description": "Photos from our latest workshop",
      "mediaUrl": "workshop1.jpg",
      "mediaType": "image",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Gallery Item by ID
```http
GET /api/gallery/:id
```

#### Create Gallery Item
```http
POST /api/gallery
Authorization: Bearer <firebase_id_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title`: Gallery item title
- `description`: Gallery item description
- `mediaType`: "image" or "video"
- `media`: File upload

#### Update Gallery Item
```http
PUT /api/gallery/:id
Authorization: Bearer <firebase_id_token>
Content-Type: multipart/form-data
```

---

### Shipping (DHL)

#### Create Shipment (Admin Only)
```http
POST /api/shipments
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "plannedShippingDateAndTime": "2024-01-16T10:00:00Z",
  "productCode": "V01PAK",
  "customerDetails": {
    "shipperDetails": {
      "name": "FlipPiece Store",
      "postalAddress": {
        "postalCode": "10115",
        "cityName": "Berlin",
        "countryCode": "DE",
        "addressLine1": "Store Address"
      }
    },
    "receiverDetails": {
      "name": "John Doe",
      "postalAddress": {
        "postalCode": "10115",
        "cityName": "Berlin",
        "countryCode": "DE",
        "addressLine1": "Customer Address"
      }
    }
  }
}
```

#### Track Shipment
```http
GET /api/shipments/track/:trackingNumber
```

**Response:**
```json
{
  "trackingNumber": "1234567890",
  "status": "in_transit",
  "events": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "location": "Berlin",
      "description": "Package picked up"
    }
  ]
}
```

---

## 🔧 Environment Variables

```env
PORT=5500
URL=http://localhost
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=FlipPieceDB
DB_DIALECT=postgres
DHL_API_KEY=your_dhl_api_key
DHL_API_SECRET=your_dhl_api_secret
DHL_API_BASE_URL=https://api-sandbox.dhl.com/parcel/de
FRONTEND_URL=http://localhost:3000
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {...}
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Field 'title' is required",
    "Field 'price' must be a positive number"
  ]
}
```

---

## 🔒 Security

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **Compression**: Request/response compression
- **Input Validation**: Joi schema validation
- **Admin Protection**: Admin-only routes require admin privileges

---

## 🧪 Testing

Run tests with:
```bash
npm test
```

Tests available for:
- User operations
- Product operations  
- Order operations

---

## 📚 Further Reading

- [README.md](./README.md) — Project overview and setup
- [UserStories.md](./UserStories.md) — Requirements and user stories
- [TheYannickFiles.md](./TheYannickFiles.md) — Code review guide

---

**For questions or contributions, open an issue or contact the maintainer.** 