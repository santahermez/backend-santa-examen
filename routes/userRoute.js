const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();

    res.status(200).json({
      message: "User Created Successfully",
      result,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({ message: "Email not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return response.status(400).json({ message: "Passwords do not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      process.env.JWT_SECRET, // Replace with your actual secret
      { expiresIn: "24h" }
    );

    response.status(200).json({
      message: "Login Successful",
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Show all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users: users.length, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
