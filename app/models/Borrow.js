// models/Borrow.js
const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staffs",
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
  },
  { collection: "Borrows" }
);

const Borrows = mongoose.model("Borrows", borrowSchema);

module.exports = Borrows;
