
---

### 📄 `server/README.md`
```markdown
# HomiFi - Backend

The **backend** of HomiFi powers the entire blogging platform by handling data, authentication, and API endpoints.  
It’s built with **Node.js + Express + MongoDB** and integrates **Google OAuth 2.0** for secure login.

This service is the **engine** behind the platform: it stores user data, manages blogs, and enables community interactions through comments.

---

## 🌟 What This Backend Does
- **Secure Authentication** – Users log in with Google (OAuth 2.0) instead of managing new accounts.  
- **Blog Management** – Create, edit, delete, and fetch blogs via REST APIs.  
- **Comment System** – Add and fetch comments tied to specific blogs.  
- **MongoDB Integration** – Data persistence using Mongoose models.  
- **Session Management** – Ensures users stay logged in across their session securely.  
- **Scalable API Design** – Clean REST architecture, ready for scaling.  

---
## Demo-video
https://drive.google.com/drive/folders/14IBuUbnINqiBrYk3FFAm7wlgXlkgT14v?usp=drive_link

## 📂 Project Structure
server/
│── init/ # Database connection setup
│── models/ # Mongoose schemas (User, Blog, Comment)
│── middleware.js # Custom middleware for authentication
│── index.js # Entry point (Express app)
│── package.json
│── .env # Environment variables

---

## ⚙️ Getting Started

### 1️⃣ Install Dependencies
```bash
cd server
npm install

## 2️⃣ Configure Environment

Create a .env file in server/:

PORT=5000
MONGO_URI=mongodb://localhost:27017/homifi
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

## 3️⃣ Run the Server
npm run dev   # if nodemon is installed
# OR
node index.js


API will be served at http://localhost:5000
.

## 📡 Example API Endpoints

GET /api/blogs → Fetch all blogs

POST /api/blogs → Create a new blog (requires login)

GET /api/blogs/:id → Fetch blog by ID

POST /api/blogs/:id/comments → Add comment to blog

GET /auth/google → Start Google login

GET /auth/google/callback → Google OAuth callback

## 🛠️ Tech Stack

Node.js + Express – Web server and routing.

MongoDB + Mongoose – Database and ORM.

Passport.js (Google OAuth 2.0) – Authentication.

Express-session – Session management.
