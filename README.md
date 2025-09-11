# HomiFi Backend – APIs and Authentication

The **backend** of HomiFi handles all server-side operations, including **API endpoints, database operations, authentication**, and integration with the frontend.  

It is built with **Node.js + Express + MongoDB** and supports **Google OAuth 2.0** for secure login.

---

## 🌟 What This Backend Does
- **Blog Management** – Create, read, update, and delete blogs  
- **Commenting System** – Users can post comments on any blog  
- **Authentication** – Google OAuth 2.0 login  
- **REST API** – Provides endpoints for the frontend to interact with  

---
🔗 **Frontend Repository**  
The Frontend for HomiFi is located here:  
👉 [HomiFi Frontend Repository](https://github.com/Harmandeeep2312/HomiFi-Frontend.git)

## 🔗 How Frontend & Backend Work Together

HomiFi is split into two repositories that should be placed together in a **single parent folder**:

```
HomiFi/
│
├── frontend/       # React + Vite app
└── backend/        # Node.js + Express + MongoDB API
```

The **frontend communicates with the backend** via **HTTP requests (Axios)**:

* `GET /api/blogs` → Fetch all blogs  
* `POST /api/blogs` → Create a blog  
* `POST /api/blogs/:id/comments` → Add a comment  

This setup allows the frontend and backend to remain separate but work seamlessly together.

---

## ⚙️ Installation (Frontend + Backend)

### 1️⃣ Organize Repos in One Folder

```bash
mkdir HomiFi
cd HomiFi

# Clone frontend and backend
git clone https://github.com/Harmandeeep2312/HomiFi-Frontend.git frontend
git clone https://github.com/Harmandeeep2312/HomiFi-Backend.git backend
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/homifi
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
```

Run backend:

```bash
npm run dev
```

Backend runs at **[http://localhost:8080](http://localhost:8080)**

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:

```bash
npm run dev
```

Frontend runs at **[http://localhost:5173](http://localhost:5173)**

---

### 4️⃣ Open in Browser

* Visit [http://localhost:5173](http://localhost:5173) → React frontend  
* It connects to backend APIs at [http://localhost:8080](http://localhost:8080)  

✅ Anyone can run **both frontend and backend together** from a single parent folder.

---

## 📂 Project Structure
```
backend/
│── models/       # MongoDB schemas
│── routes/       # Express route files
│── controllers/  # Logic for each route
│── init/         # Database connection & app setup
│── index.js      # Entry point
│── package.json
│── .env          # Environment variables
```

---

## 🛠 Tech Stack
- **Node.js + Express** – Backend server and API routing  
- **MongoDB + Mongoose** – Database and object modeling  
- **Google OAuth 2.0** – Authentication  
- **Axios** – Used by frontend for API requests  

---

## 📜 License
This project is licensed under the MIT License.

