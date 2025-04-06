// controllers/googleController.js
const { google } = require("googleapis")
const { pool } = require("../models/pg")
const Schedule = require("../models/mongoScheduleModel")
const dotenv = require("dotenv")
dotenv.config()

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// === STEP 1: Initiate OAuth ===
const initiateGoogleAuth = async (req, res) => {
  const { userID } = req.body
  if (!userID) return res.status(400).json({ error: "Missing userID" })

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: userID // include userID as state
  })

  console.log("Auth URL:", authUrl)
  res.json({ authUrl })
}

// === STEP 2: Handle Callback & Store Tokens ===
const handleGoogleCallback = async (req, res) => {
  const { code, state } = req.query
  const userID = state
  if (!code || !userID) return res.status(400).send("Missing code or userID")

  try {
    const { tokens } = await oauth2Client.getToken(code)
    const { access_token, refresh_token, expiry_date } = tokens

    // Convert expiry_date to a timestamp that fits Postgres
    const expiryTimestamp = new Date(expiry_date).toISOString()

    // Save tokens to DB
    await pool.query(
      `INSERT INTO googleTokens (userID, accessToken, refreshToken, tokenExpiry)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (userID) DO UPDATE
       SET accessToken = EXCLUDED.accessToken,
           refreshToken = EXCLUDED.refreshToken,
           tokenExpiry = EXCLUDED.tokenExpiry`,
      [userID, access_token, refresh_token, expiryTimestamp]
    )

    res.send("✅ Google Calendar linked! You can close this tab.")
  } catch (err) {
    console.error("❌ Google Auth Callback Error:", err.message)
    res.status(500).send("Failed to link calendar")
  }
}

// === STEP 3: Sync schedule to Google Calendar ===
const syncToGoogleCalendar = async (req, res) => {
  const { userID, schedID } = req.body
  if (!userID || !schedID) return res.status(400).json({ error: "Missing userID or schedID" })

  try {
    const tokenRes = await pool.query("SELECT * FROM googleTokens WHERE userID = $1", [userID])
    if (tokenRes.rows.length === 0) return res.status(400).json({ error: "Google not connected" })

    const { accessToken, refreshToken } = tokenRes.rows[0]
    oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const schedule = await Schedule.findOne({ schedID })
    if (!schedule) return res.status(404).json({ error: "Schedule not found" })

    for (const cls of schedule.classes) {
      const daysMap = { 1: "MO", 2: "TU", 3: "WE", 4: "TH", 5: "FR" }
      const dayLetters = cls.days.split("").map(d => daysMap[parseInt(d)]).filter(Boolean)

      await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: `${cls.name} (${cls.dept} ${cls.code})`,
          description: `Instructor: ${cls.instructorName}\nRoom: ${cls.roomNumber}, ${cls.buildingName}`,
          start: {
            dateTime: `2024-08-19T${cls.startTime.replace(/(AM|PM)/, '').trim()}:00`,
            timeZone: "America/Chicago"
          },
          end: {
            dateTime: `2024-08-19T${cls.endTime.replace(/(AM|PM)/, '').trim()}:00`,
            timeZone: "America/Chicago"
          },
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${dayLetters.join(",")};UNTIL=20241213T000000Z`
          ]
        }
      })
    }

    res.json({ message: "✅ Schedule synced to Google Calendar" })
  } catch (err) {
    console.error("❌ syncToGoogleCalendar error:", err.message)
    res.status(500).json({ error: "Failed to sync calendar" })
  }
}

module.exports = {
  initiateGoogleAuth,
  handleGoogleCallback,
  syncToGoogleCalendar
}
