const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const me = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

module.exports = {
  register,
  login,
  me,
};
