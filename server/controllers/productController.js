const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.isAvailable = available === "true";

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (will be Admin later)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (will be Admin later)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (will be Admin later)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted", data: product });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
