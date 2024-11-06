const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
  {
    AuthorName: {
      type: String,
      required: true,
    },
  },
  { collection: "Authors" }
);

// Tạo model cho Author
module.exports = mongoose.model("Authors", AuthorSchema);
