// backend/server.js
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectMongo = require("./models/mongo")
const { connectPostgres } = require("./models/pg")

// Load env variables
dotenv.config()

const app = express()
app.use(cors())
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



// Home
app.get("/", (req, res) => {
  res.send("Welcome to bldr API 🚀")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
