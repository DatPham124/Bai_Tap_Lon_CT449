const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Counter = require("/home/datpham/CT449-Lab/BTL/app/models/Counter.js"); // Đường dẫn đến Counter model

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    email: String,
    password: String,
    userId: { type: Number, unique: true },
    role: { type: String, default: "user" },
  },
  { collection: "Users" }
);

// Tự động tăng userId
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Lấy và tăng giá trị seq trong Counter
    const counter = await Counter.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.userId = counter.seq; // Gán giá trị tăng dần cho userId
  }

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
