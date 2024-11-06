// services/author.service.js
const mongoose = require("mongoose");
const Author = require("../models/Author");
const Book = require("../models/Book"); // Import model Book

class AuthorService {
  constructor() {
    this.Author = Author;
  }

  // Phương thức để tạo mới một tác giả
  async create(authorData) {
    const { AuthorName } = authorData; // Lấy tên tác giả từ dữ liệu

    // Kiểm tra xem đã có tác giả nào với tên giống hoặc trùng không
    const existingAuthor = await this.Author.findOne({
      AuthorName: AuthorName,
    });

    if (existingAuthor) {
      throw new Error("Tác giả này đã tồn tại");
    }

    // Nếu chưa có, tạo mới tác giả
    const author = new this.Author(authorData);
    return await author.save();
  }

  // Phương thức để tìm tất cả các tác giả hoặc tìm theo bộ lọc
  async find(filter = {}) {
    return await this.Author.find(filter);
  }

  // Phương thức tìm tác giả theo tên
  async findByName(authorName) {
    return await this.Author.find({
      AuthorName: { $regex: new RegExp(authorName, "i") },
    });
  }

  // Phương thức tìm tác giả theo ID
  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await this.Author.findById(id);
  }

  // Phương thức để cập nhật thông tin tác giả
  async update(id, authorData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid author ID");
    }
    return await this.Author.findByIdAndUpdate(
      id,
      { $set: authorData },
      { new: true }
    );
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid author ID");
    }

    try {
      // Xóa tất cả các sách có authorId là ID của tác giả
      await Book.deleteMany({ authorId: id });

      // Xóa tác giả
      const authorDeletionResult = await this.Author.findByIdAndDelete(id);

      if (!authorDeletionResult) {
        throw new Error("Không tìm thấy tác giả để xóa");
      }

      return authorDeletionResult;
    } catch (error) {
      throw new Error(
        "Lỗi khi xóa tác giả và sách liên quan: " + error.message
      );
    }
  }
}

module.exports = AuthorService;
