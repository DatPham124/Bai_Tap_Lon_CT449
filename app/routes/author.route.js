const express = require("express");
const authors = require("../controllers/author.controller");

const router = express.Router();

// Route lấy tất cả tác giả và tạo mới tác giả
router
  .route("/")
  .get(authors.getAll) // Lấy tất cả tác giả
  .post(authors.create); // Tạo tác giả mới

// Route lấy tác giả theo ID, cập nhật và xóa tác giả
router
  .route("/:id")
  .get(authors.getById) // Lấy tác giả theo ID
  .put(authors.update) // Cập nhật tác giả theo ID
  .delete(authors.delete); // Xóa tác giả theo ID

// Route tìm tác giả theo tên
router.get("/search", authors.findByName); // Tìm tác giả theo tên qua query `name`

module.exports = router;
