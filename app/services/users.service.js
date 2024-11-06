const User = require("/home/datpham/CT449-Lab/BTL/app/models/User.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      // Băm mật khẩu trước khi
      console.log("Mật khẩu trước khi băm:", user.password);
      user.password = await this.hashPassword(user.password);
      console.log("Mật khẩu sau khi băm:", user.password);
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

    // In ra mật khẩu cũ và mật khẩu được mã hóa để kiểm tra
    console.log("Old Password Provided:", oldPassword);
    console.log("Hashed Password in Database:", user.password);

    return await this.verifyPassword(oldPassword, user.password);
  }

  // Băm mật khẩu
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Xác thực mật khẩu
  async verifyPassword(inputPassword, userPasswordHash) {
    const isMatch = await bcrypt.compare(inputPassword, userPasswordHash);
    console.log("Password Match Result:", isMatch);
    return isMatch;
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
      // Kiểm tra nếu `oldPassword` được cung cấp trong payload
      if (!payload.oldPassword) {
        throw new Error("Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới");
      }

      // Xác thực mật khẩu cũ
      const isOldPasswordValid = await this.verifyPassword(
        payload.oldPassword,
        user.password
      );

      if (!isOldPasswordValid) {
        throw new Error("Mật khẩu cũ không đúng");
      }

      // Băm mật khẩu mới trước khi cập nhật
      updatedData.password = await this.hashPassword(updatedData.password);
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

    const result = await User.findByIdAndDelete(id);
    return result;
  }
}

module.exports = UsersService;
