// routes/chatbotRoutes.js
const express = require("express")
const router = express.Router()

const { chatbotMessage } = require("../controllers/chatbotController")
const { resetSchedule } = require("../controllers/chatbotResetController")
const { addClassToSchedule } = require("../controllers/chatbotAddController")
const { removeClassFromSchedule } = require("../controllers/chatbotRemoveController")
const { replaceClassInSchedule } = require("../controllers/chatbotReplaceController")

// AI-powered assistant route
router.post("/message", chatbotMessage)

// Reset user's schedule
router.post("/reset", resetSchedule)

// Add class to user's schedule
router.post("/add", addClassToSchedule)

// Remove class from user's schedule
router.post("/remove", removeClassFromSchedule)

// Replace class in user's schedule
router.post("/replace", replaceClassInSchedule)


module.exports = router
