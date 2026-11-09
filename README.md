# 🍽️ Food Recipe App — REST API

A production-ready **RESTful backend API** for a food recipe platform, built with the MERN stack (Node.js + Express + MongoDB). Features JWT authentication, role-based access control, full-text search, pagination, and multiple security layers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Security | Helmet, CORS allowlist, express-rate-limit |
| Logging | Morgan |

---

## Features

- **JWT Authentication** — secure register/login with bcrypt password hashing (12 salt rounds)
- **Role-Based Access Control** — users vs admins; only authors/admins can edit or delete their recipes
- **Full-Text Search** — MongoDB compound text index on recipe title and description
- **Pagination & Filtering** — filter by category, difficulty, tags; sort by newest, popularity, or cooking time
- **Save Recipes** — users can save/unsave any recipe to a personal list
- **Security Hardened** — Helmet headers, CORS allowlist, body size limits (10kb), global + auth-specific rate limiting
- **Centralised Error Handling** — differentiates dev vs prod error responses; handles Mongoose and JWT errors gracefully
- **Graceful Shutdown** — catches unhandled promise rejections and closes the server cleanly

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd food-recipe-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in your MongoDB URI, JWT secret, etc.

# 4. Start the development server
npm run dev
```

The API will be running at `http://localhost:5000`

---

## Environment Variables

Copy `.env.example` to `.env` and set the following:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and receive JWT | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |
| PATCH | `/api/auth/me` | Update profile (username, bio, profileImage) | ✅ |
| PATCH | `/api/auth/change-password` | Change password (requires currentPassword) | ✅ |

### Recipes — `/api/recipes`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api/recipes` | List recipes (paginated, filterable) | ❌ |
| GET | `/api/recipes/:id` | Get single recipe | ❌ |
| POST | `/api/recipes` | Create a recipe | ✅ |
| PATCH | `/api/recipes/:id` | Update a recipe (author/admin only) | ✅ |
| DELETE | `/api/recipes/:id` | Delete a recipe (author/admin only) | ✅ |
| GET | `/api/recipes/user/saved` | Get current user's saved recipes | ✅ |
| POST | `/api/recipes/:id/save` | Toggle save/unsave a recipe | ✅ |
| POST | `/api/recipes/:id/rate` | Rate a recipe (1–5 stars) | ✅ |

### Query Parameters for `GET /api/recipes`

| Param | Example | Description |
|---|---|---|
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Results per page (max: 50) |
| `category` | `?category=dinner` | Filter by category |
| `difficulty` | `?difficulty=beginner` | Filter by difficulty |
| `tags` | `?tags=italian,vegetarian` | Filter by tags (comma-separated, AND logic) |
| `search` | `?search=pasta` | Full-text search on title + description |
| `sort` | `?sort=popular` | Sort: `newest`, `popular`, `cookingTime` |

### Health Check

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server + environment status |

---

## Project Structure

```
food-recipe-app/
├── app.js                  # Express app entry point
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Register, login, profile management
│   └── recipeController.js # CRUD, save/unsave, search
├── middlewares/
│   ├── auth.js             # JWT verification (protectRoute)
│   └── errorHandler.js     # Centralised error handler
├── models/
│   ├── User.js             # User schema (roles, saved recipes)
│   └── Recipe.js           # Recipe schema (ingredients, instructions, ratings)
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   └── recipeRoutes.js     # Recipe endpoints
└── utils/
    ├── AppError.js         # Custom operational error class
    └── generateToken.js    # JWT sign helper
```

---

## Security Highlights

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT tokens** signed with a long secret, verified on every protected request
- User re-fetched from DB on each request (prevents stale token exploitation)
- **Helmet** sets secure HTTP headers (HSTS, X-Content-Type-Options, etc.)
- **CORS allowlist** — only whitelisted origins accepted (configurable via env)
- **Rate limiting** — 200 req/15min globally, 20 req/15min on auth routes
- **Body size limit** — 10kb max to prevent payload attacks
- Author ID is stripped from PATCH body to prevent authorship reassignment

---

## License

MIT
