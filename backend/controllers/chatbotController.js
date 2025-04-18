const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const { getFullContext } = require("../utils/getFullContext");
const Schedule = require("../models/mongoScheduleModel");

// Import agentic operation controllers
const { addClassToSchedule } = require("./chatbotAddController");
const { removeClassFromSchedule } = require("./chatbotRemoveController");
const { replaceClassInSchedule } = require("./chatbotReplaceController");
const { resetSchedule } = require("./chatbotResetController");

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatbotMessage = async (req, res) => {
  const { userID, message } = req.body;
  if (!userID || !message) return res.status(400).json({ error: "Missing userID or message" });

  try {
    const context = await getFullContext(userID);
    if (!context) return res.status(404).json({ error: "Context not found for user" });

    const { major, catalogYear, classesTaken, catalogClasses, currentSchedule } = context;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an agentic academic scheduling assistant. Interpret user intent and respond with JSON.

Context:
- Major: ${major}
- Catalog Year: ${catalogYear}
- Taken: ${JSON.stringify(classesTaken)}
- Required: ${JSON.stringify(catalogClasses)}
- Current Schedule: ${JSON.stringify(currentSchedule)}

User said: "${message}"

Respond with ONE of the following formats:

(1) Passive:
{
  "type": "passive",
  "message": "string"
}

(2) Active (generate a schedule):
{
  "type": "active",
  "message": "string",
  "schedule": [
    {
      "course": "EECS 678",
      "location": "2415, LEEP2",
      "days": ["Monday", "Wednesday", "Friday"],
      "time": 10,
      "duration": 1
    }
  ]
}

(3) Modify:
{
  "type": "modify",
  "operation": "add/remove/replace/reset",
  "classQuery": "EECS 678",
  "message": "I will add EECS 678 to your schedule"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    let output;
    try {
      output = JSON.parse(responseText);
    } catch (err) {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) output = JSON.parse(match[0]);
    }

    if (!output || !output.type || !output.message) {
      return res.status(500).json({ error: "Malformed AI response" });
    }

    // Passive response
    if (output.type === "passive") {
      return res.json({ type: "passive", message: output.message });
    }

    // Modify response (add, remove, replace, reset)
    if (output.type === "modify") {
      req.body.classQuery = output.classQuery;

      switch (output.operation) {
        case "add":
          return addClassToSchedule(req, res);
        case "remove":
          return removeClassFromSchedule(req, res);
        case "replace":
          return replaceClassInSchedule(req, res);
        case "reset":
          return resetSchedule(req, res);
        default:
          return res.status(400).json({ error: "Unknown operation" });
      }
    }

    // Active response with a full schedule
    if (output.type === "active" && Array.isArray(output.schedule)) {
      const sched = await Schedule.findOne({ userID }, {}, { sort: { lastEdited: -1 } });

      if (sched) {
        sched.classes = output.schedule;
        sched.lastEdited = new Date();
        await sched.save();
      } else {
        await Schedule.create({
          userID,
          schedID: `${userID}-${Date.now()}`,
          semester: "generated",
          scheduleName: "Generated by Chatbot",
          classes: output.schedule,
        });
      }

      return res.json({ type: "active", message: output.message, schedule: output.schedule });
    }

    return res.status(500).json({ error: "Unhandled AI response type" });
  } catch (err) {
    console.error("❌ Chatbot error:", err.message);
    return res.status(500).json({ error: "AI failed to generate response" });
  }
};

module.exports = {
  chatbotMessage,
};
