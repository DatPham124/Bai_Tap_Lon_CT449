const User = require("/home/datpham/CT449-Lab/BTL/app/models/User.js");
const mongoose = require("mongoose");

class UsersService {
  // Hàm xử lý dữ liệu người dùng
  extractUserData(payload) {
    const user = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      password: payload.password,
      role: payload.role,
    };

    // Xóa các trường undefined
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  // Tạo mới hoặc trả về lỗi nếu email hoặc phone đã tồn tại
  async create(payload) {
    const user = this.extractUserData(payload);

    // Kiểm tra xem số điện thoại hoặc email có bị trùng không
    const existingUser = await User.findOne({
      $or: [{ phone: user.phone }, { email: user.email }],
    });

    if (existingUser) {
      throw new Error("Số điện thoại hoặc email đã được đăng ký");
    } else {
      // Mật khẩu sẽ tự động băm trong model User (middleware `pre("save")`)
      const newUser = new User(user);
      return await newUser.save();
    }
  }

  // Tìm tất cả người dùng theo điều kiện
  async find(filter) {
    return await User.find(filter);
  }

  // Tìm người dùng theo vai trò
  async findByRole(role) {
    return await User.find({
      role: { $regex: new RegExp(role, "i") }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    });
  }

  // Tìm người dùng theo ID
  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await User.findById(id);
  }

  // Xác thực mật khẩu cũ
  async verifyOldPassword(id, oldPassword) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Sử dụng phương thức comparePassword có sẵn của model User
    return await user.comparePassword(oldPassword);
  }

  // Cập nhật người dùng theo ID
  async update(id, payload) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findById(id);
    if (!user) {
      return null;
    }

    const updatedData = this.extractUserData(payload);

    // Kiểm tra nếu yêu cầu đổi mật khẩu
    if (updatedData.password) {
      if (!payload.oldPassword) {
        throw new Error("Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới");
      }

      // Sử dụng phương thức comparePassword để xác thực mật khẩu cũ
      const isOldPasswordValid = await user.comparePassword(
        payload.oldPassword
      );
      if (!isOldPasswordValid) {
        throw new Error("Mật khẩu cũ không đúng");
      }

      // Mật khẩu mới sẽ tự động băm trong `pre("save")` của User model
    }

    // Kiểm tra xem email hoặc phone đã được sử dụng bởi người dùng khác chưa
    const existingUser = await User.findOne({
      $or: [{ phone: updatedData.phone }, { email: updatedData.email }],
      _id: { $ne: id }, // Loại bỏ chính người dùng hiện tại khỏi kết quả tìm kiếm
    });

    if (existingUser) {
      throw new Error(
        "Số điện thoại hoặc email đã được đăng ký bởi người dùng khác"
      );
    }

    // Cập nhật các thuộc tính của user
    Object.assign(user, updatedData);

    return await user.save();
  }

  // Xóa người dùng theo ID
  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return await User.findByIdAndDelete(id);
  }
}

module.exports = UsersService;
