const StaffsService = require("../services/staffs.service");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name cannot be empty"));
  }

  try {
    const staffsService = new StaffsService();
    const document = await staffsService.create(req.body);
    return res.status(201).send(document);
  } catch (error) {
    console.error("Error creating staff:", error.message);
    return next(new ApiError(500, "An error occurred while creating staff"));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const staffsService = new StaffsService();
    const { name } = req.query;

    const filter = name ? { name: new RegExp(name, "i") } : {}; // Tìm kiếm theo tên nếu có
    const documents = await staffsService.find(filter);

    return res.send(documents);
  } catch (error) {
    console.error("Error retrieving staff:", error.message);
    return next(new ApiError(500, "An error occurred while retrieving staff"));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const staffsService = new StaffsService();
    const document = await staffsService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send(document);
  } catch (error) {
    console.error("Error retrieving staff:", error.message);
    return next(
      new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const staffsService = new StaffsService();
    const document = await staffsService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }

    return res.send({ message: "Staff was updated successfully" });
  } catch (error) {
    console.error("Error updating staff:", error.message);
    return next(
      new ApiError(500, `Error updating staff with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const staffsService = new StaffsService();
    const document = await staffsService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }

    return res.send({ message: "Staff was deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error.message);
    return next(
      new ApiError(500, `Could not delete staff with id=${req.params.id}`)
    );
  }
};
