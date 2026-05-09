const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  refreshToken,
  logout,
  me,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, me);

module.exports = router;
