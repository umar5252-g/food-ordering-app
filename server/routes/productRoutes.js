const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// GET /api/products         — Get all products (supports ?category=burgers&available=true)
// POST /api/products        — Create a new product (protected)
router.route("/").get(getProducts).post(protect, createProduct);

// GET /api/products/:id     — Get single product
// PUT /api/products/:id     — Update a product (protected)
// DELETE /api/products/:id  — Delete a product (protected)
router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
