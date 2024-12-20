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
      {
        $unwind: {
          path: "$staffDetails",
          preserveNullAndEmptyArrays: true, // Đặt staffDetails là null nếu không có staffId
        },
      },

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

  async findBorrowHistoryByUserId(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID người dùng không hợp lệ");
    }

    return await Borrow.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      // Join với collection Books để lấy thông tin sách
      {
        $lookup: {
          from: "Books",
          localField: "bookId",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },

      // Join với collection Staffs để lấy thông tin nhân viên xử lý, nếu không có sẽ trả về null
      {
        $lookup: {
          from: "Staffs",
          let: { staffId: "$staffId" }, // Khai báo biến staffId từ document
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$staffId"] }, // So sánh với staffId
              },
            },
          ],
          as: "staffDetails",
        },
      },
      // Nếu không có nhân viên thì staffDetails sẽ là mảng rỗng, cần gán null nếu không có dữ liệu
      {
        $addFields: {
          staffDetails: {
            $ifNull: [{ $arrayElemAt: ["$staffDetails", 0] }, null],
          },
        },
      },

      // Chỉ chọn các trường cần thiết
      {
        $project: {
          _id: 1,
          borrowDate: 1,
          returnDate: 1,
          returned: 1,
          "bookDetails.bookName": 1,
          "staffDetails.name": 1,
        },
      },
    ]);
  }
}

module.exports = BorrowService;
