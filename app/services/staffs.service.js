const Staff = require("/home/datpham/CT449-Lab/BTL/app/models/Satff.js");
const mongoose = require("mongoose"); // Thêm dòng này

class StaffsService {
  // Hàm xử lý dữ liệu nhân viên
  extractStaffData(payload) {
    const staff = {
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    };

    // Xóa các trường undefined
    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );
    return staff;
  }

  // Tạo mới hoặc cập nhật nhân viên
  async create(payload) {
    const staffData = this.extractStaffData(payload);

    // Tìm và cập nhật hoặc tạo mới nếu không tồn tại (theo tên và số điện thoại)
    let existingStaff = await Staff.findOne({
      name: staffData.name,
      phone: staffData.phone,
    });

    if (existingStaff) {
      // Cập nhật nhân viên nếu đã tồn tại
      Object.assign(existingStaff, staffData);
      return await existingStaff.save();
    } else {
      // Tạo nhân viên mới
      const newStaff = new Staff(staffData);
      return await newStaff.save();
    }
  }

  // Tìm tất cả nhân viên theo điều kiện
  async find(filter) {
    return await Staff.find(filter);
  }

  // Tìm nhân viên theo ID
  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }
    return await Staff.findById(id);
  }

  // Cập nhật nhân viên theo ID
  async update(id, payload) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateData = this.extractStaffData(payload);
    return await Staff.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Xóa nhân viên theo ID
  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return await Staff.findByIdAndDelete(id);
  }

  // Tìm nhân viên theo vai trò (nếu cần)
  async findByRole(role) {
    return await Staff.find({
      role: { $regex: new RegExp(role, "i") }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    });
  }
}

module.exports = StaffsService;
