const mongoose = require("mongoose");
const Image = require("./imageModel");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    lastLogin: {
      type: String,
      default: null,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("findOne", function (next) {
  this.populate("image");
  next();
});

module.exports = mongoose.model("Users", UserSchema);
