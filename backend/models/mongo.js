// models/mongo.js
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB Atlas")
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message)
  }
}

module.exports = connectMongo
