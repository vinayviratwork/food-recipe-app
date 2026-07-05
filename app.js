import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

// --- Database ---
connectDB();

// --- Security headers (sets X-Content-Type-Options, HSTS, etc.) ---
app.use(helmet());

// --- CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Allow server-to-server requests (no origin header) and whitelisted origins
      if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${incomingOrigin}' is not allowed`));
      }
    },
    credentials: true,
  })
);

// --- Rate limiting — apply globally; tighten further on auth routes ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests — please slow down." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Tighter cap to blunt brute-force attempts on login/register
  message: { status: "fail", message: "Too many auth attempts — try again in 15 minutes." },
});

app.use(globalLimiter);

// --- Request parsing ---
app.use(express.json({ limit: "10kb" })); // Reject abnormally large payloads
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// --- HTTP request logging (skipped in test environments) ---
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// --- Health-check (load balancers and uptime monitors hit this) ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: process.env.NODE_ENV });
});

// --- API routes ---
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/recipes", recipeRoutes);

// --- Catch-all for undefined routes ---
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

// --- Centralised error handling (must be last) ---
app.use(errorHandler);

// --- Server startup ---
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown on unhandled promise rejections (e.g., DB connection loss)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
