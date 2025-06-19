# 🚀 Flip-Piece Backend

Welcome to the **Flip-Piece** backend!  
This project powers a multilingual online shop for handmade goods, fashion, recycled furniture, graphic designs, events, and workshops.

---

## 📦 Tech Stack

- **Node.js** (Express.js)
- **PostgreSQL** (via Sequelize ORM)
- **JWT** for authentication
- **Nodemailer** for email confirmation
- **bcrypt** for password hashing

---

## ✅ Features Implemented

- **Project setup** with Express, Sequelize, and PostgreSQL
- **Environment configuration** for development and production
- **User model** with:
  - `username`, `email`, `password`, `firstName`, `lastName`
  - `isActive` (email confirmation)
  - `confirmationCode` (6-digit code)
  - `isAdmin` (admin/owner flag)
- **Strong password validation** (min 8 chars, upper/lower/number/special)
- **User registration** endpoint (`/api/auth/register`)
- **Email confirmation** endpoint (`/api/auth/confirm`) with test email via Nodemailer/Ethereal
- **Login** endpoint (`/api/auth/login`) with JWT issuance
- **Protected user profile** endpoint (`/api/users/profile`)
- **JWT authentication middleware**
- **Product model** with categories, stock, options, shippable/pick-up flags, images, and thumbnail
- **Product CRUD endpoints** (admin-only for create/update/delete)
- **Product search, filter, and category endpoints**
- **Shopping cart model** with cart items and options
- **Cart endpoints**: add, update, remove, and view cart items (with stock checks)
- **Admin middleware** for protected routes
- **Database seeding for users and products**
- **.gitignore** and Git initialized

---

## 📝 To-Do Next

- **Order & checkout endpoints**: create order from cart, reduce stock, clear cart
- **Order history endpoints**: view user orders and order details
- **Wishlist and ratings** (optional for MVP)
- **User profile update, address, and payment info endpoints**
- **Gallery, blog/events, contact form, messaging**
- **Shipping cost calculation and tracking**
- **Admin dashboard endpoints**
- **API documentation and polish**

---

## 🗓️ MVP Backend Timeline (1 Week)

| Day         | Features/Tasks                                                                 |
|-------------|-------------------------------------------------------------------------------|
| **Day 1**   | ✅ Auth, registration, email confirmation, JWT, user profile                  |
| **Day 2**   | ✅ Product model, CRUD, categories, options, shippable/pick-up flag           |
| **Day 3**   | ✅ Cart model, add/remove/update items, cart endpoints                        |
| **Day 4**   | Order model, checkout flow, order management                                 |
| **Day 5**   | Admin endpoints: manage users/products/orders/posts                          |
| **Day 6**   | Gallery, blog/events, contact form, messaging                                |
| **Day 7**   | Polish, error handling, testing, docs, deployment prep                       |

---

## 🏆 Full Backend Completion Plan

| Phase                | Features                                                                                       | Est. Days |
|----------------------|------------------------------------------------------------------------------------------------|-----------|
| **MVP (see above)**  | Core user/product/cart/order/admin/blog/gallery/auth/payment                                   | 7         |
| **Shipping**         | Address management, shipping cost calculation, shipment tracking                               | 2         |
| **Notifications**    | Email notifications for orders, shipping, password reset, etc.                                 | 1         |
| **Analytics**        | Earnings/sales analytics endpoints for admin dashboard                                         | 1         |
| **Enhancements**     | Wishlists, reviews, discount codes, multilingual support, accessibility, advanced search/filter | 2         |
| **Testing & Polish** | Unit/integration tests, security review, performance, docs, deployment                         | 2         |
| **Total**            |                                                                                                | **15**    |

---

## 🚧 How to Run Locally

1. **Clone the repo and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd flip-piece-backend
   npm install
   ```

2. **Set up your environment variables:**
   - Copy `.env.development.local` and `.env.production.local` and fill in your secrets.

3. **Run migrations and seeders:**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5500/`.

---

## 🧪 API Endpoints (So Far)

- `POST /api/auth/register` — Register new user (sends confirmation email)
- `POST /api/auth/confirm` — Confirm email with code
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/users/profile` — Get user profile (JWT required)
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product details
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)
- `GET /api/products/category/:category` — Get products by category
- `GET /api/products/search?query=...` — Search products
- `GET /api/products/filter?...` — Filter products
- `GET /api/cart` — Get current user's cart (JWT required)
- `POST /api/cart/items` — Add item to cart (JWT required)
- `PUT /api/cart/items/:itemId` — Update cart item (JWT required)
- `DELETE /api/cart/items/:itemId` — Remove cart item (JWT required)

---

## 🗂️ Next Steps

- See [UserStories.md](../UserStories.md) for full requirements and user stories.
- Continue with order/checkout, wishlist, and advanced features!

---

**Happy coding!**  