// controllers/chatbotReplaceController.js
const { pool } = require("../models/pg");
const Schedule = require("../models/mongoScheduleModel");

const replaceClassInSchedule = async (req, res) => {
  const { userID, classQuery } = req.body;

  if (!userID || !classQuery) {
    return res.status(400).json({ error: "Missing userID or classQuery" });
  }

  try {
    const [dept, code] = classQuery.trim().split(" ");
    if (!dept || !code) {
      return res.status(400).json({ error: "Invalid classQuery format" });
    }

    // Load latest schedule
    const schedule = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } });
    if (!schedule) return res.status(404).json({ error: "No schedule found for user" });

    // Find the class in the user's current schedule
    const existingIndex = schedule.classes.findIndex(
      cls => cls.dept.toUpperCase() === dept.toUpperCase() && String(cls.code) === String(code)
    );

    if (existingIndex === -1) {
      return res.status(404).json({ error: `${dept} ${code} not found in your schedule` });
    }

    // Get a different available section from PostgreSQL
    const available = await pool.query(
      `SELECT * FROM availclasses WHERE dept = $1 AND code = $2 ORDER BY starttime ASC`,
      [dept.toUpperCase(), code]
    );

    const currentClass = schedule.classes[existingIndex];
    const alternative = available.rows.find(c => c.classid !== currentClass.classID);

    if (!alternative) {
      return res.status(404).json({ error: `No alternate section available for ${dept} ${code}` });
    }

    // Replace it
    schedule.classes[existingIndex] = {
      classID: alternative.classid,
      type: alternative.type,
      name: alternative.name,
      dept: alternative.dept,
      code: alternative.code,
      creditHours: alternative.credithours,
      startTime: alternative.starttime,
      endTime: alternative.endtime,
      days: alternative.days,
      instructorName: alternative.instructor,
    };

    schedule.lastEdited = new Date();
    await schedule.save();

    return res.json({
      message: `🔁 Replaced ${dept} ${code} with alternate section (${alternative.classid}).`,
      newClass: {
        course: `${alternative.dept} ${alternative.code}`,
        time: `${alternative.starttime} - ${alternative.endtime}`,
        days: alternative.days,
        instructor: alternative.instructor,
      },
    });
  } catch (err) {
    console.error("❌ Replace class error:", err.message);
    return res.status(500).json({ error: "Failed to replace class" });
  }
};

module.exports = {
  replaceClassInSchedule,
};
