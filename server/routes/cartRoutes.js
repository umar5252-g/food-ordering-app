const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

// All routes protected with auth middleware
router.use(protect);

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route("/:productId")
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
