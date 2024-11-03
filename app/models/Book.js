// models/Book.model.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
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
      ref: "Publishers", // assuming there's a Publisher model
      required: true,
    },
  },
  { collection: "Books" }
);

const Books = mongoose.model("Books", bookSchema);

module.exports = Books;
