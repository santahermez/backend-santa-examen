const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnect = require("./dbConnect");
const userRoutes = require("./routes/userRoute");
const User = require('./models/userModel')
require("dotenv").config();
dbConnect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from my server!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users: users.length, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/", userRoutes);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
