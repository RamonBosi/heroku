const { Pool } = require('pg')

const database = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    // ssl: { rejectUnauthorized: false }
})

module.exports = database