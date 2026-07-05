import AppError from "../utils/AppError.js";

// --- Mongoose / JWT error normalizers ---

/**
 * Mongoose CastError: e.g., an invalid ObjectId string in a route param.
 * Converts it into a clean 400 instead of leaking internal paths.
 */
const handleCastErrorDB = (err) =>
  new AppError(`Invalid value for field '${err.path}': ${err.value}`, 400);

/**
 * Mongoose duplicate key error (code 11000).
 * Extracts the offending field name from the keyValue map.
 */
const handleDuplicateKeyDB = (err) => {
  const [field] = Object.keys(err.keyValue);
  return new AppError(
    `An account with that ${field} already exists. Please use a different value.`,
    409
  );
};

/**
 * Mongoose ValidationError: fires when schema validators fail on save/update.
 * Collects all failing field messages into a single readable string.
 */
const handleValidationErrorDB = (err) => {
  const validationMessages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${validationMessages.join(". ")}`, 422);
};

const handleJWTInvalidError = () =>
  new AppError("Invalid token — please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired — please log in again", 401);

// --- Response formatters ---

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Operational = expected, user-facing errors → safe to expose the message
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown errors → never leak internals to the client
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on our end. Please try again later.",
  });
};

// --- Global error-handling middleware (must have 4 params for Express to recognise it) ---

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let normalizedError = { ...err, message: err.message };

    if (err.name === "CastError") normalizedError = handleCastErrorDB(err);
    if (err.code === 11000) normalizedError = handleDuplicateKeyDB(err);
    if (err.name === "ValidationError") normalizedError = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") normalizedError = handleJWTInvalidError();
    if (err.name === "TokenExpiredError") normalizedError = handleJWTExpiredError();

    sendErrorProd(normalizedError, res);
  }
};

export default errorHandler;
