const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, changePassword } = require("../controllers/userController");

// All routes are protected
router.use(protect);

router.route("/profile")
  .get(getProfile)
  .put(updateProfile);

router.put("/change-password", changePassword);

module.exports = router;
