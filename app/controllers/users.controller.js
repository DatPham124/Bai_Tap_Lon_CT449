const UsersService = require("../services/users.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const usersService = new UsersService(MongoDB.client); // Sửa 'ContactService' thành 'BooksService'
    const document = await usersService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating user") // Sửa 'contact' thành 'book'
    );
  }
};

// Hàm để lấy danh sách tất cả độc giả
exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const usersService = new UsersService(MongoDB.client);
    const { role } = req.query;

    if (role) {
      //lie ke all nhan vien hay all nguoi dung
      documents = await usersService.findByRole(role);
    } else {
      documents = await usersService.find({});
    }
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    console.error("Stack trace:", error.stack);
    return next(new ApiError(500, "An error occurred while retrieving users"));
  }

  return res.send(documents);
};

// Hàm để lấy thông tin chi tiết của một độc giả theo ID
exports.getById = async (req, res, next) => {
  try {
    const usersService = new UsersService(MongoDB.client);
    const document = await usersService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const usersService = new UsersService(MongoDB.client); // Sử dụng usersService thay vì bookService
    const document = await usersService.update(req.params.id, req.body); // Gọi hàm update trong UsersService

    if (!document) {
      return next(new ApiError(404, "User not found")); // Thông báo lỗi nếu không tìm thấy user
    }

    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    console.error(
      `Error while updating user with ID ${req.params.id}:`,
      error.message
    );
    console.error(error.stack);

    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};
// Hàm để xóa một độc giả theo ID
exports.delete = async (req, res) => {
  try {
    const userService = new UsersService(MongoDB.client);
    const document = await userService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "user not found"));
    }
    return res.send({ message: "user was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};
