// controllers/chatbotRemoveController.js
const Schedule = require("../models/mongoScheduleModel")

const removeClassFromSchedule = async (req, res) => {
  const { userID, course } = req.body
  if (!userID || !course) return res.status(400).json({ error: "Missing userID or course name" })

  try {
    const sched = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } })
    if (!sched) return res.status(404).json({ error: "No existing schedule found" })

    const originalLength = sched.classes.length
    sched.classes = sched.classes.filter(cls => cls.course !== course)

    if (sched.classes.length === originalLength) {
      return res.status(404).json({ error: `Course '${course}' not found in schedule.` })
    }

    sched.lastEdited = new Date()
    await sched.save()

    res.json({ message: `✅ Removed '${course}' from schedule`, updatedSchedule: sched.classes })
  } catch (err) {
    console.error("❌ Error removing class:", err.message)
    res.status(500).json({ error: "Failed to remove class from schedule" })
  }
}

module.exports = {
  removeClassFromSchedule
}
