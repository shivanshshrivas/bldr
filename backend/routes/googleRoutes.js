// routes/googleRoutes.js
const express = require("express")
const router = express.Router()
const {
  initiateGoogleAuth,
  handleGoogleCallback,
  syncToGoogleCalendar
} = require("../controllers/googleController")

// POST: Get Google Auth URL
router.post("/initiate", initiateGoogleAuth)

// GET: Google redirect callback
router.get("/callback", handleGoogleCallback)

// POST: Sync schedule to Google Calendar
router.post("/sync", syncToGoogleCalendar)

module.exports = router
