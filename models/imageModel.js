const mongoose = require("mongoose");

const Image = mongoose.model(
  "Image",
  {
    data: Buffer,
    contentType: String,
  },
  { timestamps: true }
);

module.exports = Image;
