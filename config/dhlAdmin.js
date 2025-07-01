require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const DHL_API_KEY = process.env.DHL_API_KEY;
const DHL_API_SECRET = process.env.DHL_API_SECRET;
const DHL_BASE_URL = process.env.DHL_BASE_URL;

module.exports = {
    DHL_API_KEY,
    DHL_API_SECRET,
    DHL_BASE_URL
}