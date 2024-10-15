const express = require("express");
const staff = require("../controllers/staff.controller");

const router = express.Router();

router.route("/").get(staff.getAll).post(staff.create);

router.route("/:id").get(staff.getById).put(staff.update).delete(staff.delete);

module.exports = router;
