// controllers/chatbotAddController.js
const Schedule = require("../models/mongoScheduleModel")

const addClassToSchedule = async (req, res) => {
  const { userID, classData } = req.body
  if (!userID || !classData) return res.status(400).json({ error: "Missing userID or classData" })

  try {
    const sched = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } })

    if (!sched) return res.status(404).json({ error: "No existing schedule found" })

    sched.classes.push(classData)
    sched.lastEdited = new Date()
    await sched.save()

    res.json({ message: "✅ Class added to schedule", updatedSchedule: sched.classes })
  } catch (err) {
    console.error("❌ Error adding class:", err.message)
    res.status(500).json({ error: "Failed to add class to schedule" })
  }
}

module.exports = {
  addClassToSchedule
}
