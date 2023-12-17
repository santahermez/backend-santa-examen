const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnect = require("./dbConnect");
const userRoutes = require("./routes/userRoute");
require("dotenv").config();
dbConnect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from my server!");
});

app.use("/", userRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
