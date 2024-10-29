const { ObjectId, ReturnDocument } = require("mongodb");

class Books_Service {
  constructor(client) {
    this.Books = client.db().collection("Books");
    this.Publishers = client.db().collection("Publishers"); // Thêm tham chiếu đến collection Publishers
  }

  extractBookData(payload) {
    const book = {
      SACH_Ma: payload.SACH_Ma,
      SACH_Ten: payload.SACH_Ten,
      SACH_SoQuyen: payload.SACH_SoQuyen,
      SACH_NamXuatBan: payload.SACH_NamXuatBan,
      SACH_TacGia: payload.SACH_TacGia,
      SACH_HinhAnh: payload.SACH_HinhAnh,
      NXB_Ma: payload.NXB_Ma ? new ObjectId(payload.NXB_Ma) : undefined, // Thêm tham chiếu đến nhà xuất bản
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);

    const result = await this.Books.findOneAndUpdate(
      { SACH_Ma: book.SACH_Ma, SACH_Ten: book.SACH_Ten },
      { $set: book },
      { returnDocument: ReturnDocument.AFTER, upsert: true }
    );
    return result;
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
      SACH_Ten: { $regex: new RegExp(name, "i") },
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
      { returnDocument: ReturnDocument.AFTER }
    );

    // Lấy thông tin nhà xuất bản nếu tồn tại publisherId
    if (result && result.publisherId) {
      const publisher = await this.Publishers.findOne({
        _id: result.publisherId,
      });
      result.publisherDetails = publisher || null;
    }

    return result;
  }

  async delete(id) {
    const result = await this.Books.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = Books_Service;
