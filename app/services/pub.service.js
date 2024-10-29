const { ObjectID, ReturnDocument, ObjectId } = require("mongodb");

class Publisher_Service {
  constructor(client) {
    this.Publishers = client.db().collection("Publishers");
  }

  extractPublisherData(payload) {
    const publisher = {
      NXB_Ma: payload.NXB_Ma,
      NXB_Ten: payload.NXB_Ten,
      NXB_DiaChi: payload.NXB_DiaChi,
    };

    // Loại bỏ các trường không có giá trị
    Object.keys(publisher).forEach(
      (key) => publisher[key] === undefined && delete publisher[key]
    );
    return publisher;
  }

  async create(payload) {
    const publisher = this.extractPublisherData(payload);

    const result = await this.Publishers.findOneAndUpdate(
      { NXB_Ma: publisher.NXB_Ma },
      { $set: publisher },
      { returnDocument: ReturnDocument.AFTER, upsert: true } // Sử dụng upsert để tạo mới nếu không tìm thấy
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Publishers.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      NXB_Ten: { $regex: new RegExp(name, "i") }, // Sử dụng regex để tìm tên
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    return await this.Publishers.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractPublisherData(payload);
    const result = await this.Publishers.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: ReturnDocument.AFTER } // Sử dụng returnDocument cho MongoDB v4.2+
    );
    return result;
  }

  async delete(id) {
    const result = await this.Publishers.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = Publisher_Service;
