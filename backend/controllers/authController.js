const bcrypt = require("bcrypt")
const { pool } = require("../models/pg")

// === POST /api/auth/login ===
const loginUser = async (req, res) => {
  const { onlineID, password } = req.body

  try {
    const result = await pool.query("SELECT * FROM userData WHERE userID = $1", [onlineID])

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" })
    }

    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.passhash)

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" })
    }

    return res.json({ message: "Login successful", userID: user.userid })
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Server error" })
  }
}

// === POST /api/auth/signup ===
const signupUser = async (req, res) => {
  const { onlineID, password, major, catalogYear } = req.body
  // In real use, you'd handle unofficialTranscript and parse it

  try {
    // Check if user exists
    const existing = await pool.query("SELECT * FROM userData WHERE userID = $1", [onlineID])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passHash = await bcrypt.hash(password, salt)

    // Insert user
    await pool.query("INSERT INTO userData (userID, passHash) VALUES ($1, $2)", [onlineID, passHash])

    // Insert major(s)
    for (const m of major) {
      await pool.query("INSERT INTO major_minor (userID, type, name) VALUES ($1, 'major', $2)", [onlineID, m])
    }

    return res.json({ message: "Signup successful" })
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ error: "Server error" })
  }
}

module.exports = {
  loginUser,
  signupUser
}
