require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./dbConnect");

const userRoutes = require("./routes/userRoute");
// const imageRoutes = require("./routes/imageRoute");

// execute database connection
dbConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from my server!");
});

app.use("/user", userRoutes);
// app.use("/", imageRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
