const express = require("express");
const {
  registerUser,
  registerAdmin,
  loginUser,
  getMe,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authHandler");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authMiddleware, getMe);
router.get("/events", authMiddleware, getMe);

module.exports = router;
