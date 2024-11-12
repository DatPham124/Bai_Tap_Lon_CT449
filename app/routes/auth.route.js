// auth.route.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();
const authController = require("../controllers/auth.controller");

// Đăng ký
router.post("/register/user", authController.registerUser);

// Đăng nhập
router.post("/login", authController.login);

// Đăng ký
router.post("/register/staff", authController.registerStaff);

module.exports = router;
