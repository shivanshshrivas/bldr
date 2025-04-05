const mongoose = require("mongoose")

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("✅ Connected to MongoDB Atlas")
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message)
    process.exit(1)
  }
}

module.exports = connectMongo
