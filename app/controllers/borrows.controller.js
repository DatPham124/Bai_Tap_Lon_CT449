const { ObjectId } = require("mongodb");
const BorrowService = require("../services/borrows.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const { bookId, userId, staffId, borrowDate, returnDate } = req.body;

    if (!bookId || !userId || !staffId || !borrowDate || !returnDate) {
      return next(new ApiError(400, "All fields are required."));
    }

    const client = MongoDB.getClient();
    if (!client) {
      return next(new ApiError(500, "Database connection error."));
    }

    const borrowService = new BorrowService(client);

    const result = await borrowService.create({
      bookId: new ObjectId(bookId),
      userId: new ObjectId(userId),
      staffId: new ObjectId(staffId),
      borrowDate: new Date(borrowDate),
      returnDate: new Date(returnDate),
    });

    if (!result) {
      return next(new ApiError(404, "Borrow record could not be created."));
    }

    return res.status(201).json({
      message: "Borrow record created successfully.",
      data: result,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const borrowService = new BorrowService(MongoDB.client);
    documents = await borrowService.find({});
  } catch (error) {
    console.error("Error retrieving borrow:", error.message);
    console.error("Stack trace:", error.stack);
    return next(
      new ApiError(500, "An error occurred while retrieving borrows")
    );
  }

  return res.send(documents);
};

exports.getById = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Borrow not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving borrow with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const borrowService = new BorrowService(MongoDB.getClient());
    const document = await borrowService.update(req.params.id, req.body);

    if (!document) {
      console.error(`Borrow record with ID ${req.params.id} not found`);
      return next(new ApiError(404, "Borrow record not found"));
    }

    return res.send({ message: "Borrow record was updated successfully" });
  } catch (error) {
    console.error(
      `Error while updating borrow record with ID ${req.params.id}:`,
      error.message
    );
    return next(
      new ApiError(500, `Error updating borrow record with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.getClient());
    const document = await borrowService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Borrow record not found"));
    }

    return res.send({ message: "Borrow record was deleted successfully" });
  } catch (error) {
    console.error(
      `Error while deleting borrow record with ID ${req.params.id}:`,
      error.message
    );
    return next(
      new ApiError(
        500,
        `Could not delete borrow record with id=${req.params.id}`
      )
    );
  }
};
// borrow.controller.js
exports.getBorrowsWithDetails = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.getClient());
    const borrows = await borrowService.findWithDetails({}); // Lấy tất cả bản ghi mượn với chi tiết

    if (!borrows || borrows.length === 0) {
      return next(new ApiError(404, "No borrow records found"));
    }

    res.json(borrows); // Trả về dữ liệu chi tiết
  } catch (error) {
    console.error(
      "Error while retrieving borrows with details:",
      error.message
    );
    return next(new ApiError(500, "Error retrieving borrow details"));
  }
};
