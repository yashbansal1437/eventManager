class ApiResponse {
  constructor({ statusCode = 200, message = "Success", data = null }) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
