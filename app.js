const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const ApiError = require("./app/api-error");
const booksRouter = require("./app/routes/books.route");
const borrowsRouter = require("./app/routes/borrows.route");
const staffRouter = require("./app/routes/staff.route");
const usersRouter = require("./app/routes/users.route");
const authRouter = require("./app/routes/auth.route");
const pubRouter = require("./app/routes/pub.route");
const authorRouter = require("./app/routes/author.route");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

// Định nghĩa các route API
app.use("/api/auth", authRouter);
app.use("/api/book", booksRouter);
app.use("/api/borrow", borrowsRouter);
app.use("/api/staff", staffRouter);
app.use("/api/user", usersRouter);
app.use("/api/pub", pubRouter);
app.use("/api/author", authorRouter);

// Xử lý khi không tìm thấy tài nguyên
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
