// routes/searchRoutes.js
const express = require("express")
const router = express.Router()
const { searchClasses } = require("../controllers/searchController")

router.post("/", searchClasses)

module.exports = router
