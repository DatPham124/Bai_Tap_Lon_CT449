const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
  },
  { collection: "Users" }
);

// Tự động tăng userId
userSchema.pre("save", async function (next) {
  // Băm mật khẩu nếu có thay đổi
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// So sánh mật khẩu đã mã hóa với mật khẩu nhập vào
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Users", userSchema);
