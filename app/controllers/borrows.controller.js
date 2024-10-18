const BorrowService = require("../services/borrows.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.title) {
    return next(new ApiError(400, "Title can not be empty")); // Sửa 'name' thành 'title'
  }

  try {
    const borrow_Service = new BorrowService(MongoDB.client); // Sửa 'ContactService' thành 'BooksService'
    const document = await borrow_Service.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the borrow") // Sửa 'contact' thành 'book'
    );
  }
};
exports.getAll = (req, res) => {
  res.send({ message: "List of all borrow transactions" });
};

exports.getById = (req, res) => {
  const borrowId = req.params.id;
  res.send({ message: `Details of borrow transaction with ID: ${borrowId}` });
};

exports.update = (req, res) => {
  const borrowId = req.params.id;
  res.send({
    message: `Borrow transaction with ID: ${borrowId} updated successfully`,
  });
};
