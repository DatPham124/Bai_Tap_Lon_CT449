const express = require("express");
const books = require("../controllers/books.controller");

const router = express.Router();

router.route("/").get(books.getAll).post(books.create);

router.route("/:id").get(books.getById).put(books.update).delete(books.delete);

module.exports = router;
