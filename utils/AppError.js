/**
 * Extends the native Error class to carry an HTTP status code and an
 * `isOperational` flag. Operational errors are user-facing (bad input,
 * not found, etc.) and should produce clean JSON responses. Non-operational
 * errors (programmer mistakes, unexpected crashes) get a generic 500.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Preserve the original stack trace without polluting it with this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
