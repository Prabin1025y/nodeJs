const mongoose = require("mongoose");

async function connectToDb() {
  // await mongoose.connect("mongodb+srv://prabin1025y:prabin1025y@nodejs.0t2ijxr.mongodb.net/?retryWrites=true&w=majority&appName=NodeJs");
  await mongoose.connect("mongodb://localhost:27017/blog");
  console.log("Database Connected");
}

module.exports = connectToDb;
