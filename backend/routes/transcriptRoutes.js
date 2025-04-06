// routes/transcriptRoutes.js
const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")
const { parseTranscript } = require("../controllers/transcriptController")

// Re-upload transcript for parsing and update
router.post("/", upload.single("transcript"), parseTranscript)

module.exports = router