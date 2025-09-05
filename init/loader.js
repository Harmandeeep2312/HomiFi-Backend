const mongoose = require("mongoose");
const initData = require("./data.js");
const Content = require("../models/contentSchema.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./server/.env" }); // make sure path points to your .env

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error("❌ DB_URL is missing. Check your .env file");
  process.exit(1);
}

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
const initDb = async ()=>{
    await Content.deleteMany({});
    await Content.insertMany(initData.data);
}

module.exports = mongoose;