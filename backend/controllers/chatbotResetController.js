// controllers/chatbotResetController.js
const Schedule = require("../models/mongoScheduleModel")

const resetSchedule = async (req, res) => {
  const { userID } = req.body
  if (!userID) return res.status(400).json({ error: "Missing userID" })

  try {
    const result = await Schedule.deleteMany({ userID })
    res.json({ message: `✅ Reset successful. ${result.deletedCount} schedule(s) deleted.` })
  } catch (err) {
    console.error("❌ Error resetting schedule:", err.message)
    res.status(500).json({ error: "Failed to reset schedule" })
  }
}

module.exports = {
  resetSchedule
}
