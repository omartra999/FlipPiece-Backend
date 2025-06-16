const dotenv = require('dotenv');
const process = require('process');

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const { PORT, JWT_SECRET, URL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DIALECT } = process.env;

module.exports = { PORT, JWT_SECRET, URL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DIALECT };