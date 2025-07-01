# 👀 FlipPiece Backend — Reviewer Guide for Yannick

Hey Yannick! 👋

Thanks for helping review the FlipPiece backend. Here's a quick guide to make your review smooth and effective.

---

## 🗂️ Project Structure
- **/models** — Sequelize models (User, Product, Order, OrderItem, Gallery)
- **/controllers** — Route logic for each resource
- **/services** — Business logic and external API calls (DHL, Stripe)
- **/routes** — Express route definitions
- **/middlewares** — Validation, authentication, admin checks, file uploads
- **/config** — Environment and third-party config (Firebase, DHL)
- **/tests** — Automated tests (Jest)
- **/migrations** — Database schema migrations
- **/utils** — Utility functions

---

## ✅ What to Review
- **Firebase authentication** (ID token verification, user data attachment)
- Admin/user role separation and protected routes
- Product CRUD and validation (read-only in main routes, admin CRUD in admin routes)
- Cart and order logic
- DHL shipment creation (admin only) and tracking
- Gallery management with file uploads
- Input validation (Joi) and error handling
- Security middleware (helmet, rate limiting, compression)
- Environment variable usage and config
- Unit tests for core features (users, products, orders)

---

## 🔐 Authentication Flow
- Frontend handles login/registration via Firebase Auth
- Backend expects Firebase ID tokens in `Authorization: Bearer <token>` header
- Auth middleware verifies tokens using Firebase Admin
- User data attached to `req.user` for use in controllers

---

## 🧪 How to Test
1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd FlipPiece-Backend
   npm install
   ```

2. **Set up environment variables:**  
   Ask for `.env.development.local` or see the README for the exact variables needed.

3. **Set up Firebase:**
   - Need Firebase service account key in `config/firebaseServiceAccount.json`
   - Ask for the service account file if not included

4. **Run migrations and seeders:**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

6. **Test endpoints:**  
   - Use Postman or curl
   - For protected routes, you'll need a valid Firebase ID token
   - See the README for endpoint details

---

## 📝 Review Checklist
- [ ] Code is organized and follows the structure above
- [ ] Models match migrations and are normalized
- [ ] Controllers handle validation and errors
- [ ] Firebase authentication works correctly
- [ ] Auth and admin middleware work as expected
- [ ] Only admins can create shipments/products (via admin routes)
- [ ] Cart/order logic is robust
- [ ] Gallery file uploads work properly
- [ ] All endpoints return appropriate status codes/messages
- [ ] README and docs are up to date
- [ ] Tests are present and passing
- [ ] Security middleware is in place

---

## 🔍 Key Areas to Focus On
- **Authentication**: Check that Firebase ID tokens are properly verified
- **Authorization**: Ensure admin routes are properly protected
- **File Uploads**: Verify gallery image uploads work correctly
- **External APIs**: Check DHL integration for shipments
- **Error Handling**: Look for proper error responses and logging
- **Security**: Verify rate limiting, helmet, and input validation

---

## 💬 Feedback
- Leave comments in the code (pull request or code review tool)
- Or summarize your feedback in a doc/email
- Focus on security, performance, and maintainability

---
Thanks again, Yannick!  
If you have questions, ping me anytime.