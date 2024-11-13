const express = require("express");
const borrows = require("../controllers/borrows.controller");

const router = express.Router();

router.route("/").get(borrows.getAll).post(borrows.create);
router
  .route("/:id")
  .get(borrows.getById)
  .put(borrows.update)
  .delete(borrows.delete);

router.route("/getBook/:id").get(borrows.getBorrowsWithDetails);
router.route("/:id/history").get(borrows.getBorrowHistoryByUserId);

module.exports = router;
