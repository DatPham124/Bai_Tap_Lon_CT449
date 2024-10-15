const express = require("express");
const borrows = require("../controllers/borrows.controller");

const router = express.Router();

router.route("/").get(borrows.getAll).post(borrows.create);

router.route("/:id").get(borrows.getById).put(borrows.update);

module.exports = router;
