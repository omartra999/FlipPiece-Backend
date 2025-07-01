# 🚀 FlipPiece Backend

Welcome to the **FlipPiece** backend! This project powers a multilingual online shop for handmade goods, fashion, recycled furniture, graphic designs, events, and workshops.

---

## 🛠️ Tech Stack
- **Node.js** (Express.js)
- **PostgreSQL** (Sequelize ORM)
- **JWT** for authentication
- **Firebase Admin** for user management
- **DHL API** for shipment creation and tracking
- **Stripe** for payments (planned)
- **Joi** for validation
- **Helmet, rate limiting, compression** for security and performance
- **Multer** for file uploads
- **Sharp** for image processing
- **Nodemailer** for email notifications

---

## ✅ Features
- User registration, login, and JWT authentication
- Email confirmation and strong password validation
- Admin and user roles with protected routes
- Product CRUD, categories, stock, options, images
- Shopping cart and order management
- Shipment creation and tracking (DHL integration, admin-only)
- Gallery management with image uploads
- Admin dashboard for managing users, products, orders
- Input validation and error handling
- Environment-based configuration
- Unit tests for core features (users, products, orders)

---

## 🚦 Project Structure
- `/models` — Sequelize models (User, Product, Order, OrderItem, Gallery)
- `/controllers` — Route logic for each resource
- `/services` — Business logic and external API integration (DHL, Stripe, etc.)
- `/routes` — Express route definitions
- `/middlewares` — Validation, authentication, admin checks, file uploads
- `/config` — Environment and third-party config
- `/tests` — Automated tests (Jest)
- `/migrations` — Database schema migrations
- `/utils` — Utility functions

---

## 🚚 Shipping & Tracking
- **Admin-only** shipment creation via DHL API
- Shipment tracking available to all users
- Configurable via environment variables

---

## 🏁 Getting Started

1. **Clone the repo and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd FlipPiece-Backend
   npm install
   ```

2. **Set up environment variables:**
   - Create `.env.development.local` with:
     ```
     PORT=5500
     URL=http://localhost
     JWT_SECRET=your_jwt_secret
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=flippiece_db
     DB_DIALECT=postgres
     DHL_API_KEY=your_dhl_api_key
     DHL_API_SECRET=your_dhl_api_secret
     DHL_API_BASE_URL=https://api-sandbox.dhl.com/parcel/de
     FRONTEND_URL=http://localhost:3000
     ```

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

## 📦 API Endpoints

### Auth (Firebase-based)
- User authentication is handled via Firebase Admin SDK

### User
- `GET /api/users/profile` — Get user profile (JWT required)

### Products
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product by ID
- `GET /api/products/category/:category` — Get products by category
- `GET /api/products/search` — Search products
- `GET /api/products/filter` — Filter products

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders/:id` — Get order by ID
- `GET /api/orders/user/:firebaseUid` — Get orders by user
- `GET /api/orders/status/:id` — Get order status

### Admin (Admin-only routes)
- `GET /api/admin/orders` — Get all orders
- `GET /api/admin/orders/:id` — Get order by ID
- `PUT /api/admin/orders/:id/status` — Update order status
- `GET /api/admin/products` — Get all products
- `GET /api/admin/products/:id` — Get product by ID
- `POST /api/admin/products` — Create product
- `PUT /api/admin/products/:id` — Update product
- `DELETE /api/admin/products/:id` — Delete product
- `GET /api/admin/users` — Get all users
- `GET /api/admin/users/:id` — Get user by ID

### Gallery
- `GET /api/gallery` — Get all gallery items
- `GET /api/gallery/:id` — Get gallery item by ID
- `POST /api/gallery` — Create gallery item (JWT required)
- `PUT /api/gallery/:id` — Update gallery item (JWT required)

### Shipping (DHL)
- `POST /api/shipments` — Create shipment (admin only)
- `GET /api/shipments/track/:trackingNumber` — Track shipment

---

## 🧪 Testing
- Run tests with:
  ```bash
  npm test
  ```
- Tests available for: users, products, orders

---

## 🔧 Development Scripts
- `npm start` — Start production server
- `npm run dev` — Start development server with nodemon
- `npm test` — Run Jest tests

---

## 📚 Further Documentation
- See [UserStories.md](./UserStories.md) for requirements and user stories.
- See [TheYannickFiles.md](./TheYannickFiles.md) for a reviewer's guide.

---
**Happy coding!**
