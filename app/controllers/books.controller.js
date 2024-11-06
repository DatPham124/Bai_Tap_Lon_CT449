const BooksService = require("../services/books.service");
const ApiError = require("../api-error");

const booksService = new BooksService(); // Khởi tạo một lần

// Hàm để xử lý khi tạo sách mới
exports.create = async (req, res, next) => {
  if (!req.body?.bookName) {
    return next(new ApiError(400, "Book title cannot be empty"));
  }

  try {
    const document = await booksService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("Error creating book:", error);
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

// Hàm để lấy danh sách tất cả sách
exports.getAll = async (req, res, next) => {
  let documents = [];
  const { bookName } = req.query;

  try {
    documents = bookName
      ? await booksService.findByTitle(bookName)
      : await booksService.find({});
    return res.send(documents);
  } catch (error) {
    console.error("Error retrieving books:", error.message);
    return next(new ApiError(500, "An error occurred while retrieving books"));
  }
};

// Hàm để lấy thông tin chi tiết của một cuốn sách theo ID
exports.getById = async (req, res, next) => {
  try {
    const document = await booksService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    console.error(`Error retrieving book with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

// Hàm để cập nhật thông tin một cuốn sách
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const document = await booksService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
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
    const document = await booksService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    console.error(`Could not delete book with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};
