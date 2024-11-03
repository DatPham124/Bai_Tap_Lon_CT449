// auth.route.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();
const authController = require("../controllers/auth.controller");

// Đăng ký
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

router.get("/testFindUser", async (req, res) => {
  try {
    // Email test (thay thế bằng email mà bạn muốn kiểm tra trong cơ sở dữ liệu)
    const testEmail = "ppap1242003@gmail.com";

    // Tìm người dùng với email cụ thể
    const user = await User.findOne({ email: testEmail });

    if (user) {
      console.log("User found:", user); // Log kết quả để kiểm tra
      res.status(200).json({ message: "User found", user });
    } else {
      console.log("User not found"); // Log nếu không tìm thấy người dùng
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error finding user:", error); // Log lỗi nếu có
    res.status(500).json({ error: "Error finding user" });
  }
});

module.exports = router;
