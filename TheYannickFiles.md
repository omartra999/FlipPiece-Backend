# 👀 Flip-Piece Backend Reviewer Guide

Welcome, Yannick! Here’s everything you need to know to review the progress and code quality of the Flip-Piece backend.

---

## 📂 Project Structure

- **/models** — Sequelize models (User, Product, Cart, etc.)
- **/controllers** — Route logic for auth, products, cart, etc.
- **/routes** — Express route definitions
- **/middlewares** — Auth and admin middleware
- **/seeders** — Test data for users and products
- **/migrations** — Database schema migrations
- **/utils** — Utility functions (e.g., email sending)
- **/config** — Environment and DB config
- **/tests** — (If present) Automated tests

---

## ✅ Features to Review

- User registration, login, and email confirmation
- JWT authentication and admin protection
- Product CRUD (admin-only for create/update/delete)
- Product search, filter, and category endpoints
- Shopping cart (add, update, remove, view)
- Database seeding for users and products
- Error handling and validation

---

## 🧪 How to Test

1. **Clone the repo and install dependencies**
   ```bash
   git clone <repo-url>
   cd flip-piece-backend
   npm install
   ```

2. **Set up environment variables**  
   (see `.env.example` or ask the author)

3. **Run migrations and seeders**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Test endpoints with Postman or curl**  
   See the [README.md](./Readme.md) for endpoint details and sample requests.

---

## 📝 Review Checklist

- [ ] Code is organized and follows project structure
- [ ] Models match the migrations and seeders
- [ ] Controllers handle validation and errors
- [ ] Auth and admin middleware work as expected
- [ ] Only admins can create/update/delete products
- [ ] Cart logic checks stock and handles options
- [ ] All endpoints return appropriate status codes and messages
- [ ] README is up to date and clear
- [ ] (Optional) Tests are present and passing

---

## 🗣️ Feedback

- Leave comments directly in the code (pull request or code review tool)
- Or, summarize your feedback in a document or email

---

Thank you for reviewing!  
If you have questions, reach out to the author.