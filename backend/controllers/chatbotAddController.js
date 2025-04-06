// controllers/chatbotAddController.js
const { pool } = require("../models/pg");
const Schedule = require("../models/mongoScheduleModel");

const addClassToSchedule = async (req, res) => {
  const { userID, classQuery } = req.body;

  if (!userID || !classQuery) {
    return res.status(400).json({ error: "Missing userID or classQuery" });
  }

  try {
    // Break classQuery into dept and code (e.g., "EECS 510")
    const [dept, code] = classQuery.trim().split(" ");

    if (!dept || !code) {
      return res.status(400).json({ error: "Invalid classQuery format" });
    }

    // Search for matching class in PostgreSQL
    const result = await pool.query(
      `SELECT * FROM availclasses WHERE dept = $1 AND code = $2 ORDER BY starttime ASC LIMIT 1`,
      [dept.toUpperCase(), code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Class ${classQuery} not found` });
    }

    const classToAdd = result.rows[0];

    // Get user's latest MongoDB schedule
    const schedule = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } });

    if (!schedule) {
      return res.status(404).json({ error: "No schedule found to add class to" });
    }

    // Add class
    schedule.classes.push({
      classID: classToAdd.classid,
      type: classToAdd.type,
      name: classToAdd.name,
      dept: classToAdd.dept,
      code: classToAdd.code,
      creditHours: classToAdd.credithours,
      startTime: classToAdd.starttime,
      endTime: classToAdd.endtime,
      days: classToAdd.days,
      instructorName: classToAdd.instructor,
    });

    schedule.lastEdited = new Date();
    await schedule.save();

    return res.json({
      message: `✅ Added ${classToAdd.dept} ${classToAdd.code} (${classToAdd.classid}) to your schedule.`,
      addedClass: {
        course: `${classToAdd.dept} ${classToAdd.code}`,
        instructor: classToAdd.instructor,
        time: `${classToAdd.starttime} - ${classToAdd.endtime}`,
        days: classToAdd.days,
      },
    });
  } catch (err) {
    console.error("❌ Add class error:", err.message);
    return res.status(500).json({ error: "Failed to add class" });
  }
};

module.exports = {
  addClassToSchedule,
};
