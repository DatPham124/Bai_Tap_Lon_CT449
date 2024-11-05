const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import User model
const Staff = require("/home/datpham/CT449-Lab/BTL/app/models/Satff.js"); // Import Staff model
const {
  jwt: { secret: JWT_SECRET, expiresIn: JWT_EXPIRES_IN },
} = require("../config");

// Đăng ký người dùng (với role là "user" mặc định)
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;
    const user = new User({
      name,
      phone,
      address,
      email,
      password,
      role: "user",
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng ký nhân viên (với role là "staff")
exports.registerStaff = async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;
    const staff = new Staff({
      name,
      phone,
      address,
      email,
      password,
      role: "staff",
    });
    await staff.save();
    res.status(201).json({ message: "Staff registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập người dùng hoặc nhân viên dựa vào role
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng hoặc nhân viên với email đã cung cấp
    let user = await User.findOne({ email });
    if (!user) {
      user = await Staff.findOne({ email });
    }

    // Kiểm tra tài khoản và mật khẩu
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Tạo token với thông tin userId và role
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
