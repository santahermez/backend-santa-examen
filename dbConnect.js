const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB. Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
}

module.exports = dbConnect;
