// controllers/chatbotRemoveController.js
const Schedule = require("../models/mongoScheduleModel");

const removeClassFromSchedule = async (req, res) => {
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

    // Load latest schedule
    const schedule = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } });

    if (!schedule) {
      return res.status(404).json({ error: "No schedule found for user" });
    }

    // Filter out matching classes
    const originalLength = schedule.classes.length;
    schedule.classes = schedule.classes.filter(
      cls => !(cls.dept.toUpperCase() === dept.toUpperCase() && String(cls.code) === String(code))
    );

    if (schedule.classes.length === originalLength) {
      return res.status(404).json({ error: `Class ${dept} ${code} not found in schedule` });
    }

    schedule.lastEdited = new Date();
    await schedule.save();

    return res.json({
      message: `✅ Removed ${dept} ${code} from your schedule.`,
      updatedSchedule: schedule.classes,
    });
  } catch (err) {
    console.error("❌ Remove class error:", err.message);
    return res.status(500).json({ error: "Failed to remove class" });
  }
};

module.exports = {
  removeClassFromSchedule,
};
