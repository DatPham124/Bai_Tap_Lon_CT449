const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const staffSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    email: String,
    password: String,
    staffId: { type: Number, unique: true },
    role: { type: String, default: "staff" },
  },
  { collection: "Staffs" }
);

// Hash mật khẩu trước khi lưu
staffSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// So sánh mật khẩu đã mã hóa với mật khẩu nhập vào
staffSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

// Tự động tăng giá trị cho staffId
staffSchema.plugin(AutoIncrement, { inc_field: "staffId" });

module.exports = mongoose.model("Staff", staffSchema);
