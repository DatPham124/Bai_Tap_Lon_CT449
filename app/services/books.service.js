const { ObjectID, ReturnDocument, ObjectId } = require("mongodb");

class BooksService {
  constructor(client) {
    this.Books = client.db().collection("Books");
  }
  extractBookData(payload) {
    const book = {
      title: payload.title,
      author: payload.author,
      category: payload.category,
      quantity: payload.quantity,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);

    const result = await this.Books.findOneAndUpdate(
      { title: book.title, author: book.author },
      { $set: book },
      { returnDocument: ReturnDocument.AFTER, upsert: true } // Neu khong tim thay thi se tao moi
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Books.find(filter);
    return await cursor.toArray();
  }

  async findByTitle(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" },
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }

    // Nếu ID hợp lệ, tiến hành truy vấn MongoDB
    return await this.Books.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    const result = await this.Books.findOneAndUpdate(
      filter,
      { $set: update },
      { returnOriginal: "after" } // Use this for MongoDB versions < v4.2
    );
    return result;
  }

  async delete(id) {
    const result = await this.Books.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = BooksService;
