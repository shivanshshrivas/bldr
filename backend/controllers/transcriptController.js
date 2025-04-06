// controllers/transcriptController.js
const fs = require("fs")
const pdfParse = require("pdf-parse")
const { pool } = require("../models/pg")
const { parseWithGemini } = require("../utils/geminiParser")

const parseTranscript = async (req, res) => {
  const { userID } = req.body
  const file = req.file

  if (!file || !userID) {
    return res.status(400).json({ error: "Missing userID or transcript file" })
  }

  try {
    // Read & parse the PDF file
    const fileData = fs.readFileSync(file.path)
    const { text } = await pdfParse(fileData)

    // Parse using Gemini
    const parsedClasses = await parseWithGemini(text)

    // Delete previous class history for this user
    await pool.query("DELETE FROM classAlreadyTaken WHERE userID = $1", [userID])

    // Insert new data
    for (const cls of parsedClasses) {
      await pool.query(
        `INSERT INTO classAlreadyTaken (userID, dept, code, semester, name, creditHours)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userID,
          cls.dept,
          cls.classCode || cls.code,
          cls.semesterTaken || cls.semester,
          cls.className || cls.name,
          cls.creditHours
        ]
      )
    }

    // Cleanup
    fs.unlinkSync(file.path)

    return res.json({ message: "Transcript reprocessed successfully", parsedClasses })
  } catch (err) {
    console.error("❌ Transcript parsing error:", err.message)
    return res.status(500).json({ error: "Failed to process transcript" })
  }
}

module.exports = { parseTranscript }
