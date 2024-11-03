const Staff = require("/home/datpham/CT449-Lab/BTL/app/models/Satff.js");

class StaffsService {
  extractStaffData(payload) {
    const staff = {
      name: payload.name,
      address: payload.address,
      phone_number: payload.phone_number,
    };

    // Xóa các trường undefined
    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );
    return staff;
  }

  async create(payload) {
    const staffData = this.extractStaffData(payload);
    const staff = new Staff(staffData);
    return await staff.save();
  }

  async find(filter) {
    return await Staff.find(filter).exec();
  }

  async findById(id) {
    return await Staff.findById(id).exec();
  }

  async update(id, payload) {
    const updateData = this.extractStaffData(payload);
    return await Staff.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();
  }

  async delete(id) {
    return await Staff.findByIdAndDelete(id).exec();
  }
}

module.exports = StaffsService;
