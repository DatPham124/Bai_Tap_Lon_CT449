const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const booksRouter = require("./app/routes/books.route");
const borrowsRouter = require("./app/routes/borrows.route");
const staffRouter = require("./app/routes/staff.route");
const usersRouter = require("./app/routes/users.route");
const authRouter = require("./app/routes/auth.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Chay oi nhe" });
});

app.use("/api/books", booksRouter);

app.use("/api/borrows", borrowsRouter);

app.use("/api/staff", staffRouter);

app.use("/api/users", usersRouter);

app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  // Code o day se chay khi khong co route duoc dinh nghia nao
  // khop voi yeu cau. Goi next() de chuyen sang middleware xu ly loi
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  // Middleware xu ly loi tap trung.
  // Trong cac doan code xu ly o cac route, goi next(error) se chuyen ve middleware xu ly loi nay
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
