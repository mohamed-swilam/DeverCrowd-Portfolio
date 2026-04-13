class AppError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || null;
    // Capture stack trace (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Factory — returns a NEW Error instance every call.
 * Never mutates a shared singleton (avoids race conditions under concurrent requests).
 */
const errorHandler = {
  create(message, statusCode, errors) {
    return new AppError(message, statusCode, errors);
  },
};

module.exports = errorHandler;