const ApiResponse = require("../utils/response");

const responseHandler = (req, res, next) => {
  res.ok = (payload = {}) => {
    if (typeof payload !== "object" || payload === null) {
      return next(new TypeError("res.ok expects an object"));
    }

    const { message = "Success", data = null } = payload;

    return res.status(200).json(
      new ApiResponse({ statusCode: 200, message, data })
    );
  };

  res.created = (payload = {}) => {
    if (typeof payload !== "object" || payload === null) {
      return next(new TypeError("res.created expects an object"));
    }

    const { message = "Created", data = null } = payload;

    return res.status(201).json(
      new ApiResponse({ message, data })
    );
  };

  res.noContent = () => {
    return res.status(204).send();
  };

  next();
};

module.exports = responseHandler;
