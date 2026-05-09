const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getMyOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.route("/")
  .get(getOrders)
  .post(createOrder);

router.get("/myorders", getMyOrders);

router.route("/:id")
  .get(getOrderById);

// Admin only: update status
router.put("/:id/status", authorize("admin"), updateOrderStatus);

module.exports = router;
