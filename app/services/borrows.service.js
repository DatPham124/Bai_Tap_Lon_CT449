const { ObjectId } = require("mongodb");

class BorrowService {
  constructor(client) {
    this.borrowCollection = client.db().collection("Borrows");
  }

  async create(borrowData) {
    const result = await this.borrowCollection.insertOne(borrowData);
    return result;
  }

  async find(filter) {
    const cursor = await this.borrowCollection.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return await this.borrowCollection.findOne({ _id: new ObjectId(id) });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
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

  // Phương thức sử dụng $lookup để lấy thông tin chi tiết về sách, người dùng và nhân viên
  async findWithDetails(filter) {
    return await this.borrowCollection
      .aggregate([
        { $match: filter }, // Áp dụng bộ lọc nếu có

        // Join với collection Books
        {
          $lookup: {
            from: "Books",
            localField: "bookId",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" }, // Giải nén kết quả từ bookDetails nếu cần

        // Join với collection Users
        {
          $lookup: {
            from: "Users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" }, // Giải nén kết quả từ userDetails nếu cần

        // Join với collection Staffs
        {
          $lookup: {
            from: "Staffs",
            localField: "staffId",
            foreignField: "_id",
            as: "staffDetails",
          },
        },
        { $unwind: "$staffDetails" }, // Giải nén kết quả từ staffDetails nếu cần

        // Chỉ chọn các trường cần thiết
        {
          $project: {
            _id: 1,
            borrowDate: 1,
            returnDate: 1,
            "bookDetails.bookName": 1,
            "userDetails.name": 1,
            "staffDetails.name": 1,
          },
        },
      ])
      .toArray();
  }
}

module.exports = BorrowService;
