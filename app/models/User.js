const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    email: String,
    password: String,
    role: { type: String, default: "user" }, // Thêm trường role
  },
  { collection: "Users" }
);

module.exports = mongoose.model("Users", userSchema);
