const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authHandler");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", authMiddleware, getMe);

module.exports = router;
