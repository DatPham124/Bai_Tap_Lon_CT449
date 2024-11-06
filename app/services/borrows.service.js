const Borrow = require("/home/datpham/CT449-Lab/BTL/app/models/Borrow.js");
const mongoose = require("mongoose"); // Thêm dòng này

class BorrowService {
  async create(borrowData) {
    const borrow = new Borrow(borrowData);
    return await borrow.save();
  }

  async find(filter) {
    return await Borrow.find(filter).exec();
  }

  async findById(id) {
    return await Borrow.findById(id).exec();
  }

  async update(id, payload) {
    return await Borrow.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    ).exec();
  }

  async delete(id) {
    return await Borrow.findByIdAndDelete(id).exec();
  }

  // Phương thức tìm kiếm với chi tiết sách, người dùng và nhân viên
  async findWithDetails(filter) {
    return await Borrow.aggregate([
      { $match: filter },

      // Join với collection Books
      {
        $lookup: {
          from: "Books",
          localField: "bookId",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },

      // Join với collection Users
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      // Join với collection Staffs
      {
        $lookup: {
          from: "Staffs",
          localField: "staffId",
          foreignField: "_id",
          as: "staffDetails",
        },
      },
      { $unwind: "$staffDetails" },

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
    ]);
  }
}

module.exports = BorrowService;
