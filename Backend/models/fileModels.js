const mongoose = require("mongoose");

// File model
const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user details is required"],
    },
    filename: {
      type: String,
      required: [true, "filename is required"],
    },
    code: {
      type: String,
      required: [true, "code is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("file", fileSchema);
