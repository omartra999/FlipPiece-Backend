require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const { PORT, JWT_SECRET, URL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DIALECT } = process.env;

console.log('DB_DIALECT:', DB_DIALECT); // Debug: Remove after confirming

module.exports = { PORT, JWT_SECRET, URL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DIALECT };