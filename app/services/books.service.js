const mongoose = require("mongoose");
const Book = require("/home/datpham/CT449-Lab/BTL/app/models/Book.js"); // Đường dẫn đến model Book
const Publisher = require("/home/datpham/CT449-Lab/BTL/app/models/Publisher.js"); // Đường dẫn đến model Publisher

class Books_Service {
  constructor() {
    this.Book = Book; // Sử dụng model Book đã được định nghĩa bằng Mongoose
    this.Publisher = Publisher; // Sử dụng model Publisher
  }

  extractBookData(payload) {
    const book = {
      bookId: payload.bookId,
      bookName: payload.bookName,
      numberOfCopies: payload.numberOfCopies,
      publicationYear: payload.publicationYear,
      author: payload.author,
      coverImage: payload.coverImage,
      publisherId: payload.publisherId
        ? new mongoose.Types.ObjectId(payload.publisherId)
        : undefined,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      { bookId: book.bookId },
      { $set: book },
      { new: true, upsert: true }
    );
    return result;
  }

  async find(filter) {
    const books = await this.Book.find(filter).populate("publisherId"); // Tự động lấy thông tin publisher

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

    const book = await this.Book.findById(id).populate("publisherId"); // Lấy thông tin publisher

    return book;
  }

  async update(id, payload) {
    const filter = {
      _id: mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null,
    };
    const update = this.extractBookData(payload);

    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

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
