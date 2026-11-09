import AppError from "../utils/AppError.js";

const handleCastErrorDB = (err) =>
  new AppError(`Invalid value for field '${err.path}': ${err.value}`, 400);

const handleDuplicateKeyDB = (err) => {
  const [field] = Object.keys(err.keyValue);
  return new AppError(
    `An account with that ${field} already exists. Please use a different value.`,
    409
  );
};

const handleValidationErrorDB = (err) => {
  const validationMessages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${validationMessages.join(". ")}`, 422);
};

const handleJWTInvalidError = () =>
  new AppError("Invalid token — please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired — please log in again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on our end. Please try again later.",
  });
};

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
