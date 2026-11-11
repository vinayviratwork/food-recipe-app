# 🍽️ RecipeHub — Full Stack Food Recipe App

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?style=flat&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

> **A production-style MERN stack food recipe platform** with JWT authentication, full-text search, pagination, star ratings, and save-for-later — built with security hardening throughout.

---

## 🖥️ Project Preview

| Home Page | Recipe Detail | Create Recipe |
|---|---|---|
| Hero + category grid + search | Star rating + ingredients + steps | Multi-step form with dynamic fields |

> **Demo login:** `demo@recipehub.com` / `demo1234` · 12 pre-seeded recipes

---

## ✨ Features

- **🔐 JWT Authentication** — register/login, bcrypt password hashing (12 rounds), token-based auth on every protected route
- **👨‍🍳 Recipe CRUD** — create, read, update, delete with author-only or admin access control
- **⭐ Star Ratings** — 1–5 star rating system with running average recalculation
- **🔍 Full-Text Search** — MongoDB compound text index on title and description
- **📄 Pagination & Filters** — filter by category, difficulty, tags; sort by newest, popular, cooking time
- **🔖 Save Recipes** — toggle save/unsave to personal saved list
- **🛡️ Security Hardened** — Helmet headers, CORS allowlist, rate limiting (200/15min global, 20/15min auth), 10kb body cap
- **📱 Responsive UI** — React 19 SPA with React Router v7, mobile-friendly design
- **🌱 Seed Data** — 12 real recipes + demo user ready to run

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router v7, Axios, Lucide React |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB + Mongoose 8 |
| Authentication | JWT + bcryptjs (12 rounds) |
| Security | Helmet, CORS allowlist, express-rate-limit |
| Notifications | react-hot-toast |

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

```bash
# 1. Clone
git clone https://github.com/vinayviratwork/food-recipe-app.git
cd food-recipe-app

# 2. Install backend deps
npm install

# 3. Install frontend deps
cd client && npm install && cd ..

# 4. Configure environment
cp .env.example .env
# Edit .env — set MONGO_URI, JWT_SECRET
```

```bash
# Terminal 1 — Backend (port 5000)
npm run dev

# Terminal 2 — Frontend (port 3000)
cd client && npm run dev

# (Optional) Seed sample data
npm run seed
```

Open → `http://localhost:3000`
Login → `demo@recipehub.com` / `demo1234`

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login + receive JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PATCH | `/api/auth/update-profile` | ✅ | Update username, bio, image |
| PATCH | `/api/auth/change-password` | ✅ | Change password |

### Recipes — `/api/recipes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/recipes` | ❌ | List (paginated, filterable) |
| GET | `/api/recipes/:id` | ❌ | Single recipe |
| POST | `/api/recipes` | ✅ | Create recipe |
| PATCH | `/api/recipes/:id` | ✅ | Update (author/admin only) |
| DELETE | `/api/recipes/:id` | ✅ | Delete (author/admin only) |
| POST | `/api/recipes/:id/rate` | ✅ | Rate 1–5 stars |
| GET | `/api/recipes/user/saved` | ✅ | Saved recipes list |
| POST | `/api/recipes/:id/save` | ✅ | Toggle save/unsave |

### Query Params — `GET /api/recipes`

| Param | Example | Description |
|---|---|---|
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Per page (max: 50) |
| `category` | `?category=dinner` | Filter by category |
| `difficulty` | `?difficulty=beginner` | Filter by difficulty |
| `tags` | `?tags=italian,veg` | Tags (AND logic) |
| `search` | `?search=pasta` | Full-text search |
| `sort` | `?sort=popular` | `newest` \| `popular` \| `cookingTime` |

---

## 🔒 Security Highlights

| Layer | Detail |
|---|---|
| Password hashing | bcrypt — 12 salt rounds |
| JWT | Verified + user re-fetched on every request |
| HTTP headers | Helmet (HSTS, X-Content-Type-Options, etc.) |
| CORS | Allowlist-based, env-configurable |
| Rate limiting | 200 req/15min global · 20 req/15min auth |
| Body size | 10kb cap to prevent payload attacks |
| Error responses | Dev: stack trace · Prod: clean message |

---

## 📁 Project Structure

```
food-recipe-app/
├── app.js                      # Express entry — middleware + routing
├── config/db.js                # MongoDB connection
├── controllers/
│   ├── authController.js       # Register, login, profile, password
│   └── recipeController.js     # CRUD, save, rate, pagination
├── middlewares/
│   ├── auth.js                 # JWT verification
│   └── errorHandler.js         # Global error normaliser
├── models/
│   ├── User.js                 # Schema: roles, savedRecipes, bcrypt hook
│   └── Recipe.js               # Schema: ingredients, steps, ratings, indexes
├── routes/
│   ├── authRoutes.js
│   └── recipeRoutes.js
├── utils/
│   ├── AppError.js
│   └── generateToken.js
├── seed.js                     # 12 recipes + demo user
├── .env.example
└── client/                     # React 19 + Vite 8 frontend
    └── src/
        ├── App.jsx
        ├── context/AuthContext.jsx
        ├── pages/              # Home, Login, Register, CreateRecipe, SavedRecipes
        ├── components/         # Navbar, RecipeCard, RecipeModal
        └── utils/api.js        # Axios instance + interceptors
```

---

## 📄 License

MIT © [Vinay](https://github.com/vinayviratwork)
