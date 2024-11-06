const User = require("/home/datpham/CT449-Lab/BTL/app/models/User.js");
const mongoose = require("mongoose"); // Thêm dòng này

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

  // Tạo mới hoặc cập nhật người dùng
  async create(payload) {
    const user = this.extractUserData(payload);

    // Tìm và cập nhật hoặc tạo mới nếu không tồn tại (theo tên và số điện thoại)
    let existingUser = await User.findOne({
      name: user.name,
      phone: user.phone,
    });

    if (existingUser) {
      // Cập nhật người dùng nếu đã tồn tại
      Object.assign(existingUser, user);
      return await existingUser.save();
    } else {
      // Tạo người dùng mới
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
      return null; // Trả về null nếu ID không hợp lệ
    }
    return await User.findById(id);
  }

  // Cập nhật người dùng theo ID
  async update(id, payload) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findById(id);
    if (!user) {
      return null; // Trả về null nếu không tìm thấy user
    }

    // Cập nhật các thuộc tính của user
    Object.assign(user, this.extractUserData(payload));

    // Lưu người dùng sau khi cập nhật
    return await user.save(); // .save() sẽ kích hoạt pre-save hook để mã hóa mật khẩu nếu có thay đổi
  }

  // Xóa người dùng theo ID
  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const result = await User.findByIdAndDelete(id);
    return result;
  }
}

module.exports = UsersService;
