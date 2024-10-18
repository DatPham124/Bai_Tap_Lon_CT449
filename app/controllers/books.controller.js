const BooksService = require("../services/books.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Hàm để xử lý khi tạo sách mới
exports.create = async (req, res, next) => {
  if (!req.body?.title) {
    return next(new ApiError(400, "Title can not be empty"));
  }

  try {
    const booksService = new BooksService(MongoDB.client); // Sửa 'ContactService' thành 'BooksService'
    const document = await booksService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the book") // Sửa 'contact' thành 'book'
    );
  }
};

// Hàm để lấy danh sách tất cả sách
exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const booksService = new BooksService(MongoDB.client);
    const { title } = req.query;

    if (title) {
      documents = await booksService.findByTitle(title);
    } else {
      documents = await booksService.find({});
    }
  } catch (error) {
    console.error("Error retrieving books:", error.message);
    console.error("Stack trace:", error.stack);
    return next(new ApiError(500, "An error occurred while retrieving books"));
  }

  return res.send(documents);
};

// Hàm để lấy thông tin chi tiết của một cuốn sách theo ID
exports.getById = async (req, res, next) => {
  try {
    const booksService = new BooksService(MongoDB.client);
    const document = await booksService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

// Hàm để cập nhật thông tin một cuốn sách
exports.update = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const bookService = new BooksService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);

    if (!document) {
      console.error(`Book with ID ${req.params.id} not found`);
      return next(new ApiError(404, "Book not found"));
    }

    return res.send({ message: "Book was updated successfully" });
  } catch (error) {
    console.error(
      `Error while updating book with ID ${req.params.id}:`,
      error.message
    );
    console.error(error.stack);

    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    );
  }
};

// Hàm để xóa một cuốn sách
exports.delete = async (req, res) => {
  try {
    const bookService = new BooksService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};
