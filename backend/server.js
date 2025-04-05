// server.js
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectMongo = require("./models/mongo")
const { connectPostgres } = require("./models/pg")

// Load environment variables
dotenv.config()

// Initialize Express App
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to databases
connectMongo()
connectPostgres()

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to bldr API 🚀")
})

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
// app.use("/api/schedule", require("./routes/scheduleRoutes"))
// app.use("/api/classes", require("./routes/classRoutes"))
// app.use("/api/transcript", require("./routes/transcriptRoutes"))
// app.use("/api/preferences", require("./routes/preferencesRoutes"))

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
