// controllers/author.controller.js
const AuthorService = require("../services/authors.service");
const ApiError = require("../api-error");

// Hàm để tạo mới một tác giả
exports.create = async (req, res, next) => {
  if (!req.body?.AuthorName) {
    return next(new ApiError(400, "Author name cannot be empty"));
  }

  try {
    const authorService = new AuthorService();
    const author = await authorService.create(req.body);
    return res.send(author);
  } catch (error) {
    console.error("Error creating author:", error);
    return next(
      new ApiError(500, "An error occurred while creating the author")
    );
  }
};

// Hàm để lấy danh sách tất cả các tác giả
exports.getAll = async (req, res, next) => {
  try {
    const authorService = new AuthorService();
    const authors = await authorService.find();
    return res.send(authors);
  } catch (error) {
    console.error("Error retrieving authors:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving authors")
    );
  }
};

// Hàm để tìm tác giả theo tên
exports.findByName = async (req, res, next) => {
  try {
    const authorService = new AuthorService();
    const authors = await authorService.findByName(req.query.name || "");
    return res.send(authors);
  } catch (error) {
    console.error("Error retrieving author by name:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving author by name")
    );
  }
};

// Hàm để lấy thông tin chi tiết của một tác giả theo ID
exports.getById = async (req, res, next) => {
  try {
    const authorService = new AuthorService();
    const author = await authorService.findById(req.params.id);
    if (!author) {
      return next(new ApiError(404, "Author not found"));
    }
    return res.send(author);
  } catch (error) {
    console.error(`Error retrieving author with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Error retrieving author with id=${req.params.id}`)
    );
  }
};

// Hàm để cập nhật thông tin một tác giả
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const authorService = new AuthorService();
    const author = await authorService.update(req.params.id, req.body);

    if (!author) {
      return next(new ApiError(404, "Author not found"));
    }

    return res.send({ message: "Author was updated successfully" });
  } catch (error) {
    console.error(`Error updating author with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Error updating author with id=${req.params.id}`)
    );
  }
};

// Hàm để xóa một tác giả
exports.delete = async (req, res, next) => {
  try {
    const authorService = new AuthorService();
    const author = await authorService.delete(req.params.id);

    if (!author) {
      return next(new ApiError(404, "Author not found"));
    }

    return res.send({ message: "Author was deleted successfully" });
  } catch (error) {
    console.error(`Could not delete author with id=${req.params.id}:`, error);
    return next(
      new ApiError(500, `Could not delete author with id=${req.params.id}`)
    );
  }
};
