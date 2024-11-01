const BooksService = require("../services/books.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Hàm để xử lý khi tạo sách mới
exports.create = async (req, res, next) => {
  // Kiểm tra xem tên sách có được cung cấp không
  if (!req.body?.bookName) {
    return next(new ApiError(400, "Book title cannot be empty"));
  }

  try {
    const booksService = new BooksService(MongoDB.client);
    // Gọi phương thức create từ BooksService
    const document = await booksService.create(req.body);
    return res.send(document); // Gửi lại tài liệu sách đã tạo
  } catch (error) {
    console.error("Error creating book:", error); // Ghi lại lỗi
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

// Hàm để lấy danh sách tất cả sách
exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const booksService = new BooksService(MongoDB.client);
    const { bookName } = req.query;

    // Kiểm tra xem có query để tìm theo tiêu đề sách không
    if (bookName) {
      documents = await booksService.findByTitle(bookName);
    } else {
      documents = await booksService.find({});
    }
    return res.send(documents); // Gửi lại danh sách sách
  } catch (error) {
    console.error("Error retrieving books:", error.message);
    console.error("Stack trace:", error.stack);
    return next(new ApiError(500, "An error occurred while retrieving books"));
  }
};

// Hàm để lấy thông tin chi tiết của một cuốn sách theo ID
exports.getById = async (req, res, next) => {
  try {
    const booksService = new BooksService(MongoDB.client);
    const document = await booksService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found")); // Nếu không tìm thấy sách
    }
    return res.send(document); // Gửi lại thông tin sách
  } catch (error) {
    console.error(`Error retrieving book with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

// Hàm để cập nhật thông tin một cuốn sách
exports.update = async (req, res, next) => {
  // Kiểm tra xem có dữ liệu nào để cập nhật không
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const booksService = new BooksService(MongoDB.client);
    // Gọi phương thức update từ BooksService
    const document = await booksService.update(req.params.id, req.body);

    if (!document) {
      console.error(`Book with ID ${req.params.id} not found`);
      return next(new ApiError(404, "Book not found"));
    }

    return res.send({ message: "Book was updated successfully" }); // Gửi thông báo thành công
  } catch (error) {
    console.error(
      `Error while updating book with ID ${req.params.id}:`,
      error.message
    );
    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    );
  }
};

// Hàm để xóa một cuốn sách
exports.delete = async (req, res, next) => {
  try {
    const booksService = new BooksService(MongoDB.client);
    const document = await booksService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found")); // Nếu không tìm thấy sách để xóa
    }
    return res.send({ message: "Book was deleted successfully" }); // Gửi thông báo thành công
  } catch (error) {
    console.error(`Could not delete book with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};
