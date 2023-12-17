const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL =
  "mongodb+srv://test1:testing123@santaslogin.2fyjfpl.mongodb.net/?retryWrites=true&w=majority" ||
  process.env.DATABASE_URL;
async function dbConnect() {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB. Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
}

module.exports = dbConnect;
