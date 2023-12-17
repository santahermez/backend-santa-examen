const User = require("./models/userModel");
const Image = require("./models/imageModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("image");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};
