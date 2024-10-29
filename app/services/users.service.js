const { ObjectID, ReturnDocument, ObjectId } = require("mongodb");

class UsersService {
  constructor(client) {
    this.Users = client.db().collection("Users"); // Đảm bảo tên collection là chuỗi
  }

  extractUserData(payload) {
    const user = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
    };

    // Xóa các trường undefined
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async create(payload) {
    const user = this.extractUserData(payload);

    const result = await this.Users.findOneAndUpdate(
      { name: user.name, phone: user.phone }, // Kiểm tra trùng lặp theo tên và số điện thoại
      { $set: user },
      { returnDocument: ReturnDocument.AFTER, upsert: true } // Tạo mới nếu không tồn tại
    );
    return result.value; // Trả về document sau khi được tạo hoặc cập nhật
  }

  async find(filter) {
    const cursor = await this.Users.find(filter);
    return await cursor.toArray();
  }

  async findByRole(role) {
    return await this.find({
      role: { $regex: new RegExp(role, "i") }, // Chỉ cần một lớp regex cho role
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    // Nếu ID hợp lệ, tiến hành truy vấn MongoDB
    return await this.Users.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractUserData(payload);
    const result = await this.Users.findOneAndUpdate(
      filter,
      { $set: update },
      { returnOriginal: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Users.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = UsersService;
