const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
  : (() => {
      require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
      return new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
    })();

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

module.exports = pool;