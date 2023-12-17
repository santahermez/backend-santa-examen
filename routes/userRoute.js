const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Image = require("../models/imageModel");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require("../userController");
const JWT_SECRET = "veryverySecret" || process.env.JWT_SECRET;
// Register
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Email already exists.", field: "email" });
    }
    if (existingUsername) {
      return res
        .status(409)
        .json({ message: "Username already exists.", field: "username" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();

    return res.status(200).json({
      message: "User Created Successfully",
      result,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log(identifier);

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", field: "identifier" });
    }

    // Vänta på att bcrypt.compare ska slutföra innan du går vidare
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res
        .status(400)
        .json({ message: "Wrong password!", field: "password" });
    }
    if (user && passwordCheck) {
      user.lastLogin = new Date().toUTCString().slice(5, 22);
      await user.save();

      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Login Successful",
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        token,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ladda upp en profilbild
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const userID = req.body.userID;

    // Spara bilden i databasen
    const newImage = new Image({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await newImage.save();

    // Koppla bilden till användaren
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.image = newImage._id;
    await user.save();

    res.send("Image uploaded successfully!");
  } catch (error) {
    console.error("Error during image upload:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate("image");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint för att hämta bildinformation
router.get("/image/:imageId", async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const image = await Image.findOne({ _id: imageId });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error("Error fetching image data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/users", userController.getAllUsers);
// router.get("/user/:id");

module.exports = router;
