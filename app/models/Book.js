// models/Book.model.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authors", // liên kết đến model Authors
      required: true,
    },
    numberOfCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publishers", // liên kết đến model Publishers
      required: true,
    },
  },
  { collection: "Books" }
);

const Books = mongoose.model("Books", bookSchema);

module.exports = Books;
