// routes/scheduleRoutes.js
const express = require("express")
const router = express.Router()
const {
  createNewSchedule,
  changeScheduleName,
  updateScheduleClasses,
  loadUserSchedules,
  deleteSchedule,
  shareSchedule
} = require("../controllers/scheduleController")

// Create new schedule
router.post("/create", createNewSchedule)

// Update schedule name
router.post("/rename", changeScheduleName)

// Update classes in a schedule
router.post("/update", updateScheduleClasses)

// Load all schedules for a user
router.post("/load", loadUserSchedules)

// Soft delete a schedule
router.post("/delete", deleteSchedule)

// Share schedule with another user
router.post("/share", shareSchedule)


module.exports = router
