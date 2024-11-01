const StaffsService = require("../services/staffs.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty")); // Kiểm tra tên
  }

  try {
    const staffsService = new StaffsService(MongoDB.client); // Sử dụng StaffsService đúng tên
    const document = await staffsService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating staff"));
  }
};

exports.getAll = async (req, res, next) => {
  let documents = [];

  try {
    const staffsService = new StaffsService(MongoDB.client);
    const { name } = req.query;

    if (name) {
      documents = await staffsService.findByName(name); // Sửa lại theo đúng field name
    } else {
      documents = await staffsService.find({});
    }
  } catch (error) {
    console.error("Error retrieving staff:", error.message);
    console.error("Stack trace:", error.stack);
    return next(new ApiError(500, "An error occurred while retrieving staff"));
  }

  return res.send(documents);
};

exports.getById = async (req, res, next) => {
  try {
    const staffsService = new StaffsService(MongoDB.client);
    const document = await staffsService.findById(req.params.id); // Sử dụng đúng service và logic
    if (!document) {
      return next(new ApiError(404, "Staff not found")); // Thay 'Book' thành 'Staff'
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const staffService = new StaffsService(MongoDB.client);
    const document = await staffService.update(req.params.id, req.body);

    if (!document) {
      console.error(`Staff with ID ${req.params.id} not found`);
      return next(new ApiError(404, "Staff not found"));
    }

    return res.send({ message: "Staff was updated successfully" });
  } catch (error) {
    console.error(
      `Error while updating staff with ID ${req.params.id}:`,
      error.message
    );
    console.error(error.stack);

    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const staffService = new StaffsService(MongoDB.client);
    const document = await staffService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send({ message: "Staff was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete staff with id=${req.params.id}`)
    );
  }
};
