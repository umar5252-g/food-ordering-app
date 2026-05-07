const express = require("express");
const router = express.Router();
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
router.get("/me", require("../middleware/authMiddleware").protect, me);

module.exports = router;
