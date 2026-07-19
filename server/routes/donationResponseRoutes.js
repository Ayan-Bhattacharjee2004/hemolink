const express = require("express");
const router = express.Router();

const {
  createDonationResponse,
  getMyNotifications,
} = require("../controllers/donationResponseController");
// Import auth middleware
const protect = require("../middleware/authMiddleware");

// Add protect here
router.post("/", protect, createDonationResponse);
router.get("/notifications", protect, getMyNotifications);
module.exports = router;