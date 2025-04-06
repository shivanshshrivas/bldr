// utils/geminiParser.js
const axios = require("axios")
const dotenv = require("dotenv")
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

const parseWithGemini = async (transcriptText) => {
  const prompt = `
You are a JSON parser bot.

Given the following college transcript text, extract a clean JSON array.
Each object should contain:
- dept (e.g. EECS)
- classCode (e.g. 168)
- className (e.g. Programming I)
- semesterTaken (e.g. Fall 2022)
- creditHours (as a number)

Only respond with the JSON array and nothing else.

Transcript:
"""
${transcriptText}
"""
  `

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    })

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    const jsonStart = rawText.indexOf("[")
    const jsonEnd = rawText.lastIndexOf("]") + 1
    const jsonStr = rawText.slice(jsonStart, jsonEnd)
    const parsed = JSON.parse(jsonStr)

    return parsed
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message)
    throw new Error("Gemini parsing failed")
  }
}

module.exports = { parseWithGemini }
