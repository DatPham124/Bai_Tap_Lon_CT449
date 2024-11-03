// models/Staff.js
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { collection: "Staffs" } // Tên collection
);

const Staffs = mongoose.model("Staffs", staffSchema);

module.exports = Staffs;
