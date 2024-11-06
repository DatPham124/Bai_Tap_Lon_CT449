const UsersService = require("../services/users.service");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name cannot be empty"));
  }

  if (!req.body?.password) {
    return next(new ApiError(400, "Password cannot be empty"));
  }

  try {
    const usersService = new UsersService();
    const document = await usersService.create(req.body);
    return res.status(201).send(document);
  } catch (error) {
    if (error.message === "Số điện thoại hoặc email đã được đăng ký") {
      return next(new ApiError(400, error.message));
    }
    console.error("Error creating user:", error.message);
    return next(new ApiError(500, "An error occurred while creating user"));
  }
};

// Hàm để lấy danh sách tất cả người dùng
exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const usersService = new UsersService();
    const { role } = req.query;

    // Lọc người dùng theo vai trò nếu có
    if (role) {
      documents = await usersService.findByRole(role);
    } else {
      documents = await usersService.find({});
    }
    return res.send(documents);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    return next(new ApiError(500, "An error occurred while retrieving users"));
  }
};

// Hàm để lấy thông tin chi tiết của một người dùng theo ID
exports.getById = async (req, res, next) => {
  try {
    const usersService = new UsersService();
    const document = await usersService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const usersService = new UsersService();

    // Kiểm tra nếu người dùng đang cập nhật mật khẩu và cần xác thực mật khẩu cũ
    if (req.body.password && req.body.oldPassword) {
      const isOldPasswordValid = await usersService.verifyOldPassword(
        req.params.id,
        req.body.oldPassword
      );

      if (!isOldPasswordValid) {
        return next(new ApiError(400, "Old password is incorrect"));
      }
    }

    const document = await usersService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "User not found"));
    }

    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    if (
      error.message ===
      "Số điện thoại hoặc email đã được đăng ký bởi người dùng khác"
    ) {
      return next(new ApiError(400, error.message));
    }
    console.error(
      `Error while updating user with ID ${req.params.id}:`,
      error.message
    );
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

// Hàm để xóa một người dùng theo ID
exports.delete = async (req, res, next) => {
  try {
    const usersService = new UsersService();
    const document = await usersService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "User not found"));
    }

    return res.send({ message: "User was deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};
