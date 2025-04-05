const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
  classID: Number,
  type: String,
  name: String,
  dept: String,
  code: Number,
  creditHours: Number,
  startTime: String,
  endTime: String,
  days: String,
  instructorName: String,
  roomNumber: String,
  buildingName: String
})

const scheduleSchema = new mongoose.Schema({
  schedID: String,         // matches Postgres schedID
  userID: String,          // user who owns this schedule
  semester: String,
  scheduleName: String,
  lastEdited: { type: Date, default: Date.now },
  classes: [classSchema]
})

module.exports = mongoose.model("Schedule", scheduleSchema)
