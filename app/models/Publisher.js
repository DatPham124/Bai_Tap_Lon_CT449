// models/Publisher.js
const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    publisherId: {
      type: String,
      required: true,
      unique: true,
    },
    publisherAddress: {
      type: String,
      required: true,
    },
    publisherName: {
      type: String,
      required: true,
    },
  },
  { collection: "Publishers" }
);

const Publishers = mongoose.model("Publishers", publisherSchema);

module.exports = Publishers;
