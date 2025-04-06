// controllers/searchController.js
const { pool } = require("../models/pg")

const searchClasses = async (req, res) => {
  const { query } = req.body
  if (!query || query.trim() === "") return res.status(400).json({ error: "Search query missing" })

  try {
    let result

    // Detect numeric-only → classID
    if (/^\d+$/.test(query)) {
      result = await pool.query("SELECT * FROM availClasses WHERE classID = $1", [query])
    }

    // Detect dept + code like "EECS 563"
    else if (/^[a-zA-Z]+\s\d+$/.test(query)) {
      const [dept, code] = query.split(" ")
      result = await pool.query("SELECT * FROM availClasses WHERE dept = $1 AND code = $2", [dept.toUpperCase(), code])
    }

    // Fallback: class name
    else {
      result = await pool.query("SELECT * FROM availClasses WHERE name ILIKE $1", [`%${query}%`])
    }

    if (result.rows.length === 0) return res.status(404).json({ message: "No classes found" })

    res.json({ classes: result.rows })
  } catch (err) {
    console.error("❌ searchClasses error:", err.message)
    res.status(500).json({ error: "Search failed" })
  }
}

module.exports = { searchClasses }
