// controllers/chatbotResetController.js
const Schedule = require("../models/mongoScheduleModel");

const resetSchedule = async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }

  try {
    // Find the most recently edited schedule
    const schedule = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } });

    if (!schedule) {
      return res.status(404).json({ error: "No schedule found to reset" });
    }

    // Clear classes array
    schedule.classes = [];
    schedule.lastEdited = new Date();
    await schedule.save();

    return res.json({
      message: "🧹 Your schedule has been cleared successfully.",
      clearedScheduleID: schedule.schedID,
    });
  } catch (err) {
    console.error("❌ Reset schedule error:", err.message);
    return res.status(500).json({ error: "Failed to reset schedule" });
  }
};

module.exports = {
  resetSchedule,
};
