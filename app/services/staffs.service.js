const { ReturnDocument, ObjectId } = require("mongodb");

class Staffs_Service {
  constructor(client) {
    this.Staff = client.db().collection("Staffs");
  }

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
    const staff = this.extractStaffData(payload);

    const result = await this.Staff.findOneAndUpdate(
      {
        name: staff.name,
        phone_number: staff.phone_number,
      }, // Sửa để phù hợp với trường 'staff'
      { $set: staff },
      { returnDocument: ReturnDocument.AFTER, upsert: true } // Nếu không tìm thấy thì sẽ tạo mới
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Staff.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    // Nếu ID hợp lệ, tiến hành truy vấn MongoDB
    return await this.Staff.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractStaffData(payload);
    const result = await this.Staff.findOneAndUpdate(
      filter,
      { $set: update },
      { returnOriginal: "after" } // Use this for MongoDB versions < v4.2
    );
    return result;
  }

  async delete(id) {
    const result = await this.Staff.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = Staffs_Service;
