class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError"; 
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
