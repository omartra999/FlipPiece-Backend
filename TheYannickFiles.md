# 👀 FlipPiece Backend — Reviewer Guide for Yannick

Hey Yannick! 👋

Thanks for helping review the FlipPiece backend. Here’s a quick guide to make your review smooth and effective.

---

## 🗂️ Project Structure
- **/models** — Sequelize models (User, Product, Order, etc.)
- **/controllers** — Route logic for each resource
- **/services** — Business logic and external API calls (DHL, Stripe)
- **/routes** — Express route definitions
- **/middlewares** — Validation, authentication, admin checks
- **/config** — Environment and third-party config
- **/tests** — Automated tests

---

## ✅ What to Review

- Admin/user role separation and protected routes
- Product CRUD and validation
- Cart and order logic
- DHL shipment creation (admin only) and tracking
- Input validation (Joi) and error handling
- Security middleware (helmet, rate limiting, etc.)
- Unit tests for core features

---

## 🧪 How to Test
1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd FlipPiece-Backend
   npm install
   ```
2. **Set up environment variables:**  
   Ask for `.env.development.local` or see the example.
3. **Run migrations and seeders:**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
4. **Start the server:**
   ```bash
   npm run dev
   ```


---

## 📝 Review Checklist
- [ ] Code is organized and follows the structure above
- [ ] Models match migrations and are normalized
- [ ] Controllers handle validation and errors
- [ ] Auth and admin middleware work as expected
- [ ] Only admins can create shipments/products
- [ ] Cart/order logic is robust
- [ ] All endpoints return appropriate status codes/messages
- [ ] README and docs are up to date
- [ ] Tests are present and passing

---

## 💬 Feedback
- Leave comments in the code (pull request or code review tool)
- Or summarize your feedback in a doc/email

---
Thanks again, Yannick!  
If you have questions, ping me anytime.