const BooksService = require("../services/users.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res) => {
  if (!req.body?.title) {
    return next(new ApiError(400, "Title can not be empty")); // Sửa 'name' thành 'title'
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
exports.getAll = (req, res) => {
  res.send({ message: "List of all staff" });
};

exports.getById = (req, res) => {
  const staffId = req.params.id;
  res.send({ message: `Details of staff with ID: ${staffId}` });
};

exports.update = (req, res) => {
  const staffId = req.params.id;
  res.send({ message: `Staff with ID: ${staffId} updated successfully` });
};

exports.delete = (req, res) => {
  const staffId = req.params.id;
  res.send({ message: `Staff with ID: ${staffId} deleted successfully` });
};
