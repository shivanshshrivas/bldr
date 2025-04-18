// backend/server.js
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectMongo = require("./models/mongo")
const { connectPostgres } = require("./models/pg")

// Load env variables
dotenv.config()

const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json())

// Connect databases
connectMongo()
connectPostgres()

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/transcript", require("./routes/transcriptRoutes"))
app.use("/api/suggest", require("./routes/suggestRoutes"))
app.use("/api/search", require("./routes/searchRoutes"))
app.use("/api/schedule", require("./routes/scheduleRoutes"))
app.use("/api/google", require("./routes/googleRoutes"))
app.use("/api/chatbot", require("./routes/chatbotRoutes"))


// Home
app.get("/", (req, res) => {
  res.send("Welcome to bldr API 🚀")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on http://localhost:${PORT}`))
