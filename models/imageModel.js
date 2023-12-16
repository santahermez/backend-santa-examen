const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: String, // Namn på bilden
  data: Buffer, // Bilddata som en buffer
  contentType: String, // Typ av innehåll (t.ex. image/jpeg, image/png)
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
