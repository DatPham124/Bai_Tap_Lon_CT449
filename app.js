const express = require("express");
const cors = require("cors");
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

module.exports = app;
