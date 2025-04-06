// controllers/scheduleController.js
const { pool } = require("../models/pg")
const Schedule = require("../models/mongoScheduleModel")
const { v4: uuidv4 } = require("uuid")
const nodemailer = require("nodemailer")

// === Create New Schedule ===
const createNewSchedule = async (req, res) => {
  const { userID, semester } = req.body
  if (!userID || !semester) return res.status(400).json({ error: "Missing userID or semester" })

  try {
    const schedID = uuidv4()
    await pool.query("INSERT INTO userSched (userID, schedID) VALUES ($1, $2)", [userID, schedID])
    const newSchedule = new Schedule({ schedID, userID, semester, scheduleName: "Untitled", classes: [] })
    await newSchedule.save()
    res.json({ message: "New schedule created", schedID })
  } catch (err) {
    console.error("❌ createNewSchedule error:", err.message)
    res.status(500).json({ error: "Failed to create schedule" })
  }
}

// === Change Schedule Name ===
const changeScheduleName = async (req, res) => {
  const { schedID, newName } = req.body
  if (!schedID || !newName) return res.status(400).json({ error: "Missing schedID or newName" })
  try {
    await Schedule.updateOne({ schedID }, { scheduleName: newName, lastEdited: new Date() })
    res.json({ message: "Schedule name updated" })
  } catch (err) {
    console.error("❌ changeScheduleName error:", err.message)
    res.status(500).json({ error: "Failed to update schedule name" })
  }
}

// === Update Schedule Classes ===
const updateScheduleClasses = async (req, res) => {
  const { schedID, newClasses } = req.body
  if (!schedID || !Array.isArray(newClasses)) return res.status(400).json({ error: "Missing schedID or invalid classes" })
  try {
    await Schedule.updateOne({ schedID }, { classes: newClasses, lastEdited: new Date() })
    res.json({ message: "Schedule classes updated" })
  } catch (err) {
    console.error("❌ updateScheduleClasses error:", err.message)
    res.status(500).json({ error: "Failed to update classes" })
  }
}

// === Load All Schedules for User ===
const loadUserSchedules = async (req, res) => {
  const { userID } = req.body
  if (!userID) return res.status(400).json({ error: "Missing userID" })
  try {
    const schedules = await Schedule.find({ userID }).sort({ semester: 1, lastEdited: -1 })
    res.json({ schedules })
  } catch (err) {
    console.error("❌ loadUserSchedules error:", err.message)
    res.status(500).json({ error: "Failed to load schedules" })
  }
}

// === Soft Delete a Schedule ===
const deleteSchedule = async (req, res) => {
  const { schedID } = req.body
  if (!schedID) return res.status(400).json({ error: "Missing schedID" })
  try {
    await pool.query("UPDATE userSched SET isDeleted = TRUE WHERE schedID = $1", [schedID])
    await Schedule.deleteOne({ schedID })
    res.json({ message: "Schedule deleted" })
  } catch (err) {
    console.error("❌ deleteSchedule error:", err.message)
    res.status(500).json({ error: "Failed to delete schedule" })
  }
}

// === Share Schedule via Email ===
const shareSchedule = async (req, res) => {
  const { schedID, sendTo, senderName, customText } = req.body
  if (!schedID || !sendTo || !senderName) return res.status(400).json({ error: "Missing required fields" })

  try {
    const schedule = await Schedule.findOne({ schedID })
    if (!schedule) return res.status(404).json({ error: "Schedule not found" })

    const classList = schedule.classes.map(cls => `• ${cls.name} (${cls.dept} ${cls.code}) ${cls.startTime}-${cls.endTime} on ${cls.days}`).join("\n")

    const message = `Hi,\n\n${senderName} has shared their class schedule with you for ${schedule.semester}.\n\n${customText || "Here's my schedule:"}\n\n${classList}`

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sendTo,
      subject: `Shared Schedule from ${senderName}`,
      text: message
    })

    res.json({ message: "Schedule shared via email" })
  } catch (err) {
    console.error("❌ shareSchedule error:", err.message)
    res.status(500).json({ error: "Failed to share schedule" })
  }
}

module.exports = {
  createNewSchedule,
  changeScheduleName,
  updateScheduleClasses,
  loadUserSchedules,
  deleteSchedule,
  shareSchedule
}
