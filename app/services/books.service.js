const { ObjectId } = require("mongodb");

class Books_Service {
  constructor(client) {
    this.Books = client.db().collection("Books");
    this.Publishers = client.db().collection("Publishers"); // Thêm tham chiếu đến collection Publishers
  }

  extractBookData(payload) {
    const book = {
      bookId: payload.bookId, // Mã sách
      bookName: payload.bookName, // Tên sách
      numberOfCopies: payload.numberOfCopies, // Số lượng quyền sách
      publicationYear: payload.publicationYear, // Năm xuất bản
      author: payload.author, // Tác giả
      coverImage: payload.coverImage, // Hình ảnh bìa sách
      publisherId: payload.publisherId
        ? new ObjectId(payload.publisherId)
        : undefined, // Mã nhà xuất bản
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);

    const result = await this.Books.findOneAndUpdate(
      { bookId: book.bookId, bookName: book.bookName },
      { $set: book },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Books.find(filter);
    const books = await cursor.toArray();

    // Lấy thông tin chi tiết của nhà xuất bản cho từng cuốn sách
    for (const book of books) {
      if (book.publisherId) {
        const publisher = await this.Publishers.findOne({
          _id: book.publisherId,
        });
        book.publisherDetails = publisher || null; // Thêm thông tin nhà xuất bản vào kết quả
      }
    }

    return books;
  }

  async findByTitle(name) {
    return await this.find({
      bookName: { $regex: new RegExp(name, "i") },
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const book = await this.Books.findOne({
      _id: new ObjectId(id),
    });

    // Lấy thông tin nhà xuất bản nếu tồn tại publisherId
    if (book && book.publisherId) {
      const publisher = await this.Publishers.findOne({
        _id: book.publisherId,
      });
      book.publisherDetails = publisher || null;
    }

    return book;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);

    const result = await this.Books.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    if (result.value && result.value.publisherId) {
      const publisher = await this.Publishers.findOne({
        _id: result.value.publisherId,
      });
      result.value.publisherDetails = publisher || null;
    }

    return result.value;
  }

  async delete(id) {
    const result = await this.Books.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}

module.exports = Books_Service;
