// controllers/authController.js
const bcrypt = require("bcrypt")
const fs = require("fs")
const pdfParse = require("pdf-parse")
const { pool } = require("../models/pg")
const { parseWithGemini } = require("../utils/geminiParser")

// === POST /api/auth/signup ===
const signupUser = async (req, res) => {
  const { onlineID, password, major, catalogYear } = req.body
  const file = req.file

  if (!file) return res.status(400).json({ error: "Transcript file missing" })

  try {
    // Check if user exists
    const existing = await pool.query("SELECT * FROM userData WHERE onlineID = $1", [onlineID])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passHash = await bcrypt.hash(password, salt)

    // Insert into userData
    await pool.query(
      "INSERT INTO userData (onlineID, passHash, major, catalogYear) VALUES ($1, $2, $3, $4)",
      [onlineID, passHash, major, catalogYear]
    )

    // Parse transcript PDF
    const pdfBuffer = fs.readFileSync(file.path)
    const { text } = await pdfParse(pdfBuffer)

    // Use Gemini API to extract classes
    const parsedClasses = await parseWithGemini(text)

    // Insert into classAlreadyTaken
    for (const cls of parsedClasses) {
      await pool.query(
        `INSERT INTO classAlreadyTaken (userID, dept, code, semester, name, creditHours)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          onlineID,
          cls.dept,
          cls.classCode || cls.code,
          cls.semesterTaken || cls.semester,
          cls.className || cls.name,
          cls.creditHours
        ]
      )
    }

    // Remove the transcript file after processing
    fs.unlinkSync(file.path)

    return res.json({ message: "Signup successful and transcript parsed", parsedClasses })
  } catch (err) {
    console.error("❌ Signup Error:", err.message)
    return res.status(500).json({ error: "Server error during signup" })
  }
}

// === POST /api/auth/login ===
const loginUser = async (req, res) => {
  const { onlineID, password } = req.body

  try {
    const result = await pool.query("SELECT * FROM userData WHERE onlineID = $1", [onlineID])
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" })
    }

    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.passhash)

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" })
    }

    return res.json({ message: "Login successful", userID: user.onlineid })
  } catch (err) {
    console.error("❌ Login Error:", err.message)
    return res.status(500).json({ error: "Server error during login" })
  }
}

module.exports = {
  signupUser,
  loginUser
}