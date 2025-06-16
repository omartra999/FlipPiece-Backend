# 🚀 Flip-Piece Backend

Welcome to the **Flip-Piece** backend!  
This project powers a multilingual marketplace for handmade goods, fashion, recycled furniture, graphic designs, events, and workshops.

---

## 📦 Tech Stack

- **Node.js** (Express.js)
- **PostgreSQL** (via Sequelize ORM)
- **JWT** for authentication
- **Nodemailer** for email confirmation
- **bcrypt** for password hashing

---

## ✅ Features Implemented Today

- **Project setup** with Express, Sequelize, and PostgreSQL
- **Environment configuration** for development and production
- **User model** with:
  - `username`, `email`, `password`, `firstName`, `lastName`
  - `isActive` (email confirmation)
  - `confirmationCode` (6-digit code)
- **Strong password validation** (min 8 chars, upper/lower/number/special)
- **User registration** endpoint (`/api/auth/register`)
- **Email confirmation** endpoint (`/api/auth/confirm`) with test email via Nodemailer/Ethereal
- **Login** endpoint (`/api/auth/login`) with JWT issuance
- **Protected user profile** endpoint (`/api/users/profile`)
- **JWT authentication middleware**
- **Database auto-reset** on server start for easy testing (`sync({ force: true })`)
- **.gitignore** and Git initialized

---

## 📝 To-Do for Tomorrow

- Product model & CRUD endpoints
- Product categories, stock, options (color, size)
- Mark products as shippable or pick-up only
- Basic product listing and detail endpoints
- Start shopping cart logic

---

## 🗓️ MVP Backend Timeline (1 Week)

| Day         | Features/Tasks                                                                 |
|-------------|-------------------------------------------------------------------------------|
| **Day 1**   | ✅ Auth, registration, email confirmation, JWT, user profile                  |
| **Day 2**   | Product model, CRUD, categories, options, shippable/pick-up flag              |
| **Day 3**   | Cart model, add/remove items, checkout flow                                   |
| **Day 4**   | Order model, payment integration (Stripe test), order management              |
| **Day 5**   | Admin endpoints: manage users/products/orders/posts                           |
| **Day 6**   | Gallery, blog/events, contact form, messaging                                 |
| **Day 7**   | Polish, error handling, testing, docs, deployment prep                        |

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

3. **Start the server:**
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

---

## 🗂️ Next Steps

- See [UserStories.md](../UserStories.md) for full requirements and user stories.
- Continue with product and cart features tomorrow!

---

**Happy coding!**  
*Flip-Piece Backend Team*