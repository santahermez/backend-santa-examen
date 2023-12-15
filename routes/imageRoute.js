// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const User = require("../models/userModel");
// const Image = require("../models/imageModel");

// const storage = multer.diskStorage({
//   destination: "../uploads",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
// }).single("profileImage");

// router.post("/upload", (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     // Här kopplar du bilden till användaren i databasen
//     const userId = req.query.userId; // Förväntar sig användar-ID som en parameter
//     const profileImagePath = req.file.path;

//     try {
//       // Uppdatera användarens dokument i databasen med filvägen till profilbilden
//       await User.findByIdAndUpdate(userId, { profileImage: profileImagePath });

//       res.json({ success: true, message: "Bild laddad upp!" });
//     } catch (error) {
//       console.error("Error updating user profile image:", error.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
// });
