const mongoose = require("mongoose");
const Book = require("/home/datpham/CT449-Lab/BTL/app/models/Book.js"); // Đường dẫn đến model Book
const Publisher = require("/home/datpham/CT449-Lab/BTL/app/models/Publisher.js"); // Đường dẫn đến model Publisher
const Author = require("/home/datpham/CT449-Lab/BTL/app/models/Author.js"); // Đường dẫn đến model Author

class Books_Service {
  constructor() {
    this.Book = Book; // Sử dụng model Book đã được định nghĩa bằng Mongoose
    this.Publisher = Publisher; // Sử dụng model Publisher
    this.Author = Author; // Sử dụng model Author
  }

  extractBookData(payload) {
    const book = {
      bookName: payload.bookName,
      numberOfCopies: payload.numberOfCopies,
      publicationYear: payload.publicationYear,
      authorId: payload.authorId
        ? new mongoose.Types.ObjectId(payload.authorId)
        : undefined,
      publisherId: payload.publisherId
        ? new mongoose.Types.ObjectId(payload.publisherId)
        : undefined,
    };

    // Xóa bỏ các trường undefined
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const bookData = this.extractBookData(payload);
    const result = await this.Book.create(bookData); // Tạo mới sách
    return result;
  }

  async find(filter) {
    // Tìm sách và tự động lấy thông tin từ `authorId` và `publisherId`
    const books = await this.Book.find(filter)
      .populate("authorId") // Lấy thông tin tác giả
      .populate("publisherId"); // Lấy thông tin nhà xuất bản
    return books;
  }

  async findByTitle(name) {
    return await this.find({
      bookName: { $regex: new RegExp(name, "i") },
    });
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    // Lấy thông tin sách theo ID và tự động lấy thông tin từ `authorId` và `publisherId`
    const book = await this.Book.findById(id)
      .populate("authorId")
      .populate("publisherId");

    return book;
  }

  async update(id, payload) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const filter = { _id: new mongoose.Types.ObjectId(id) };
    const update = this.extractBookData(payload);

    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    )
      .populate("authorId")
      .populate("publisherId");

    return result;
  }

  async delete(id) {
    const result = await this.Book.findByIdAndDelete(
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null
    );
    return result;
  }
}

module.exports = Books_Service;
