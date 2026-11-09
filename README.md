# 🍽️ Food Recipe App — REST API

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

A production-ready **RESTful backend API** for a food recipe platform built with Node.js, Express, and MongoDB. Includes JWT authentication, role-based access control, full-text search, pagination, star ratings, and multiple security hardening layers.

---

## ✨ Features

- **JWT Authentication** — secure register/login with bcrypt password hashing (12 salt rounds)
- **Role-Based Access Control** — users vs admins; only authors/admins can edit or delete recipes
- **Recipe Ratings** — users can rate recipes 1–5 stars with running average calculation
- **Full-Text Search** — MongoDB compound text index on title and description
- **Pagination & Filtering** — filter by category, difficulty, tags; sort by newest, popularity, or cooking time
- **Save Recipes** — toggle save/unsave recipes to a personal list
- **Change Password** — secure endpoint requiring current password verification
- **Security Hardened** — Helmet headers, CORS allowlist, 10kb body limit, global + auth rate limiting
- **Centralised Error Handling** — differentiates dev vs prod; handles Mongoose CastError, duplicate keys, JWT errors
- **Graceful Shutdown** — catches unhandled rejections and closes server cleanly

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Authentication | JWT + bcryptjs (12 rounds) |
| Security | Helmet, CORS allowlist, express-rate-limit |
| Logging | Morgan |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/vinayviratwork/food-recipe-app.git
cd food-recipe-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in your values

# 4. Start the development server
npm run dev
```

API runs at → `http://localhost:5000`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and receive JWT | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |
| PATCH | `/api/auth/update-profile` | Update username, bio, profileImage | ✅ |
| PATCH | `/api/auth/change-password` | Change password (requires currentPassword) | ✅ |

### Recipes — `/api/recipes`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/recipes` | List recipes (paginated, filterable) | ❌ |
| GET | `/api/recipes/:id` | Get a single recipe | ❌ |
| POST | `/api/recipes` | Create a recipe | ✅ |
| PATCH | `/api/recipes/:id` | Update a recipe (author/admin only) | ✅ |
| DELETE | `/api/recipes/:id` | Delete a recipe (author/admin only) | ✅ |
| POST | `/api/recipes/:id/rate` | Rate a recipe (1–5 stars) | ✅ |
| GET | `/api/recipes/user/saved` | Get current user's saved recipes | ✅ |
| POST | `/api/recipes/:id/save` | Toggle save/unsave a recipe | ✅ |

### Query Parameters — `GET /api/recipes`

| Param | Example | Description |
|---|---|---|
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Results per page (max: 50) |
| `category` | `?category=dinner` | Filter by category |
| `difficulty` | `?difficulty=beginner` | Filter by difficulty |
| `tags` | `?tags=italian,vegetarian` | Comma-separated tags (AND logic) |
| `search` | `?search=pasta` | Full-text search on title + description |
| `sort` | `?sort=popular` | `newest` \| `popular` \| `cookingTime` |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server status + environment |

---

## 📁 Project Structure

```
food-recipe-app/
├── app.js                      # Express app + middleware setup
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js       # Register, login, profile, password
│   └── recipeController.js     # CRUD, save, rate, search
├── middlewares/
│   ├── auth.js                 # JWT verification middleware
│   └── errorHandler.js         # Global error handler
├── models/
│   ├── User.js                 # User schema (roles, savedRecipes)
│   └── Recipe.js               # Recipe schema (ingredients, ratings)
├── routes/
│   ├── authRoutes.js
│   └── recipeRoutes.js
├── utils/
│   ├── AppError.js             # Custom error class
│   └── generateToken.js        # JWT helper
├── .env.example
└── package.json
```

---

## 🔒 Security Highlights

| Layer | Detail |
|---|---|
| Password hashing | bcrypt with 12 salt rounds |
| JWT verification | Token verified + user re-fetched on every request |
| HTTP headers | Helmet (HSTS, X-Content-Type-Options, etc.) |
| CORS | Allowlist-based, configurable via env |
| Rate limiting | 200 req/15min global · 20 req/15min on auth routes |
| Body size | 10kb limit to prevent payload attacks |
| Error responses | Dev shows stack trace · Prod shows clean message only |

---

## 📄 License

MIT © [Vinay](https://github.com/vinayviratwork)
