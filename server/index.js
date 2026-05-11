const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// const helmet = require("helmet");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// app.use(helmet()); // Set security HTTP headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow only frontend URL
    credentials: true,
  })
);

app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Flavor Point server is running..." });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(PORT, () => {
      console.log(`Flavor Point server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    // Start server anyway so we can still develop without DB
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (without DB)`);
    });
  });
