// controllers/suggestController.js
const { pool } = require("../models/pg")

const suggestClasses = async (req, res) => {
  const { userID } = req.body
  if (!userID) return res.status(400).json({ error: "Missing userID" })

  try {
    // Get user's major and catalog year
    const userRes = await pool.query("SELECT major, catalogYear FROM userData WHERE onlineID = $1", [userID])
    if (userRes.rows.length === 0) return res.status(404).json({ error: "User not found" })

    const { major, catalogyear } = userRes.rows[0]

    // Get all classes from catalog for that major/year
    const catalogRes = await pool.query(
      "SELECT * FROM catalog WHERE major = $1 AND catalogYr = $2",
      [major, catalogyear]
    )

    // Get all class codes already taken
    const takenRes = await pool.query(
      "SELECT dept, code FROM classAlreadyTaken WHERE userID = $1",
      [userID]
    )
    const takenSet = new Set(takenRes.rows.map(r => `${r.dept}-${r.code}`))

    // Filter catalog classes not in takenSet
    const suggestions = catalogRes.rows.filter(cls => !takenSet.has(`${cls.dept}-${cls.classcode}`))

    res.json({ suggestedClasses: suggestions })
  } catch (err) {
    console.error("❌ suggestClasses error:", err.message)
    res.status(500).json({ error: "Failed to suggest classes" })
  }
}

module.exports = { suggestClasses }
