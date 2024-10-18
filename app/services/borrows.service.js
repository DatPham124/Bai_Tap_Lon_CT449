const { ObjectID, ReturnDocument, ObjectId } = require("mongodb");

class Borrow_Service {
  constructor(client) {
    this.Borrow = client.db().collection("Borrows");
  }

  extractBorrowData(payload) {
    const borrow = {
      borrowerId: payload.borrowerId, // ID người mượn
      bookId: 
      userId: 
      borrowDate: payload.borrowDate || new Date(), // Ngày mượn
      returnDate: payload.returnDate, // Ngày trả dự kiến
      staffId: 
    };

    // Loại bỏ các trường undefined
    Object.keys(borrow).forEach(
      (key) => borrow[key] === undefined && delete borrow[key]
    );
    return borrow;
  }

  async create(payload) {
    const borrow = this.extractBorrowData(payload);

    const result = await this.Borrow.findOneAndUpdate(
      { borrowerId: borrow.borrowerId, bookId: borrow.bookId },
      { $set: borrow },
      { returnDocument: ReturnDocument.AFTER, upsert: true } // Nếu không tìm thấy, sẽ tạo mới
    );
    return result.value;
  }
}

module.exports = Borrow_Service;
