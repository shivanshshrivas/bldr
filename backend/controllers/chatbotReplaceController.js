// controllers/chatbotReplaceController.js
const Schedule = require("../models/mongoScheduleModel")

const replaceClassInSchedule = async (req, res) => {
  const { userID, oldCourse, newClassData } = req.body
  if (!userID || !oldCourse || !newClassData) return res.status(400).json({ error: "Missing userID, oldCourse, or newClassData" })

  try {
    const sched = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } })
    if (!sched) return res.status(404).json({ error: "No existing schedule found" })

    const idx = sched.classes.findIndex(cls => cls.course === oldCourse)
    if (idx === -1) return res.status(404).json({ error: `Course '${oldCourse}' not found in schedule.` })

    sched.classes[idx] = newClassData
    sched.lastEdited = new Date()
    await sched.save()

    res.json({ message: `✅ Replaced '${oldCourse}' with '${newClassData.course}'`, updatedSchedule: sched.classes })
  } catch (err) {
    console.error("❌ Error replacing class:", err.message)
    res.status(500).json({ error: "Failed to replace class in schedule" })
  }
}

module.exports = {
  replaceClassInSchedule
}
