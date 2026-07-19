const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  completeProfile,
  getProfile,
  updateProfile,
  updateAvailability,
  updateNotificationPreferences,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/complete-profile", protect, completeProfile);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.patch("/availability", protect, updateAvailability);

router.put(
  "/notification-preferences",
  protect,
  updateNotificationPreferences
);

router.put(
  "/change-password",
  protect,
  changePassword
);

router.delete(
  "/account",
  protect,
  deleteAccount
);

module.exports = router;