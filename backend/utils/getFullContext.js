// utils/getFullContext.js
const { pool } = require("../models/pg")
const Schedule = require("../models/mongoScheduleModel")

const getFullContext = async (userID) => {
  try {
    // 1. Get user metadata
    const userMeta = await pool.query("SELECT major, catalogYear FROM userData WHERE onlineID = $1", [userID])
    if (userMeta.rows.length === 0) return null
    const { major, catalogyear } = userMeta.rows[0]

    // 2. Get classes already taken
    const takenRes = await pool.query("SELECT dept, code, name, semester, creditHours FROM classAlreadyTaken WHERE userID = $1", [userID])
    const classesTaken = takenRes.rows

    // 3. Get catalog requirements
    const catalogRes = await pool.query("SELECT dept, classCode, className, creditHours FROM catalog WHERE major = $1 AND catalogYr = $2", [major, catalogyear])
    const catalogClasses = catalogRes.rows

    // 4. Get latest active schedule
    const allSchedules = await Schedule.find({ userID }).sort({ lastEdited: -1 })
    const currentSchedule = allSchedules.length > 0 ? allSchedules[0].classes : []

    return {
      major,
      catalogYear: catalogyear,
      classesTaken,
      catalogClasses,
      currentSchedule
    }
  } catch (err) {
    console.error("❌ getFullContext error:", err.message)
    return null
  }
}

module.exports = { getFullContext }
