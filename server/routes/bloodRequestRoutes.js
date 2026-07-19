const express = require("express");

const {
  createRequest,
  getRequests,
  getMyRequests,
  deleteRequest,
  getBloodDemand,
} = require("../controllers/bloodRequestController");


const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/my", authMiddleware, getMyRequests);
router.delete("/:id", authMiddleware, deleteRequest);
router.get("/demand", getBloodDemand);
router.get("/", getRequests);

module.exports = router;