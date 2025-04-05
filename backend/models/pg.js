const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const connectPostgres = async () => {
  try {
    const client = await pool.connect()
    console.log("✅ Connected to PostgreSQL")
    client.release()
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message)
  }
}

module.exports = { pool, connectPostgres }
