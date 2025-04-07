const { pool } = require("../models/pg");
const Schedule = require("../models/mongoScheduleModel");

const addClassToSchedule = async (req, res) => {
  const { userID, classQuery } = req.body;

  if (!userID || !classQuery) {
    return res.status(400).json({ error: "Missing userID or classQuery" });
  }

  try {
    // Handle queries like "EECS 678", "EECS 678 LEC", "EECS 678 DIS"
    const parts = classQuery.trim().split(" ");
    if (parts.length < 2) {
      return res.status(400).json({ error: "Invalid classQuery format. Expected 'DEPT CODE [TYPE]'" });
    }

    const dept = parts[0].toUpperCase();
    const code = parts[1];
    const type = parts[2] ? parts[2].toUpperCase() : null;

    let query = `SELECT * FROM availclasses WHERE dept = $1 AND code = $2`;
    const values = [dept, code];

    if (type) {
      query += ` AND type = $3`;
      values.push(type);
    }

    query += ` ORDER BY starttime ASC LIMIT 1`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Class ${classQuery} not found` });
    }

    const classToAdd = result.rows[0];

    // Find latest schedule
    const schedule = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } });

    if (!schedule) {
      return res.status(404).json({ error: "No schedule found to add class to" });
    }

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
      message: `✅ Added ${classToAdd.dept} ${classToAdd.code} ${classToAdd.type} (${classToAdd.classid}) to your schedule.`,
      addedClass: {
        course: `${classToAdd.dept} ${classToAdd.code}`,
        type: classToAdd.type,
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
