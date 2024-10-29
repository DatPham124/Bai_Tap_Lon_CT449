const { ObjectId } = require("mongodb");

class BorrowService {
  constructor(client) {
    this.borrowCollection = client.db().collection("Borrows");
  }

  async create(borrowData) {
    const result = await this.borrowCollection.insertOne(borrowData);
    return result; // Trả về bản ghi vừa thêm
  }

  async find(filter) {
    const cursor = await this.borrowCollection.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    // Nếu ID hợp lệ, tiến hành truy vấn MongoDB
    return await this.borrowCollection.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    if (!filter._id) {
      return null;
    }
    const update = payload;
    const result = await this.borrowCollection.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.borrowCollection.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = BorrowService;
