// auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  jwt: { secret: JWT_SECRET, expiresIn: JWT_EXPIRES_IN },
} = require("../config");

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;
    const user = new User({ name, phone, address, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
