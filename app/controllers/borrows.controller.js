const BorrowService = require("../services/borrows.service.js");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const { bookId, userId, staffId, borrowDate, returnDate } = req.body;

    if (!bookId || !userId || !borrowDate || !returnDate) {
      return next(new ApiError(400, "All fields are required."));
    }

    const borrowService = new BorrowService();

    const result = await borrowService.create({
      bookId,
      userId,
      staffId,
      borrowDate: new Date(borrowDate),
      returnDate: new Date(returnDate),
    });

    return res.status(201).json({
      message: "Borrow record created successfully.",
      data: result,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService();
    const documents = await borrowService.find({});
    return res.send(documents);
  } catch (error) {
    console.error("Error retrieving borrows:", error.message);
    return next(
      new ApiError(500, "An error occurred while retrieving borrows")
    );
  }
};

exports.getById = async (req, res, next) => {
  try {
    const borrowService = new BorrowService();
    const document = await borrowService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Borrow record not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error retrieving borrow record with id=${req.params.id}`
      )
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const borrowService = new BorrowService();
    const document = await borrowService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Borrow record not found"));
    }

    return res.send({ message: "Borrow record was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating borrow record with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const borrowService = new BorrowService();
    const document = await borrowService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Borrow record not found"));
    }

    return res.send({ message: "Borrow record was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete borrow record with id=${req.params.id}`
      )
    );
  }
};

exports.getBorrowsWithDetails = async (req, res, next) => {
  try {
    const borrowService = new BorrowService();
    const borrows = await borrowService.findWithDetails({});

    if (!borrows || borrows.length === 0) {
      return next(new ApiError(404, "No borrow records found"));
    }

    res.json(borrows);
  } catch (error) {
    console.error("Error retrieving borrows with details:", error.message);
    return next(new ApiError(500, "Error retrieving borrow details"));
  }
};

// Controller để lấy lịch sử lượt mượn dựa trên userId
exports.getBorrowHistoryByUserId = async (req, res, next) => {
  try {
    const borrowService = new BorrowService();
    const userId = req.params.id;
    const borrowHistory = await borrowService.findBorrowHistoryByUserId(userId);

    if (!borrowHistory || borrowHistory.length === 0) {
      return next(new ApiError(404, "No borrow history found for this user"));
    }

    res.json(borrowHistory);
  } catch (error) {
    console.error("Error retrieving borrow history:", error.message);
    return next(new ApiError(500, "Error retrieving borrow history"));
  }
};
