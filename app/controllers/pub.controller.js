const PublishersService = require("../services/pub.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Hàm để xử lý khi tạo nhà xuất bản mới
exports.create = async (req, res, next) => {
  if (!req.body?.NXB_Ten) {
    return next(new ApiError(400, "Publisher name cannot be empty"));
  }

  try {
    const publisherService = new PublishersService(MongoDB.client);
    const document = await publisherService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the publisher")
    );
  }
};

// Hàm để lấy danh sách tất cả nhà xuất bản
exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const publisherService = new PublishersService(MongoDB.client);
    const { NXB_Ten } = req.query;

    if (NXB_Ten) {
      documents = await publisherService.findByName(NXB_Ten);
    } else {
      documents = await publisherService.find({});
    }
  } catch (error) {
    console.error("Error retrieving publishers:", error.message);
    console.error("Stack trace:", error.stack);
    return next(
      new ApiError(500, "An error occurred while retrieving publishers")
    );
  }

  return res.send(documents);
};

// Hàm để lấy thông tin chi tiết của một nhà xuất bản theo ID
exports.getById = async (req, res, next) => {
  try {
    const publisherService = new PublishersService(MongoDB.client);
    const document = await publisherService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving publisher with id=${req.params.id}`)
    );
  }
};

// Hàm để cập nhật thông tin của một nhà xuất bản
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const publisherService = new PublishersService(MongoDB.client);
    const document = await publisherService.update(req.params.id, req.body);

    if (!document) {
      console.error(`Publisher with ID ${req.params.id} not found`);
      return next(new ApiError(404, "Publisher not found"));
    }

    return res.send({ message: "Publisher was updated successfully" });
  } catch (error) {
    console.error(
      `Error while updating publisher with ID ${req.params.id}:`,
      error.message
    );
    console.error(error.stack);

    return next(
      new ApiError(500, `Error updating publisher with id=${req.params.id}`)
    );
  }
};

// Hàm để xóa một nhà xuất bản
exports.delete = async (req, res, next) => {
  try {
    const publisherService = new PublishersService(MongoDB.client);
    const document = await publisherService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send({ message: "Publisher was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete publisher with id=${req.params.id}`)
    );
  }
};