// services/author.service.js
const mongoose = require("mongoose");
const Author = require("../models/Author");

class AuthorService {
  constructor() {
    this.Author = Author;
  }

  // Phương thức để tạo mới một tác giả
  async create(authorData) {
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

  // Phương thức để xóa tác giả theo ID
  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid author ID");
    }
    return await this.Author.findByIdAndDelete(id);
  }
}

module.exports = AuthorService;
