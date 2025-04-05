const express = require("express")
const router = express.Router()
const { loginUser, signupUser } = require("../controllers/authController")

// POST /api/auth/login
router.post("/login", loginUser)

// POST /api/auth/signup
router.post("/signup", signupUser)

module.exports = router
