// routes/suggestRoutes.js
const express = require("express")
const router = express.Router()
const { suggestClasses } = require("../controllers/suggestController")

router.post("/", suggestClasses)

module.exports = router
