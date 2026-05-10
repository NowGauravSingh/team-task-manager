const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  dashboardStats
} = require("../controllers/taskController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

router.get("/dashboard/stats", protect, dashboardStats);

router.post("/", protect, adminOnly, createTask);

router.get("/", protect, getTasks);

router.put("/:id", protect, updateTaskStatus);

module.exports = router;