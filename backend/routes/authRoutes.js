// routes/authRoutes.js
const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")
const { signupUser, loginUser } = require("../controllers/authController")

// Signup with transcript upload
router.post("/signup", upload.single("transcript"), signupUser)

// Login
router.post("/login", loginUser)

module.exports = router